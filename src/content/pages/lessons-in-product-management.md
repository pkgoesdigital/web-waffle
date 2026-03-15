---
id: "13"
title: "Lessons in Product Management"
slug: "lessons-in-product-management"
date: "2026-02-10"
subtitle: "2 years in, a retrospective"
status: "publish"
featured: true
---

Two years ago I transitioned from software engineering into product management at a national manufacturing company in the middle of an enterprise technology transformation. The company was migrating off JD Edwards — a legacy ERP that had been running operations for decades — onto a modern stack spanning Nextworld, Salesforce, Microsoft Fabric, Power BI, and a custom Next.js monorepo. The team was small: three engineers, two technical product managers, and two directors. The scope was not.

What follows are the lessons that stuck. Not best practices from a textbook, but patterns I watched play out across vendor negotiations, ERP implementations, BI platform migrations, factory floor visits, and a lot of standups.

Strategy has to stay ahead of the build, or you end up building the wrong thing twice.

Early on, the team attempted an epic progression approach — sequencing work into neat epics that would build on each other. It fell apart. Too many vendors were developing in isolation, too many integrations needed to be tested simultaneously, and coordinating across Nextworld, Salesforce, and an in-house engineering team meant the dependencies outnumbered the deliverables.

The adjustment was to front-load strategy. Before any sprint commitment, the product managers built proof-of-concepts, identified technical limitations, and researched workarounds. Roadblocks got eliminated before development started, not after. That shift in sequencing — strategy first, then scope, then build — reduced the number of mid-sprint redirects and gave engineers the room to write code instead of rewriting requirements.

The proof-of-concept habit also served as a forcing function for honest conversations. When a vendor's feature didn't work as documented, the POC made it visible before the team had committed sprint capacity to it.

The parallel rule on the BI side: no work is staffed unless it's been logged in intake and acknowledged by both the Product Manager and the Project Lead. No exceptions outside of a documented expedite lane requiring director-level approval and a written tradeoff. That single constraint — the "no work without intake" rule — is what keeps the roadmap from becoming a wish list maintained in someone's head.

You cannot scope software you have not seen run.

One of the more expensive lessons was around the Nextworld ERP implementation. The platform had documented workflows for work order management, production scheduling, and installer operations. When the team sat down to execute those workflows in UAT, entire steps were missing. Components tabs didn't exist where the documentation said they would. Work orders couldn't transition to the Released status without a serial number attached — a gate the vendor documentation didn't mention. Supplier qualification workflows threw errors on basic field selections.

The response was to build step-by-step walkthroughs using Tango, file Marker.io tickets for every failure, and document every gap between expected and actual behavior — then bring those artifacts to the vendor. It was tedious, but it converted ambiguous "it doesn't work" complaints into reproducible evidence.

The manufacturing work order lifecycle ended up with eight distinct states — Created, Customer Scheduled, Scheduled, Released, Completed, Hold, Ready to Cancel, and Cancelled — each with explicit transition rules and system triggers. GL transactions and inventory relief post automatically at Completed status. Serial number assignment is enforced before Released. None of that specificity existed in the vendor's onboarding materials. It was extracted through UAT, documented by the PM, and then negotiated back into the vendor's roadmap.

UAT scripts are not just a QA exercise. They are the product manager's primary tool for holding vendors accountable to their own documentation. If the PM hasn't personally run the workflow end to end, the scope estimate is a guess.

Learn the physical business before you design the digital one.

A factory tour in Colorado Springs changed how the team thought about inventory costing. Seeing how lumber gets sourced ad hoc from Home Depot, how non-stock inventory management varies by square footage and store leadership, and how labor hours get estimated per work station — that context was invisible in the Jira backlog.

The visit surfaced a costing requirement: the business didn't want to realize labor and overhead costs until a building was actually sold against the work order. And when manufactured buildings transferred between business units, cost and revenue recognition needed to follow the building — the originating BU recognizes the cost, the receiving BU recognizes the revenue upon sale. That's not a configuration option you click; it's a domain rule that determines how the GL gets structured, which accounts get created, and when inventory gets relieved.

Manufacturing software is ultimately an abstraction of a physical process. If the PM doesn't understand the physical process, the abstraction will be wrong in ways that are expensive to fix later. The JDE-to-Nextworld definition comparison alone required a formal terminology table: "Organizational Unit" (Nextworld) equals "Business Unit" (Tuff Shed); "Vendor" in the Tuff Shed context includes Installers who are service providers, not goods suppliers; "Revenue events" was flagged as a term to avoid entirely because it meant different things to Finance and Operations. Language is a data integrity problem.

When a vendor relationship fails, protect the architecture.

The Nextworld ERP implementation was ultimately scaled back when the business relationship with the vendor soured. The JD Edwards-to-Nextworld data migration — over 1.1 million GL transaction records, cleaned and staged through Python notebooks on Azure ML, handling cp1252 encoding and decimal precision mismatches between JDE's six-decimal-place inventory values and Nextworld's four — was canceled. But the DataMigrationService the team built (28 controllers, 40 orchestration classes, 18 embedded CSV seed files) remains in production today, serving ongoing data integration needs across the platform.

The architecture had been built as a general-purpose service, not as a Nextworld-specific tool. When the vendor relationship ended, the service didn't have to be thrown away — it got pointed at different targets. That wasn't accidental foresight; it was a consequence of abstracting the data layer from the vendor layer during design.

The same discipline applies to the BI stack. The Bronze layer of the Medallion architecture is schema-on-read and append-only: raw data ingests from source systems in native format with minimal transformation. Watermarks define incremental pull boundaries. The Silver layer generates new primary keys — never reusing source system keys — so tables can be dropped and rebuilt cleanly without breaking downstream Gold-layer semantic models. If a source system changes or a vendor exits, the architecture absorbs the impact rather than propagating it.

Vendor relationships are inherently uncertain. The architecture should reflect that uncertainty.

Approval workflows reveal organizational trust structures.

A seemingly simple requirement — dual approval for ACH and check payments — turned into a case study in organizational design. The business needed exactly two people from a group of four to approve any payment. It didn't matter which two, as long as they were at the same authorization level. The system also needed to handle OOO coverage (three remaining approvers) and temporary additions (a fifth person could be added without restructuring the group).

The technical implementation is straightforward. The interesting part is that this requirement, stated plainly, describes a trust topology. Who can approve payments, who can delegate, and who gets added temporarily are decisions that map directly to how an organization distributes authority. That same logic showed up in production scheduling (who can release a work order), in Salesforce role hierarchy (who can see which factory's pipeline), and in financial reporting access (which accounts are exposed to which roles). Every access control decision is an organizational decision encoded in software. The PM's job is to extract the topology from the business and translate it into system behavior — not to design the org chart, but to make sure the software reflects the one that already exists.

Standups are a culture decision, not just a process.

The team ran in-person standups where everyone stood up, looked at each other, and popcorned to the next person. It was intentionally informal — the goal was to break the pattern of staring at a screen and reading ticket numbers. Bug triage happened weekly, not daily, with a structured review of highest, high, medium, and low priority items, rotating ownership based on domain expertise.

The format worked because it matched the team's size and velocity. A seven-person team doesn't need the ceremony of a scaled agile framework. It needs a room, a cadence, and a reason to look each other in the eye before diving into the backlog.

Output over two years: 117 Confluence pages, eight whiteboards, and active collaboration across 14 contributors in H2 2024 alone. The most-edited page — JDE to Medius Integration — accumulated nine comments across multiple review cycles. The volume isn't the point; the distribution is. When institutional knowledge is spread across contributors and captured in writing, it becomes recoverable. Standups were how the team decided what was worth writing down.

Reporting is a product, not a feature.

The BI team prioritized reporting across 11 modules: sales and revenue, period close management, financial reviews, inventory, AR (trade and non-trade), supplier, subcontractor and installer, manufacturing and production, asset management, and customer service. The ranking was a product decision — revenue reporting came first because the DM/GM homepage had the highest view counts in Tableau, and operations leaders checked those dashboards daily. Prioritization driven by usage data, not by whoever asked loudest.

When the time came to migrate from Tableau to Power BI, the demo wasn't a feature walkthrough. Every report group was presented with a business value statement. Revenue Summary "gives Production and Operations leaders an at-a-glance view of revenue performance by Region or Factory." Flash Revenue "eliminates the day-of-week distortion that makes raw year-over-year comparisons misleading." Custom Revenue "provides flexible, on-demand revenue analysis across any combination of factory, channel, product type, and date range."

The Revenue Batch #1 acceptance criteria were written before a single DAX measure was authored: currency figures must tie to Tableau within ±$1; percentage metrics within ±0.01%; report load time under 3–5 seconds at normal workspace capacity; time intelligence (MTD, YTD, EOM, EOY) must match Tableau boundary logic exactly. Revenue itself is defined as Ledger Type AA, accounts 5000–5999, including After-Invoice Adjustments. That's not a QA checklist — it's a contract. When sign-off happens, there's nothing subjective about it.

The migration also added two net-new report pages — Yearly Breakdown and Monthly Breakdown — that didn't exist in Tableau. The Custom Revenue view in Tableau had open-ended date ranges with no groupings, which made analysis harder than it needed to be. The migration was an opportunity to fix what was wrong, not just replicate what existed.

Reporting tools get adopted when users see their own decisions reflected in the design. Mapping every new report back to the Tableau view it replaces gives users a migration path, not a learning curve.

Data governance is infrastructure, not a feature request.

The shift from Tableau to Microsoft Fabric required rebuilding not just the reports but the security model underneath them. In Tableau, row-level security was managed at the report level — each report carried its own access logic. In Fabric, RLS is enforced at the semantic model layer via an Org Key mapping table backed by Entra ID groups. One security model governs all reports built on that semantic model. When a new factory region gets added or a role changes, the update happens once and propagates everywhere. Duplicating reports to manage access is an architecture failure, not a design choice.

The highest-priority alert in the Data Health Dashboard is a direct consequence of getting this wrong: RLSOrgKeySK NULLs in the Revenues fact table. When the Org Key is NULL, the row is invisible to RLS-filtered queries — revenue data silently disappears from reports without any error message. The dashboard monitors for this across 10 fact tables and 20+ shared dimensions, with explicit RAG thresholds: GREEN means zero referential integrity failures and refresh within SLA; YELLOW means row count deviation between 5–15% or less than 1% orphaned foreign keys; RED means greater than 15% deviation, more than 1% RI failure, pipeline error, or required surrogate key is NULL.

Data Governance isn't a committee that reviews dashboards before launch. It's a committee that owns the definitions the dashboards are built on. The VP Finance, CFO, COO, and Regional VPs approve every definition before it enters the Microsoft Purview business glossary, where it's versioned with an approval date. A report that uses "Revenue" before Finance has signed off on what Revenue means is a report that will be argued about in every meeting it gets shown in.

Microsoft Purview extends that governance layer further: auto-tagging applies sensitivity labels based on content patterns, and information rights management prevents outbound sharing of flagged content automatically. This isn't a feature the business requested — it's infrastructure that prevents the next compliance incident.

The best handoff is a machine-readable one.

Two years of product management at enterprise scale generates a significant surface area of institutional knowledge: API behaviors, vendor quirks, domain-specific terminology, workflow edge cases, stakeholder preferences, costing rules, GL account structures. Most of that knowledge lives in Slack threads, meeting notes, and the PM's head — and none of it survives a transition intact.

In the two-year self-review, change management rated 2 out of 5. The diagnosis wasn't lack of effort — it was structural: no formal adoption framework, no PM team to distribute knowledge across, and a domain that was too large for one person to document comprehensively in real time. The proposed fix was an AI script that organizes training content by Product Area, reducing the cognitive load of knowledge transfer from "write everything down" to "classify what already exists."

That's the current alpha project: a Claude-powered agent designed to absorb the context accumulated over two years. The first tool in the pipeline uses sentence-transformers to semantically classify documents — Postman collections, domain schemas, meeting artifacts, test data objects — into configurable categories. It handles PDFs, Word docs, Excel files, and images via OCR. The goal isn't a search engine; it's a reasoning layer that can answer the questions a product manager would, with the institutional context to give those answers weight.

The long-term measure of success is a transition that doesn't require a six-month ramp-up to become functional. Not to replace judgment, but to make institutional knowledge durable enough to outlast the person who built it.
