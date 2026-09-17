import { NextRequest } from 'next/server';
import { POST as intelligenceCardsPost, GET as intelligenceCardsGet } from '../src/app/api/automation/intelligence-cards/route';
import { POST as audienceDnaPost, GET as audienceDnaGet } from '../src/app/api/automation/audience-dna/route';
import { setAdminSupabaseClient } from '../src/lib/supabase/admin';
import { CANONICAL_DEFAULT_WORKSPACE_ID, isValidUuid, clearWorkspaceResolutionCache } from '../src/lib/automation/workspace';

const TEST_SECRET = 'test-persistence-secret-token';
process.env.ASENZO_AUTOMATION_API_KEY = TEST_SECRET;

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: unknown) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`, detail !== undefined ? detail : '');
    failed++;
  }
}

function createReq(url: string, method = 'GET', body?: unknown, headers: Record<string, string> = {}) {
  const finalHeaders: Record<string, string> = {
    'x-automation-token': TEST_SECRET,
    'Content-Type': 'application/json',
    ...headers
  };

  const init: RequestInit = {
    method,
    headers: finalHeaders
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  return new NextRequest(new URL(url, 'http://localhost:3000'), init as any);
}

// In-memory mock DB to verify exact Supabase interactions
interface MockDbState {
  workspaces: Array<{ id: string; name: string; slug: string }>;
  intelligence_cards: Array<Record<string, unknown>>;
  audience_dna: Array<Record<string, unknown>>;
  insertCalls: Array<{ table: string; payload: unknown }>;
  shouldFailInsert?: boolean;
}

function createMockSupabaseClient(state: MockDbState) {
  return {
    from: (table: string) => {
      let filterColumn: string | null = null;
      let filterValue: unknown = null;

      const builder: any = {
        select: (_cols?: string) => builder,
        eq: (col: string, val: unknown) => {
          filterColumn = col;
          filterValue = val;
          return builder;
        },
        order: (_col: string, _opts?: unknown) => builder,
        limit: (n: number) => builder,
        single: async () => {
          if (table === 'workspaces') {
            const found = state.workspaces.find(w => 
              filterColumn === 'slug' ? w.slug === filterValue :
              filterColumn === 'id' ? w.id === filterValue : false
            );
            if (found) return { data: found, error: null };
            return { data: null, error: { message: 'Row not found' } };
          }
          return { data: null, error: { message: 'Not found' } };
        },
        maybeSingle: async () => {
          if (table === 'workspaces') {
            const found = state.workspaces.find(w => 
              filterColumn === 'slug' ? w.slug === filterValue :
              filterColumn === 'id' ? w.id === filterValue : false
            );
            return { data: found || null, error: null };
          }
          if (table === 'audience_dna') {
            const found = state.audience_dna
              .filter(d => filterColumn ? d[filterColumn] === filterValue : true)
              .sort((a, b) => ((b.version as number) || 0) - ((a.version as number) || 0))[0];
            return { data: found || null, error: null };
          }
          return { data: null, error: null };
        },
        insert: (record: Record<string, unknown>) => {
          state.insertCalls.push({ table, payload: record });

          if (state.shouldFailInsert) {
            return {
              select: () => ({
                single: async () => ({
                  data: null,
                  error: { message: 'violates foreign key constraint or invalid syntax' }
                })
              })
            };
          }

          const inserted = {
            ...record,
            id: record.id || crypto.randomUUID()
          };

          if (table === 'intelligence_cards') {
            state.intelligence_cards.push(inserted);
          } else if (table === 'audience_dna') {
            state.audience_dna.push(inserted);
          }

          return {
            select: () => ({
              single: async () => ({ data: inserted, error: null })
            })
          };
        },
        upsert: (record: Record<string, unknown>) => {
          if (table === 'workspaces') {
            const existingIdx = state.workspaces.findIndex(w => w.id === record.id);
            if (existingIdx >= 0) {
              state.workspaces[existingIdx] = { ...state.workspaces[existingIdx], ...record } as any;
            } else {
              state.workspaces.push(record as any);
            }
          }
          return {
            select: () => ({
              single: async () => ({ data: record, error: null })
            })
          };
        }
      };

      // Handle direct awaiting for queries that return arrays (e.g. .select().eq().order().limit())
      builder.then = (resolve: (val: any) => void) => {
        if (table === 'intelligence_cards') {
          const results = state.intelligence_cards.filter(c =>
            filterColumn ? c[filterColumn] === filterValue : true
          );
          resolve({ data: results, error: null });
        } else if (table === 'audience_dna') {
          const results = state.audience_dna.filter(c =>
            filterColumn ? c[filterColumn] === filterValue : true
          );
          resolve({ data: results, error: null });
        } else {
          resolve({ data: [], error: null });
        }
      };

      return builder;
    }
  } as any;
}

async function runTests() {
  console.log('\n======================================================');
  console.log('CANONICAL PERSISTENCE TESTS (SUPABASE & WORKSPACE RESOLUTION)');
  console.log('======================================================\n');

  // TEST A: POST intelligence card with default-workspace
  console.log('[Test A] POST intelligence card with default-workspace');
  {
    clearWorkspaceResolutionCache();
    const dbState: MockDbState = {
      workspaces: [{ id: CANONICAL_DEFAULT_WORKSPACE_ID, name: 'Primary Workspace', slug: 'default-workspace' }],
      intelligence_cards: [],
      audience_dna: [],
      insertCalls: []
    };
    setAdminSupabaseClient(createMockSupabaseClient(dbState));

    const req = createReq('/api/automation/intelligence-cards', 'POST', {
      source_type: 'sales_call',
      category: 'objection',
      signal_type: 'pricing',
      exact_language: 'We cannot afford this right now',
      confidence: 0.9
    }, { 'x-workspace-id': 'default-workspace' });

    const res = await intelligenceCardsPost(req);
    const json = await res.json();

    assert(res.status === 201, 'Returns HTTP 201 Created');
    assert(json.success === true, 'Response contains success: true');
    assert(isValidUuid(json.data?.id), `Returned ID is a valid UUID: ${json.data?.id}`);
    assert(!json.data?.id.startsWith('intel_'), 'ID does not start with legacy prefix intel_');
    assert(json.data?.workspace_id === CANONICAL_DEFAULT_WORKSPACE_ID, 'Resolves default-workspace to canonical UUID in returned data');

    // Verify DB call payload
    const cardInsert = dbState.insertCalls.find(c => c.table === 'intelligence_cards');
    assert(Boolean(cardInsert), 'Performed insert into public.intelligence_cards');
    const payload = cardInsert?.payload as Record<string, unknown>;
    assert(payload.workspace_id === CANONICAL_DEFAULT_WORKSPACE_ID, 'Inserted record contains canonical workspace UUID');
    assert(payload.id === undefined || isValidUuid(payload.id as string), 'Payload id is undefined or valid UUID (not intel_...)');
  }

  // TEST B: POST intelligence card with invalid database data / DB error
  console.log('\n[Test B] POST intelligence card with DB error does NOT return fake success');
  {
    const dbState: MockDbState = {
      workspaces: [],
      intelligence_cards: [],
      audience_dna: [],
      insertCalls: [],
      shouldFailInsert: true
    };
    setAdminSupabaseClient(createMockSupabaseClient(dbState));

    const req = createReq('/api/automation/intelligence-cards', 'POST', {
      source_type: 'sales_call',
      category: 'objection',
      signal_type: 'pricing',
      exact_language: 'Trigger error test'
    });

    const res = await intelligenceCardsPost(req);
    const json = await res.json();

    assert(res.status === 500, `Returns HTTP 500 on database failure (actual: ${res.status})`);
    assert(json.success === false, 'Response has success: false');
    assert(json.error?.code === 'INTERNAL_SERVER_ERROR', 'Returns INTERNAL_SERVER_ERROR code');
    assert(json.error?.message?.includes('Database error'), 'Error message surfaces database failure');
  }

  // TEST C: POST audience DNA with default-workspace
  console.log('\n[Test C] POST audience DNA with default-workspace');
  {
    clearWorkspaceResolutionCache();
    const dbState: MockDbState = {
      workspaces: [{ id: CANONICAL_DEFAULT_WORKSPACE_ID, name: 'Primary Workspace', slug: 'default-workspace' }],
      intelligence_cards: [],
      audience_dna: [],
      insertCalls: []
    };
    setAdminSupabaseClient(createMockSupabaseClient(dbState));

    const audienceDnaPayload = {
      workspace_id: 'default-workspace',
      source_type: 'audience_dna',
      category: 'AUDIENCE',
      dna_type: 'AUDIENCE',
      audience_dna: {
        core_pains: ['Founder delivery bottleneck'],
        core_desires: ['Automated pipeline'],
        fears: ['Wasted agency retainers'],
        frustrations: ['Unqualified leads'],
        beliefs: ['Organic content builds equity'],
        motivations: ['Scale to 8 figures'],
        aspirations: ['Predictable acquisition'],
        objections: ['Too generic'],
        decision_triggers: ['Maxed capacity'],
        awareness_patterns: ['Problem-aware'],
        natural_language: ['I need a growth OS']
      }
    };

    const req = createReq('/api/automation/audience-dna', 'POST', audienceDnaPayload);
    const res = await audienceDnaPost(req);
    const json = await res.json();

    assert(res.status === 201, 'Returns HTTP 201 Created');
    assert(json.success === true, 'Response contains success: true');
    assert(isValidUuid(json.data?.id), `Returned record id is a valid UUID: ${json.data?.id}`);
    assert(json.data?.workspace_id === CANONICAL_DEFAULT_WORKSPACE_ID, 'Resolves default-workspace to canonical UUID');
    assert(json.data?.version === 1, 'Assigned version 1');

    const dnaInsert = dbState.insertCalls.find(c => c.table === 'audience_dna');
    assert(Boolean(dnaInsert), 'Actually called insert on public.audience_dna');
    const dnaDbRecord = dnaInsert?.payload as Record<string, unknown>;
    assert(dnaDbRecord.workspace_id === CANONICAL_DEFAULT_WORKSPACE_ID, 'Persisted workspace_id is canonical UUID');
  }

  // TEST D: GET intelligence cards reads from Supabase
  console.log('\n[Test D] GET intelligence cards reads from Supabase');
  {
    clearWorkspaceResolutionCache();
    const mockCard = {
      id: crypto.randomUUID(),
      workspace_id: CANONICAL_DEFAULT_WORKSPACE_ID,
      source_type: 'customer_interview',
      category: 'pain',
      signal_type: 'bottleneck',
      exact_language: 'Cannot scale manually',
      recorded_at: new Date().toISOString()
    };
    const dbState: MockDbState = {
      workspaces: [{ id: CANONICAL_DEFAULT_WORKSPACE_ID, name: 'Primary Workspace', slug: 'default-workspace' }],
      intelligence_cards: [mockCard],
      audience_dna: [],
      insertCalls: []
    };
    setAdminSupabaseClient(createMockSupabaseClient(dbState));

    const req = createReq('/api/automation/intelligence-cards', 'GET');
    const res = await intelligenceCardsGet(req);
    const json = await res.json();

    assert(res.status === 200, 'Returns HTTP 200 OK');
    assert(json.success === true, 'Response contains success: true');
    assert(Array.isArray(json.data) && json.data.length === 1, 'Returns cards from Supabase');
    assert(json.data[0].exact_language === 'Cannot scale manually', 'Retrieved exact record from Supabase');
  }

  // TEST E: GET audience DNA reads from Supabase
  console.log('\n[Test E] GET audience DNA reads from Supabase');
  {
    clearWorkspaceResolutionCache();
    const mockDna = {
      id: crypto.randomUUID(),
      workspace_id: CANONICAL_DEFAULT_WORKSPACE_ID,
      version: 1,
      pain: ['High client churn'],
      status: 'active'
    };
    const dbState: MockDbState = {
      workspaces: [{ id: CANONICAL_DEFAULT_WORKSPACE_ID, name: 'Primary Workspace', slug: 'default-workspace' }],
      intelligence_cards: [],
      audience_dna: [mockDna],
      insertCalls: []
    };
    setAdminSupabaseClient(createMockSupabaseClient(dbState));

    const req = createReq('/api/automation/audience-dna?workspace_id=default-workspace', 'GET');
    const res = await audienceDnaGet(req);
    const json = await res.json();

    assert(res.status === 200, 'Returns HTTP 200 OK');
    assert(json.success === true, 'Response contains success: true');
    assert(json.data?.version === 1, 'Returns version 1');
    assert(json.data?.pain?.[0] === 'High client churn', 'Retrieved audience DNA from Supabase');
  }

  // TEST F: Production guard rejects missing Supabase client
  console.log('\n[Test F] Production guard rejects missing Supabase client');
  {
    const originalEnv = process.env.NODE_ENV;
    (process.env as Record<string, string>).NODE_ENV = 'production';
    setAdminSupabaseClient(null);

    const req = createReq('/api/automation/intelligence-cards', 'POST', {
      source_type: 'sales_call',
      category: 'objection',
      signal_type: 'pricing',
      exact_language: 'Production guard check'
    });

    const res = await intelligenceCardsPost(req);
    const json = await res.json();

    assert(res.status === 500, 'Rejects POST with HTTP 500 when Supabase is missing in production');
    assert(json.success === false, 'Does not return fake success in production');

    (process.env as Record<string, string>).NODE_ENV = originalEnv!;
  }

  console.log('\n======================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
