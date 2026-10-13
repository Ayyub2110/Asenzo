import { NextRequest, NextResponse } from 'next/server';
import { validateAutomationAuth } from '@/lib/automation/auth';
import { checkIdempotency, saveIdempotency } from '@/lib/automation/idempotency';
import { createErrorResponse, ErrorCodes } from '@/lib/automation/errors';
import { findResearchAssignment, findResearchJob, insertResearchResult, queryResearchResults, CanonicalResearchResult } from '@/lib/automation/db';
import { resolveCanonicalWorkspaceId } from '@/lib/automation/workspace';

export async function GET(req: NextRequest) {
  const auth = await validateAutomationAuth(req);
  if (!auth.success) {
    return auth.response;
  }

  try {
    const workspaceId = await resolveCanonicalWorkspaceId(auth.context.workspaceId);
    const { searchParams } = new URL(req.url);

    const researchJobId = searchParams.get('research_job_id') || undefined;
    const researchAssignmentId = searchParams.get('research_assignment_id') || undefined;
    const classification = searchParams.get('classification') || undefined;
    const platform = searchParams.get('platform') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.has('limit') ? parseInt(searchParams.get('limit')!, 10) : 50;
    const offset = searchParams.has('offset') ? parseInt(searchParams.get('offset')!, 10) : 0;

    const result = await queryResearchResults(workspaceId, {
      research_job_id: researchJobId,
      research_assignment_id: researchAssignmentId,
      classification,
      platform,
      search,
      limit,
      offset
    });

    return NextResponse.json({
      success: true,
      data: {
        results: result.results,
        total: result.total,
        limit,
        offset
      }
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error querying research results';
    return createErrorResponse(ErrorCodes.INTERNAL_ERROR, msg, 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await validateAutomationAuth(req);
  if (!auth.success) {
    return auth.response;
  }

  if (!req.headers.get('idempotency-key')?.trim()) {
    return createErrorResponse(ErrorCodes.MISSING_FIELD, 'Idempotency-Key header is required', 400);
  }

  const idempotency = await checkIdempotency(req);
  if (idempotency.isDuplicate && idempotency.cachedResponse) {
    return idempotency.cachedResponse;
  }

  try {
    const body = await req.json();

    const required = ['research_job_id', 'research_assignment_id', 'source_url', 'source_type', 'platform', 'topic', 'claim', 'evidence_strength', 'confidence', 'research_agent'];
    const missing = required.find(field => typeof body[field] !== 'string' || !body[field].trim());
    if (missing) return createErrorResponse(ErrorCodes.MISSING_FIELD, `${missing} is required`, 400);
    if (!['observed_fact', 'inferred_pattern', 'ai_hypothesis'].includes(body.classification)) return createErrorResponse(ErrorCodes.VALIDATION_FAILED, 'invalid classification', 400);
    for (const field of ['evidence', 'audience_signals', 'market_signals', 'content_patterns', 'raw_source_reference']) {
      if (typeof body[field] !== 'object' || body[field] === null || Array.isArray(body[field])) return createErrorResponse(ErrorCodes.VALIDATION_FAILED, `${field} must be an object`, 400);
    }
    if (Object.keys(body).some(key => ['score', 'founder_similarity', 'competitor_similarity', 'dna_match', 'viral_score', 'idea_score', 'angle_score', 'winner_score', 'topic_ranking'].includes(key))) {
      return createErrorResponse(ErrorCodes.VALIDATION_FAILED, 'Phase 3 score fields are not accepted', 400);
    }
    const workspaceId = await resolveCanonicalWorkspaceId(auth.context.workspaceId);
    const job = await findResearchJob(body.research_job_id);
    const assignment = await findResearchAssignment(body.research_assignment_id);
    if (!job || job.workspace_id !== workspaceId) return createErrorResponse(ErrorCodes.NOT_FOUND, 'research job not found', 404);
    if (!assignment || assignment.workspace_id !== workspaceId || assignment.research_job_id !== job.id) return createErrorResponse(ErrorCodes.VALIDATION_FAILED, 'assignment does not belong to job and workspace', 400);

    const resultPayload: CanonicalResearchResult = {
      workspace_id: workspaceId,
      research_job_id: job.id!,
      research_assignment_id: assignment.id!,
      source_url: body.source_url,
      source_type: body.source_type,
      source_title: body.source_title,
      platform: body.platform,
      creator: body.creator,
      published_at: body.published_at,
      topic: body.topic,
      hook: body.hook,
      angle: body.angle,
      claim: body.claim,
      evidence: body.evidence,
      audience_signals: body.audience_signals,
      market_signals: body.market_signals,
      content_patterns: body.content_patterns,
      evidence_strength: body.evidence_strength,
      classification: body.classification,
      confidence: body.confidence,
      raw_source_reference: body.raw_source_reference,
      research_agent: body.research_agent,
      idempotency_key: idempotency.key
    };

    const createdResult = await insertResearchResult(resultPayload);

    const responsePayload = {
      success: true,
      data: createdResult
    };

    if (idempotency.key) {
      await saveIdempotency(
        idempotency.key,
        201,
        responsePayload,
        req.nextUrl.pathname,
        workspaceId
      );
    }

    return NextResponse.json(responsePayload, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invalid JSON or server error';
    return createErrorResponse(ErrorCodes.INVALID_INPUT, msg, 400);
  }
}
