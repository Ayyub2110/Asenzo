# Feature Priority Matrix

Every feature must earn its way into ASENZO. We evaluate features based on their direct impact on the **Founder Independence Score (FIS)** vs. the **Implementation Complexity**.

## Priority 1: Do Now (High Impact, Low/Mid Complexity)
These are critical to the MVP and must be finalized immediately.
*   **Foundation DNA Intake**: The forms and data models that capture ICP, Positioning, and Business Truth.
*   **FIS Score Calculation**: Deterministic calculation of the Founder Independence Score based on connected platforms and manual inputs.
*   **Basic Command Center Dashboard**: Simple visualization of Active Bottlenecks and Next Moves.
*   **Kanban Deal Pipeline**: Drag-and-drop or status-driven deal tracking.
*   **Content Pillars**: The ability for founders to organize their content ideas.

## Priority 2: Do Next (High Impact, High Complexity)
These provide immense value but require careful engineering.
*   **Automated Content Script Generation**: AI-driven content generation that strictly adheres to the Foundation DNA and Voice Ingest.
*   **DM Triage & Scoring**: Automating the qualification of inbound leads based on predefined rules.
*   **Sales Call Coaching Logs**: Post-call AI analysis against the founder's objection library.

## Priority 3: Do Later (Low Impact, Low Complexity)
"Nice to haves" that should not distract from the core loop.
*   **Advanced Calendar Integrations**: Basic manual entry is fine for MVP; full 2-way Google Calendar sync comes later.
*   **Custom Notifications / AI Insights**: Beyond deterministic bottlenecks, fully generative "insights" are deferred.
*   **Multiple Workspaces / Multi-tenant Team Members**: MVP assumes a single founder or an extremely lean team sharing a login.

## Priority 4: Don't Do (Low Impact, High Complexity)
Avoid these entirely.
*   **Native Email Campaign Sending**: We are not replacing Mailchimp or ActiveCampaign. ASENZO integrates with them via n8n.
*   **Full Native Social Auto-Publishing**: Avoid direct API calls for publishing. Output the content and let the founder use Buffer/Hypefury, or use n8n.
*   **Native Video Hosting**: For VSLs or sales calls, embed YouTube/Vimeo/Zoom links rather than hosting heavy video files natively.

## Decision Rule
Before proposing a new feature or module, answer:
*"Does this feature measurably increase the founder's FIS score by removing a specific bottleneck?"*
If the answer is no, it does not enter the roadmap.
