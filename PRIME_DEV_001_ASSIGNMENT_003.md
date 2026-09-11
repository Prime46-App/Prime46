# PRIME-DEV-001 — ASSIGNMENT #003

**Status: COMPLETE**
**Execution state: COMPLETE**
**Completed:** 2026-09-11

## Completion evidence
- `PRODUCT_BIBLE.md` created as the canonical consolidation layer.
- `SOURCE_OF_TRUTH_INDEX.md` created with fresh-agent read order and conflict rules.
- `CURRENT_ASSIGNMENT.json` created as the machine-readable work-discovery pointer.
- `tests/sourceOfTruthIntegrity.mjs` created and enforced in CI.
- `.github/workflows/prime-integrity.yml` now runs source integrity, state integrity, Recommendation acceptance, PLAY integration, and production smoke checks on `main` pushes.
- README onboarding now routes fresh PRIME-DEV-001 instances through repository source-of-truth infrastructure.
- GitHub Actions verification passed for all suites and production smoke before closure.
- LOCKED canon changed: No.

## Milestone
**PRIME 46 — SOURCE-OF-TRUTH INFRASTRUCTURE v1.0**

## Objective
Resolve the missing canonical Product Bible in the GitHub repository and make the repository sufficient for a fresh PRIME-DEV-001 instance to reconstruct PRIME 46's identity, authority model, LOCKED canon, current product architecture, current implementation state, active milestone, tests, and deployment path without relying on conversational memory.

Milestone promise:
> **A fresh agent can enter the repository, determine what PRIME 46 is, distinguish canon from implementation, locate its authorized work, and proceed without inventing product meaning.**

## Why this milestone is next
System Prompt v1.0 defines the Product Bible as the highest repository authority, but no canonical Product Bible currently exists in the repository. Assignment #002 confirmed the application can preserve player evidence; the next infrastructure requirement is to preserve product truth with the same discipline.

This is a source-of-truth infrastructure milestone. It must not redesign PRIME 46, expand product scope, or convert WORKING/OPEN material into LOCKED canon.

## Source-of-Truth Protocol
1. **CANON BEATS MEMORY.** Repository evidence controls reconstruction.
2. Apply the authority hierarchy from System Prompt v1.0:
   1. Product Bible
   2. Canon / Decision Log
   3. Current approved specification
   4. Repository implementation
   5. Conversation/context
3. Preserve decision status exactly: **LOCKED · WORKING · OPEN · SUPERSEDED**.
4. Do not silently resolve conflicts, fill OPEN questions, promote WORKING material, or rewrite LOCKED decisions.
5. Every canonical statement in the Product Bible must be traceable to an existing authoritative repository source.
6. If authoritative sources materially conflict, stop and classify the issue as **CANON CONFLICT**.

## Authorized scope
1. Inventory all repository documentation, specifications, tests, implementation modules, deployment configuration, and assignment records.
2. Create a canonical `PRODUCT_BIBLE.md` that faithfully consolidates existing authoritative product truth without creating new canon.
3. Clearly separate within the Product Bible:
   - LOCKED product identity and philosophy
   - LOCKED architecture and terminology
   - LOCKED BODY / VESSEL rules and scoring contracts
   - LOCKED gameplay, data-model, navigation, recommendation, evidence, and mobile-first rules
   - WORKING implementation state
   - OPEN decisions and explicitly deferred systems
   - SUPERSEDED material, where relevant
4. Create a concise `SOURCE_OF_TRUTH_INDEX.md` that tells a fresh agent what to read, in what order, why each source exists, and which source controls when documents disagree.
5. Define a single machine-readable or mechanically checkable current-assignment pointer so a fresh PRIME-DEV-001 instance can identify the currently authorized assignment without guessing. Keep human-readable assignment files authoritative.
6. Reconcile documentation filenames, titles, status labels, and cross-links where necessary without changing their product meaning.
7. Record document provenance sufficient to trace Product Bible sections back to existing LOCKED sources.
8. Add an automated source-of-truth integrity check that verifies at minimum:
   - required governing documents exist
   - exactly one assignment is `AUTHORIZED` at a time while authorized work exists
   - completed assignments are not discoverable as active work
   - required status labels use approved vocabulary
   - Product Bible and source index links resolve to repository files
   - referenced test commands and production URL are present
9. Update README onboarding so a fresh PRIME-DEV-001 instance starts from the Source-of-Truth Index rather than reconstructing PRIME from implementation or memory.
10. Run the source-of-truth integrity check plus all existing state-integrity, Recommendation Engine acceptance, and PLAY integration tests.
11. Commit the completed infrastructure to GitHub. Documentation-only changes do not require production deployment unless the established pipeline deploys every `main` commit automatically; if it does, verify that the application remains healthy and repository-only documents remain excluded from production assets.
12. Report the smallest purposeful human QA only if automated evidence cannot verify reconstruction clarity.

## Required Product Bible boundaries
- The Product Bible consolidates existing truth; it does not create product decisions.
- LOCKED wording may be normalized for organization, but meaning must remain unchanged.
- WORKING and OPEN material must remain visibly non-canonical.
- Implementation behavior cannot overrule a conflicting LOCKED source.
- Conversation history may help locate evidence but cannot be the sole authority for a canonical statement.
- Existing LOCKED source documents remain preserved unless a separately authorized archival strategy exists.

## Explicitly out of scope
- Changing LOCKED canon
- New gameplay systems or product features
- XP economy or Level thresholds
- New scoring curves, assessments, or recommendation semantics
- Expansion beyond BODY / THE VESSEL
- UI redesign or application refactoring unrelated to source-of-truth integrity
- Retiring Netlify
- Deleting or rewriting historical Decision Log entries
- Executing a new product milestone after this infrastructure milestone

## Acceptance criteria
- `PRODUCT_BIBLE.md` exists and is identified as the highest repository product authority under System Prompt v1.0.
- Product Bible content is traceable to existing authoritative repository evidence.
- `SOURCE_OF_TRUTH_INDEX.md` gives a fresh agent an unambiguous read order and conflict rule.
- A fresh instance can identify the governing prompt, Product Bible, Decision Log, current specifications, current implementation, tests, deployment path, completed work, and currently authorized assignment from the repository alone.
- At most one assignment is `AUTHORIZED`; Assignment #002 remains `COMPLETE`; when no authorized assignment exists, the pointer is explicitly `IDLE`.
- Decision statuses remain explicit and no WORKING/OPEN statement is silently promoted to LOCKED.
- Automated source-of-truth integrity checks pass.
- All pre-existing automated suites remain green.
- Production application behavior and LOCKED canon remain unchanged.

## Mandatory reconstruction test
Before declaring Assignment #003 complete, evaluate the repository as though no conversational memory exists. Produce a reconstruction manifest containing:
- PRIME 46 identity and core promise
- authority hierarchy and escalation boundary
- 4 Actions × 6 Dimensions × 1 Character architecture
- current BODY-first scope
- LOCKED BODY data model and primary navigation
- LOCKED Recommendation Engine pipeline
- current implementation version and verified test commands
- production URL and deployment path
- currently authorized assignment or explicit IDLE state
- OPEN/WORKING items that must not be mistaken for canon

Every manifest item must cite its controlling repository file. Any material item that cannot be reconstructed from repository evidence is a milestone defect, not permission to invent it.

## Escalation rule
Stop and request a decision if completing the Product Bible requires choosing between incompatible authoritative statements, declaring previously OPEN/WORKING material LOCKED, changing the authority hierarchy, removing historical evidence, or deciding new product meaning.

## Required report
Use the PRIME-DEV-001 WORK CYCLE format from System Prompt v1.0. Clearly distinguish **VERIFIED · INFERRED · UNKNOWN** and report any unresolved source gap or canon conflict.

## Execution boundary
This assignment was authorized for discovery by the automated PRIME-DEV-001 Wake Cycle and was executed by that automated cycle without being manually started in the originating Work session.

**PRESERVE THE TRUTH. THEN BUILD FROM IT.**
