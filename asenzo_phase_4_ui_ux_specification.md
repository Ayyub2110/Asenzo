# ASENZO Phase 4 UI/UX Design Specification

## Overview
This document specifies the complete founder-facing experience for the ASENZO Growth Operating System. The design merges the newly structured Phase 2/3 functionality with the established, premium "Ambient OS" visual language. 

**Core Product UI Principles:**
*   ACTION > ANALYTICS
*   Contextual Intelligence
*   Founder Control & Human Approval
*   Single Source of Truth
*   No Blank Canvases (Always contextual)
*   Simplicity over Feature Volume
*   Organic Demand Focus Only

---

## 1. Existing UI / Design-Language Audit
The current, verified ASENZO interface utilizes an "Executive Precision / Ambient OS" visual identity inspired by Apple-tier enterprise software:
*   **Typography**: Combination of Geist (Headlines/Display/Stats) and Inter (Body/Functional). Highly legible, clean spacing.
*   **Colors**: Obsidian Black (`#18181B` to `#0B0C0E` gradients in the sidebar) contrasted sharply against a pristine White/Light Canvas (`#FFFFFF` on `#F4F5F7` background).
*   **Accents**: Electric Blue (`#3B82F6`) for primary actions, Growth Emerald (`#10B981`) for success/growth vectors.
*   **Border/Radius**: Soft, premium rounding. Large radii (`32px` to `48px` for the sidebar, `24px` for the main wrapper), with `12px` to `16px` for internal cards.
*   **Shadows**: Deep but soft elevation shadowing (`0 4px 20px rgba(0,0,0,0.04)` for cards).
*   **Material Symbols Outlined**: Used consistently for iconography, offering a structured, lightweight look.

## 2. Global Navigation
*   **Left Sidebar**: Dark, float-styled layout containing the persistent navigation.
    *   **Collapsible**: Supports a minimized state, collapsing text to show only tooltips and icons.
    *   **Hierarchy**: 
        *   Command Center (Default)
        *   Foundation (Business Truth)
        *   Attention 
        *   Conversion
        *   Delivery
        *   Retention
    *   **Cross-Product Capabilities**: Intelligence, Action Queue (with un-actioned count badges), Operator OS, Growth Schedule. 
    *   **Bottom Stack**: Settings & Help.

## 3. Global Layout Structure
*   **Top Bar**: Sticky, glassmorphism (`backdrop-filter: blur(12px)`) header. Contains the page title on the left, and global interactions (Global Search Cmd+K launcher, Notifications, Profile) on the right.
*   **Main Canvas**: Light surface nested inside the window bounds, retaining a distinct border and drop shadow separating it from the dark background.
*   **Content Area**: 1200px max-width, cleanly padded, vertically scrollable.
*   **Contextual Right Panel / Modals**: Deep interactions (AI Coach, editing records) surface as either slide-over right panels or center-aligned modal cards (`modal-lg`).

## 4. Design-Language Rules Extracted
*   **Borders**: Delicate, high-contrast borders indicating interactive elements (`#E2E8F0`).
*   **Status Badges**: Small rounded pill shapes (`#F1F5F9` bg, text-colored dots) indicating the state of objects (e.g., Conversion stages or Intelligence tags).
*   **Spacing**: Generous internal padding (24px for macro cards, 16px for micro components) ensuring elements breathe.
*   **Modals**: Use blurred overlays (`rgba(0,0,0,0.4)`) keeping the modal card entirely opaque and elevated.

## 5. Reusable Component Inventory
*   **Zone Grid (4-up)**: Core navigational launcher within modules.
*   **Stat Cards**: Numeric aggregations containing a sparkline, Delta pill (e.g., `+12%`), and description. 
*   **Pill Buttons**: (`btn-primary` block-colored, `btn-secondary` outlined).
*   **Action Row / Pipeline Strip**: Compact list elements used to tally pipeline status sequentially.
*   **Form Groups**: Stacked `label` + `input`/`textarea` with consistent `#CBD5E1` borders.
*   **Command Palette (âŒ˜K)**: Global search overlay executing context navigation or quick actions.

---

## 6. Command Center UX
**Goal**: The daily execution hub answering, *"What needs my attention right now?"*
*   **Header**: Founder Independence Score (FIS) prominently displayed as the northstar metric.
*   **Business Pulse Strip**: 4-stat grid rendering today's pipeline, active client health, pending actions, and active content pieces.
*   **Primary Constraint Alert**: A highlighted block surfaced by the Intelligence Engine, diagnosing the single biggest bottleneck (e.g., "Attention Deficit: Only 1 TOF post this week").
*   **Action Center**: A concise checklist of generated directives and pending human approvals (e.g., "Approve Script Draft", "Review Sales Call Coaching").
*   **Rule**: Not a BI Dashboard. All metrics lead directly to an action button.

## 7. Foundation UX
**Goal**: The strategic source of truth, heavily structured, progressive, and intentionally guided.
*   **Layout**: Tabbed interface (Core DNA, ICP, Offer Builder, Voice Ingestion).
*   **Inputs**: Instead of a "giant form", leverage progressive disclosure. Use concise text areas.
*   **Voice Configuration**: Explicit physical separation between "Founder Voice" (personal style) and "Brand Voice" (company tone).
*   **UX Guidance**: Inline placeholder suggestions illustrating high-quality DNA structure. 
*   **Data Readiness Indicator**: Visual readiness score (e.g., "Foundation Data: 85% Complete") showing the founder when the system holds enough context to run intelligence effectively.

## 8. Attention UX
**Goal**: The Organic Content Strategy Engine.
*   **Overview Dashboard**: Visualizes the Content Workload funnel: Ideas â†’ Scripts â†’ Production â†’ Published. Highlights Opportunities detected by Market/Competitor intelligence. 
*   **The Script Builder (Contextual Canvas)**: Contains no blank pages. 
    *   **Side-by-Side View**: Left panel configures parameters (Idea, TOF/MOF/BOF, Angle, Framework, Output Goal). Right panel previews the AI-drafted output.
    *   **Human Approval**: The generated script is locked in a "Review" state until the founder explicitly edits and hits "Approve for Production."
*   **Funnel Stage Visuals (TOF/MOF/BOF)**: Explicit tagging systems globally applied formatting.
    *   TOF indicates Discovery goals.
    *   MOF indicates Trust goals.
    *   BOF indicates Intent/Conversion goals.
*   **Outreach & Intelligence Workflow**: Modals explicitly show where data originated (e.g., "Sourced from Market Signal: [Topic]"). Outreach drafts sit in a dedicated "Pending Send Review" queue.

## 9. Conversion UX
**Goal**: Converting attention to pipeline revenue securely.
*   **Pipeline Interface**: A Kanban, column-based architecture representing standard stages (Qualified Lead â†’ Call Scheduled â†’ Proposal â†’ Closed Won).
*   **The Closer Room (Contextual)**: When clicking a Deal, a modal/slideover opens. It embeds sales call logs, generated objection handling, and proposal generation constraints tied to the specific lead.
*   **AI Boundary**: Content intelligence provides insights or suggested follow-ups inside the Closer Room, but *never* changes the Deal Stage autonomously. 

## 10. Delivery UX
**Goal**: Service fulfillment logic triggering automatically from Closed-Won deals.
*   **Project Board**: List or Grid view displaying Client engagements. Never a generic "blank project".
*   **Automated Instantiation**: Projects explicitly reference their origin (e.g., "Onboarding: Sourced from Opportunity X").
*   **Client Health Indicator**: Green/Yellow/Red statuses aggregating milestone completion speed against expected Offer Templates.

## 11. Retention UX
**Goal**: Downstream lifetime value tracker. (P2 Focus).
*   **Layout**: Simple list mapping current clients to Risk / Renewal / Expansion factors.
*   **UI Callout**: Clearly marked as a "Future Capability" where expansion logic remains abstracted for later capability scaling.

## 12. Settings UX
**Goal**: Administrative logic without becoming an ERP monster.
*   **Sections**: Workspace Access, Billing Placeholder, API Config Placeholder, Automation Hub Config.
*   **Integrations**: Depicted as abstract placeholders (Mail provider, Calendar, n8n Orchestrator). 

---

## 13. Cross-Product Intelligence UX
*   **Pattern**: Contextual Action Cards, Inline Directives, and Highlight Panels.
*   **Placement**: Pushed directly to the Command Center and embedded natively at the top of relevant module screens (e.g., an Alert card within Conversion saying "3 Deals have gone stale").
*   **Avoidance**: Do not create a separate "Intelligence Page" requiring navigating away from work. 

## 14. Automation-Status UX
**Goal**: Explicit transparency.
*   **Component**: Defined dynamic badge tags mapping to standard system states.
    *   `NOT_CONFIGURED` (Grey)
    *   `CONNECTED` / `READY` (Blue)
    *   `RUNNING` (Yellow/Animated)
    *   `SUCCESS` (Green)
    *   `FAILED` / `REQUIRES_REVIEW` (Red, explicitly asking for intervention)
    *   `DISABLED` (Muted)
*   **Empty State Rule**: If data is missing because automation isn't configured, display "Automation Not Configured", *never* a random empty char chart. 

## 15. AI Interaction UX
*   **No Generic Chatbots**: No general "Ask AI" page. AI surfaces strictly via targeted forms (e.g., "Draft Script utilizing XYZ Framework").
*   **Visual State**: Generated text uses a distinct highlighted background (e.g., soft blue `#EFF6FF`) until edited or approved by the human, rendering the "AI" attribution unmistakably transparent.
*   **Workflow Explicit**: Trigger â†’ Generate â†’ Human Review â†’ Human Approve â†’ Execute.

## 16. Empty / Loading / Error States
*   **First Use**: Guided empty states focusing on configuring Foundation elements.
*   **Missing Data**: Clear illustrations/text delineating *No Data* versus *Automation Configuration Missing*.
*   **Loading**: Ambient skeletal loaders matching exactly the component radius and margin they replace. Continuous spinners for "Waiting on AI generation."
*   **Errors**: Red outlined toaster alerts or contextual boundary boxes detailing the exact failure and actionable resolution.

## 17. Responsive Behavior
*   **Desktop Primary**: Built specifically for wide displays (laptop+). 
*   **Mobile Degradation**: The sidebar collapses into a hamburger menu overlay. Kanban columns degrade into stacked accordion lists. The Command Palette remains fully operable.

## 18. User Journeys
1.  **Morning Triage**: Log in â†’ Check Command Center â†’ Read Primary Constraint â†’ Approve pending Content Drafts in Action Center.
2.  **Content Creation**: Navigate to Attention â†’ Select Market Opportunity â†’ Choose BOF Angle â†’ AI Drafts from Foundation Voice â†’ Founder Edits & Approves.
3.  **Sales Post-Call**: Navigate to Conversion â†’ Enter Closer Room â†’ Log Transcript â†’ Intelligence updates Deal properties manually verified by founder â†’ Generate Proposal. 

## 19. Screen-by-Screen Information Architecture
*   **Command Ctr**: FIS Score | Constraints | Action Center | Pulse Grid
*   **Foundation**: Business DNA | Voice Intake | Offer Builder | Readiness Score
*   **Attention Overview**: Workload Funnel | Opportunities | Attention Drafts Queue
*   **Attention Scripting**: Idea params | Frameworks | Draft Canvas
*   **Conversion**: Kanban | Lead List | Specific Closer Room (Slideover)
*   **Delivery**: Project Manifest | Milestones | Client Health

## 20. Interaction Rules
*   **Modals close**: via explicit X button, clicking background overlay, or Escape key.
*   **Save operations**: Require explicit Confirm clicks (Autosave restricted to text-input drafts only).
*   **Sidebars**: Remain sticky on the left.
*   **Transitions**: Soft 0.15s ease transitions preserving the premium feeling (utilizing `tailwind classes transition-all ease-in-out duration-150`).

## 21. Accessibility Considerations
*   Maintain minimum 4.5:1 contrast ratios across the `#FFFFFF` and `#F4F5F7` surfaces against dark grays.
*   Focus outlines explicitly added to all input forms and buttons (`focus:ring-2 placeholder-gray-400`).

---
## 22. Phase 4 Acceptance Criteria
- [ ] Preserves existing UI ambient design rules completely. (No new generic SaaS designs).
- [ ] Specifies functionality strictly following the frozen Phase 2 PRD.
- [ ] No technical implementations, coding stacks, or database structures chosen or referenced.
- [ ] MVP boundary excludes payment integrations.
- [ ] AI remains a logical interface sequence reliant on human approval.
- [ ] Automation statuses are fully contextualized natively in the UX.

**Design Phase Output Verified & Ready.**
*Do not proceed to Phase 5 Engineering / Frontend Development without explicit authorization.*
