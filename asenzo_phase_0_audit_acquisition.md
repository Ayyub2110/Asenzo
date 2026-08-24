# ACQUISITION CENTER — PHASE 0 AUDIT REPORT

## Audit Overview
This audit inspects the current ASENZO frontend repository to identify existing data models, components, and logic mapped to the newly defined Acquisition Center architectural requirements.

### Existing Domain Model Analysis
Looking at the current `src/lib/types/index.ts` and related UI modules:

*   **existing lead model**: MISSING. Currently, `Opportunity` inside `Conversion` only has a `leadName` string field. There is no independent `Lead` entity, `LeadEvent`, or journey history.
*   **existing contact model**: MISSING. No structured contact concept outside of the `leadName` string on the `Opportunity`.
*   **existing attribution**: MISSING. No `AttributionEvent`, source tracking, first/last touches, or journey tracking. 
*   **existing campaigns**: MISSING. No campaign objects to group acquisition efforts.
*   **existing forms / capture surfaces**: MISSING.
*   **existing CTA system**: MISSING.
*   **existing integrations**: MISSING / DEFERRED. The overall architecture (Phase 3) explicitly deferred external integrations.
*   **existing analytics**: PARTIAL. Dashboard logic exists in `Command Center`, but it expects summarized operational status and pipeline velocity, not acquisition, demand source, or intent metrics.
*   **existing CRM functionality**: PARTIAL. A sales pipeline exists in `ConversionData` (`Opportunity` mapped across `OpportunityStage`: QUALIFIED -> CLOSED_WON). This is purely BOF (Bottom of Funnel) and does not map Attention -> Capture -> Lead Qualification.
*   **existing outreach**: MISSING.
*   **existing Attention OS dependencies**: PARTIAL. The `AttentionData` model tracks `ContentIdea` and `MarketSignal` but there is no mechanism yet to link published content to inbound leads.

---

## Readiness Report

### Foundation
**PARTIAL**
*   **Exact issue:** `FoundationData` exists (`ICP`, `Offer`, `BrandVoice`) but is currently disconnected from any lead qualification logic.
*   **Affected module:** Acquisition / Foundation
*   **Affected file:** `src/lib/types/index.ts`
*   **Severity:** High
*   **Business impact:** Acquisition Center cannot qualify leads without directly consuming Foundation DNA.
*   **Recommended fix:** Expose Foundation entities (`ICP`, `Offer`) to the qualification engine.
*   **Production-blocking:** Yes

### Capture
**FAIL**
*   **Exact issue:** No domain models for `CaptureSurface`, `LeadMagnet`, or `CTA`.
*   **Affected module:** Acquisition / Capture
*   **Affected file:** New requirement
*   **Severity:** Critical
*   **Business impact:** Cannot legally or logically turn attention into identifiable demand.
*   **Recommended fix:** Implement Capture domain entities in Phase 2.
*   **Production-blocking:** Yes

### Attribution
**FAIL**
*   **Exact issue:** No models for `AcquisitionSource` or `AttributionEvent`.
*   **Affected module:** Acquisition / Attribution
*   **Affected file:** New requirement
*   **Severity:** Critical
*   **Business impact:** The system cannot answer "where did they come from?" making it impossible to optimize Attention.
*   **Recommended fix:** Implement first-touch/last-touch event streams.
*   **Production-blocking:** Yes

### Leads
**FAIL**
*   **Exact issue:** `Lead` does not exist as an independent entity (only a string on an `Opportunity`). No `LeadEvent` tracking. 
*   **Affected module:** Acquisition / Leads
*   **Affected file:** `src/lib/types/index.ts`
*   **Severity:** Critical
*   **Business impact:** Without a Lead object, we cannot distinguish between "Intent", "Unqualified Lead", and "Qualified Opportunity".
*   **Recommended fix:** Extract Lead from Opportunity, create standalone `Lead` and `LeadStatus` state machine.
*   **Production-blocking:** Yes

### Qualification
**FAIL**
*   **Exact issue:** Qualification is currently just a static boolean/object inside of the Deal stage but does not possess an intent model, AI override logic, or connection to Foundation ICP.
*   **Affected module:** Acquisition / Qualification
*   **Affected file:** New requirement
*   **Severity:** High
*   **Business impact:** Unqualified noise will pollute the Conversion pipeline. 
*   **Recommended fix:** Implement `Qualification` intent mapping and human override states.
*   **Production-blocking:** Yes

### Conversations
**FAIL**
*   **Exact issue:** No lightweight conversation or messaging object model exists.
*   **Affected module:** Acquisition / Conversations
*   **Affected file:** New requirement
*   **Severity:** Medium
*   **Business impact:** Manual outreach tracking is impossible prior to pipeline entry.
*   **Recommended fix:** Add `Conversation` and `ConversationMessage` objects.
*   **Production-blocking:** No (can be Phase 6)

### Campaigns
**FAIL**
*   **Exact issue:** No `AcquisitionCampaign` linking efforts to results.
*   **Affected module:** Acquisition / Campaigns
*   **Affected file:** New requirement
*   **Severity:** Medium
*   **Business impact:** Lack of cohort attribution.
*   **Recommended fix:** Build the campaign mapping layer linking Content -> Strategy -> Outcome.
*   **Production-blocking:** No (can be Phase 7)

### Intelligence
**FAIL**
*   **Exact issue:** No mechanisms exist to detect acquisition bottlenecks (e.g., Attention to Capture dropoff).
*   **Affected module:** Acquisition / Intelligence
*   **Affected file:** New requirement
*   **Severity:** High
*   **Business impact:** The ultimate loop of (Attention -> Actionable Insight -> Improved Attention) breaks.
*   **Recommended fix:** Build Intelligence aggregations for source quality and bottlenecks.
*   **Production-blocking:** No (can launch manually first)

### Integrations
**FAIL**
*   **Exact issue:** Event ingestion webhooks or standardized endpoints do not exist.
*   **Affected module:** External Integration / APIs
*   **Affected file:** Missing `api/webhooks` or equivalent.
*   **Severity:** Critical
*   **Business impact:** External demand (landing pages, forms) cannot feed the engine.
*   **Recommended fix:** Build event ingestion logic and validation.
*   **Production-blocking:** Yes

### Security
**PARTIAL**
*   **Exact issue:** Workspace isolation acts conceptually as deferred abstract rules, but no actual multi-tenant auth or isolation logic exists in the Next.js app.
*   **Affected module:** Core System
*   **Affected file:** Global
*   **Severity:** Critical
*   **Business impact:** Leakage across workspaces could violate privacy.
*   **Recommended fix:** Enforce workspace RLS policies or frontend tenant filters.
*   **Production-blocking:** Yes

### Privacy
**FAIL**
*   **Exact issue:** Data minimization logic, anonymization, or right-to-delete flows do not exist for CRM contacts.
*   **Affected module:** Core System
*   **Affected file:** New
*   **Severity:** High
*   **Business impact:** Compliance risk as we capture PII.
*   **Recommended fix:** Build privacy controls during Lead model implementation.
*   **Production-blocking:** Yes

### Reliability
**PARTIAL**
*   **Exact issue:** System uses mock data arrays rather than a reliable database or event sourcing logic, so race conditions and duplications aren't handled yet.
*   **Affected module:** Adapters
*   **Affected file:** `src/lib/adapters/index.ts`
*   **Severity:** Critical (for production)
*   **Business impact:** Lost leads, corrupt events.
*   **Recommended fix:** Move to real relational database mapping.
*   **Production-blocking:** Yes

### Testing
**FAIL**
*   **Exact issue:** No E2E tests for the acquisition flow.
*   **Affected module:** QA
*   **Affected file:** Missing
*   **Severity:** High
*   **Business impact:** Zero confidence in event tracking.
*   **Recommended fix:** Introduce E2E Cypress or Playwright tests for the core Acquisition loop.
*   **Production-blocking:** Yes

### Handoff
**FAIL**
*   **Exact issue:** Handoff state from Acquisition to Conversion isn't modeled. 
*   **Affected module:** Core Pipeline
*   **Affected file:** `src/lib/types/index.ts`
*   **Severity:** High
*   **Business impact:** Missing the architectural bridge between qualified demand and closed-won deals.
*   **Recommended fix:** Add a `READY_FOR_HANDOFF` Lead status and the instantiation trigger for Conversion.
*   **Production-blocking:** Yes
