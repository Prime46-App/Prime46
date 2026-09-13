# PRIME 46 — SOURCE OF TRUTH INDEX

**Purpose:** Give a fresh PRIME-DEV-001 instance an unambiguous reconstruction path without relying on conversational memory.

## Read order

1. `PRIME_DEV_001_SYSTEM_PROMPT_v1.0.md`
   - Defines PRIME-DEV-001 identity, authority, escalation rules, truth standard, testing standard, and source hierarchy.

2. `AGENT_OPERATING_STANDARD_v1.0.md`
   - OWNER-AUTHORIZED cross-agent operating canon for reconstructability, OBSERVE → ORIENT → DECIDE → ACT → VERIFY → RECORD, least privilege, authority boundaries, action records, circuit breakers, controlled adaptation, event-driven autonomy, control-plane fields, resource discipline, and agent scoreboards.
   - Does not override project-specific LOCKED product canon or explicit authority envelopes.

3. `PRODUCT_BIBLE.md`
   - Highest repository product authority.
   - Consolidates existing product truth while preserving LOCKED / WORKING / OPEN / SUPERSEDED boundaries.

4. `DECISION_LOG.md`
   - Historical and current canonical decision record.
   - Controls when the Product Bible points to detailed locked decisions or historical supersession context.

5. `VESSEL_IMPLEMENTATION_SPEC_v1.0.md`
   - LOCKED BODY / THE VESSEL implementation contract for hierarchy, assessments, scoring curves, aggregation, mastery gates, and Boss verdict semantics.

6. `RECOMMENDATION_ENGINE_SPEC_v0.1.md`
   - WORKING implementation specification for the BODY Recommendation Engine.
   - Must remain subordinate to LOCKED Recommendation Engine decisions recorded in `DECISION_LOG.md` and consolidated in `PRODUCT_BIBLE.md`.

7. `CURRENT_ASSIGNMENT.json`
   - Machine-readable discovery pointer for current authorized work or IDLE state.
   - Does not replace the human-readable assignment file.

8. Human-readable `PRIME_DEV_001_ASSIGNMENT_*.md`
   - Read the assignment named by `CURRENT_ASSIGNMENT.json` when status is AUTHORIZED.
   - Completed assignments remain historical evidence and must not be treated as active work.

9. `README.md`
   - Current implementation/version summary, test commands, and repository onboarding.

10. Repository implementation
   - `app.mjs`, `engine.mjs`, `state.mjs`, `recommendation/*.mjs`, `styles.css`, `index.html`.
   - Code implements the current specification; code does not redefine canon.

11. Automated tests
   - `tests/sourceOfTruthIntegrity.mjs`
   - `tests/stateIntegrity.mjs`
   - `tests/recommendation/acceptance.mjs`
   - `tests/recommendation/playIntegration.mjs`

## Conflict rule

Apply this authority hierarchy:

1. Product Bible / LOCKED product canon
2. Canon / Decision Log
3. Explicit authority envelope and current approved specification
4. `AGENT_OPERATING_STANDARD_v1.0.md` for cross-agent operating behavior
5. Repository implementation
6. Conversation/context

The Agent Operating Standard governs agent operations and does not redefine PRIME 46 product meaning. If `PRODUCT_BIBLE.md` and an older source appear to conflict, inspect provenance and status before acting. The Product Bible may normalize organization but may not silently change LOCKED meaning. If an apparent conflict cannot be resolved by explicit status/provenance, classify it as **CANON CONFLICT** and escalate.

## Decision-status vocabulary

Only these decision-status terms carry source-of-truth meaning:
- LOCKED
- WORKING
- OPEN
- SUPERSEDED

Assignment lifecycle terms such as AUTHORIZED, COMPLETE, and IDLE describe work state, not product-decision status.

## Current-assignment discovery

Read `CURRENT_ASSIGNMENT.json`.

- `status: "AUTHORIZED"` + non-null `file` → read that assignment and execute only within its authorized scope.
- `status: "IDLE"` + `file: null` → do not invent work. Report idle awaiting authorization.
- Any mismatch between the pointer and assignment files is a source-of-truth integrity defect.

Human-readable assignment files remain authoritative for scope, acceptance criteria, and escalation boundaries.

## Shared agent operating requirements

A fresh PRIME-DEV-001 instance must also reconstruct that:

- persistent repository state outranks remembered chat context;
- the universal operating wrapper is **OBSERVE → ORIENT → DECIDE → ACT → VERIFY → RECORD**;
- its existing engineering loop remains a project-specific implementation of that wrapper;
- authority is bounded by **PURPOSE × DATA ACCESS × TOOL ACCESS × ACTION RIGHTS**;
- consequential actions must be auditable without recording private chain-of-thought;
- action is not success until appropriately verified;
- reports distinguish **VERIFIED · INFERRED · UNKNOWN**;
- autonomy is event-driven and returns to IDLE when no legitimate executable work exists;
- repeated blockers, authority gaps, canon conflicts, unverifiable consequential state, unsafe tool failure, or material scope expansion trigger stop/defer/escalate behavior rather than unbounded retries;
- operational learning is allowed inside authority, while constitutional/product self-modification remains Owner-controlled;
- compute, tool calls, Owner attention, and external spend are real operating resources;
- agent performance should be measured by useful verified outcomes, error/regression rate, human intervention, and resource use rather than activity volume.

## Test commands

```bash
node tests/sourceOfTruthIntegrity.mjs
node tests/stateIntegrity.mjs
node tests/recommendation/acceptance.mjs
node tests/recommendation/playIntegration.mjs
```

## Production

Production URL:
`https://prime46.murphinsystems.workers.dev`

Deployment path:
**PRIME-DEV-001 → GitHub `main` → Cloudflare → PRIME 46 production**

Netlify remains fallback infrastructure until explicitly retired.

## Fresh-agent reconstruction manifest

Before making product-significant changes, a fresh instance should be able to identify from repository files alone:
- PRIME-DEV-001 operating governance — `AGENT_OPERATING_STANDARD_v1.0.md`
- PRIME 46 identity and core promise — `PRODUCT_BIBLE.md` §§1–3
- authority hierarchy and escalation boundary — `PRIME_DEV_001_SYSTEM_PROMPT_v1.0.md`, `AGENT_OPERATING_STANDARD_v1.0.md`, `PRODUCT_BIBLE.md` §2
- 4 Actions × 6 Dimensions × 1 Character — `PRODUCT_BIBLE.md` §1
- BODY-first scope — `PRODUCT_BIBLE.md` §§3–4
- BODY data model — `PRODUCT_BIBLE.md` §10
- primary navigation — `PRODUCT_BIBLE.md` §11
- Recommendation Engine pipeline — `PRODUCT_BIBLE.md` §§13–14
- current implementation version and tests — `PRODUCT_BIBLE.md` §16, `README.md`
- production URL/deployment path — `PRODUCT_BIBLE.md` §17
- current assignment state — `CURRENT_ASSIGNMENT.json`
- OPEN/WORKING material — `PRODUCT_BIBLE.md` §§14, 16, 18 and explicit statuses in source files

**CANON BEATS MEMORY.**