# ASENZO Phase 3 Product & System Design (ABSTRACTION FREEZE)

## 1. Product System Architecture
The Phase 3 architecture defines logical capabilities and responsibilities while deferring all specific technology choices. The product system is separated into the following logical layers:

*   **Frontend / Presentation Layer**: Handles user interfaces, user interactions, view components, forms, actions, and client-side states. 
*   **Application / Business Logic Layer**: Enforces business rules, executes data validation, controls canonical state manipulation, manages permissions, calculates recommendation logic, and tracks workflow state.
*   **Data Layer**: Serves as the repository for canonical business records. Defines structural relationships, ensures persistence requirements, and manages audit trails.
*   **Intelligence Layer**: A logical cross-product capability responsible for business analysis, bottleneck detection, actionable recommendations, content intelligence categorization, drafting capabilities, and dataset confidence/quality handling. Represents an internal orchestration capability rather than a specific external vendor.
*   **Automation / Orchestration Layer (e.g., n8n)**: Handles webhook receipt, schedules jobs, triggers external integration boundaries, reports automation tracking statuses, and orchestrates workflows. This layer remains purely orchestration and never becomes the canonical source of business state.
*   **External Integration Layer**: An abstract placeholder layer mapping boundary interfaces to third parties. Payments, emails, calendars, scraping, and AI are unassigned logical boundaries at this phase.

## 2. Logical System Boundaries
The frozen user-facing product architecture is firmly bound to the founder's interaction model:
*   **Command Center**
*   **Foundation**
*   **Attention**
*   **Conversion**
*   **Delivery**
*   **Retention**
*   **Settings**

These operate supported by cross-product capabilities acting invisibly behind the UI: Intelligence, AI logic, Automation, Founder Independence calculations, Analytics aggregation, Recommendation formulation, Experiments tracking, and Audit History correlation.

## 3. Domain Architecture
The canonical data structures prioritize strict relational logic underpinning the MVP:
*   **Foundation Domain**: Captures structural Business DNA, ICP limits, Brand Voice, Founder Voice, and Offer definitions. 
*   **Attention Domain**: Orchestrates content architecture traversing Ideas, Funnel Stages (TOF/MOF/BOF), Angles, Frameworks, Formulas, Hooks, Scripts, to eventual Publishing/Performance. Supported by abstracted Market and Competitor intelligence tracking.
*   **Conversion Domain**: Maps the pipeline from Leads via Qualification structures to active Sales Calls, Objection handling, Follow-ups, and Proposals. Closer Room intelligence derives states based on these entities. 
*   **Delivery Domain**: Represents the execution contract following the deterministic Closed-Won handoff. Maps the Delivery Project, referenced Offer Templates, Milestones, Tasks, and consequent Client Outcomes.
*   **Command Center Domain**: Aggregates the Business Pulse mapping the Primary Constraint, Today's Actions, Weekly Directives, and the Founder Independence abstraction.

## 4. Functional Relationships
*   **Closed-Won Handoff**: A deterministically mapped pipeline rule triggers the instantiation of Delivery capabilities from successfully resolved Conversion Opportunities.
*   **Content Generation Flow**: Market and Competitor signals route logic sequentially into Opportunities, which transform hierarchically into Content Scripts. 
*   **Intelligent Bottlenecks**: Global state evaluates against deterministic capacity thresholds mapped in the Business Logic Layer to surface Primary Constraints in the Command Center. 

## 5. Information Flows
*   *Command Center Data Flow*: The system retrieves current workload logic spanning the core growth domains and surfaces prioritized actionable recommendations compiled by the Intelligence Layer. 
*   *Content Intelligence Flow*: An intelligence/automation process generates a structured script draft utilizing strictly the configured foundation context (ICP, Brand Voice) combined with chosen frameworks.
*   *Financial Data Flow*: Revenue data mapping may be supported by a future external integration boundary; this is not part of the active MVP scope. 

## 6. Intelligence Boundaries
The intelligence layer exclusively interprets Application Data generated directly by the platform. It identifies pipeline frictions, stalled deals, or founder-dependent roadblocks, surfacing observations and subsequent actionable Directives to the UI without relying inherently on black-box external AI unprompted APIs.

## 7. Automation Boundaries
The automation layer communicates via standard abstract data exchange patterns. It executes intensive distributed logic (organic outreach grouping, scraping operations, scheduled publish requests) externally and relays resulting statuses back to the core data layer for presentation within ASENZO. 

## 8. Human Approval Boundaries
Crucial operational transitions remain insulated by explicit Founder intervention nodes:
*   AI-drafted content requires founder review before state promotion to Publish/Production ready.
*   External outreach routines demand founder configuration locking before entering RUNNING states. 
*   Significant Pipeline progressions are manual assertions.

## 9. Data Ownership Principles
The Application Backend logic (running against the Data Layer) remains the absolute source of truth. Automations mapping outside the tool operate transiently; they cannot overwrite canonical business state without firing standard verified payload updates verified through the Application Layer. 

## 10. Automation-Status Principles
All interfaces requiring feedback from external orchestration rely on a rigid logical state map. UI rendering adjusts dynamically depending on these specific states:
`NOT_CONFIGURED`, `CONNECTED`, `READY`, `RUNNING`, `SUCCESS`, `PARTIAL`, `FAILED`, `DISABLED`, `REQUIRES_REVIEW`.

## 11. Security Principles
Abstract capabilities mandate session demarcation isolating distinct workspace access, enforcing strict role-based capability boundaries, and validating parameter inputs logically at the interaction gateways before entering canonical databases.

## 12. Audit Principles
All deterministic actions fired via the Application layer (whether initiated by the human interaction interface or by incoming automation requests) generate abstract event footprints tracking lifecycle changes across Domain objects establishing the base for the Founder Independence metrics.

## 13. Error-State Principles
Exceptions stemming from orchestration failures, content generation loops, or data desyncs map directly back to a `REQUIRES_REVIEW` UI abstraction empowering the founder to resolve states manually without collapsing the active session. 

## 14. UI/System Interaction Principles
The Presentation Layer assumes logicless rendering. The layer focuses exclusively on interface delivery, transmitting action commands downward iteratively, waiting for the Business Layer to synchronously push state confirmations upward. 

## 15. Technology Decision Placeholders (DEFERRED)
In adherence to separating product requirements from specific technological environments, all technologies remain explicitly unselected. 

*   **FRONTEND TECHNOLOGY**: 
    Status: DEFERRED
*   **BACKEND TECHNOLOGY**: 
    Status: DEFERRED
*   **DATABASE TECHNOLOGY**: 
    Status: DEFERRED
*   **AI PROVIDER / AI MODEL**: 
    Status: DEFERRED
*   **N8N IMPLEMENTATION DETAILS**: 
    Status: DEFERRED
*   **EXTERNAL INTEGRATIONS**: 
    Status: DEFERRED
*   **HOSTING / INFRASTRUCTURE**: 
    Status: DEFERRED
*   **OBSERVABILITY STACK**: 
    Status: DEFERRED

### MVP Constraints & Exclusions
*   No payment gateways (e.g., Stripe) are scoped for the MVP demo. Revenue representations are logical placeholders pending later technical implementations.
*   No external AI Service is mapped as an architectural dependency; AI implies a logical, abstracted rule/orchestration grouping boundary only.
*   Application technology languages and frameworks represent post-Phase 3 engineering decisions.

---
Phase 3 establishes purely theoretical, logic-driven product architecture systems uncoupled from proprietary vendor implementation requirements. DO NOT begin User Experience Mapping (Phase 4), framework boilerplate generation, database design, or visual modeling until officially transitioned.
