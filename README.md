# PRIME 46 — BODY MVP v0.7

Player One QA revision of the playable BODY / THE VESSEL MVP.

## PRIME-DEV-001 onboarding

Fresh PRIME-DEV-001 instances must begin with:

1. `SOURCE_OF_TRUTH_INDEX.md`
2. `PRIME_DEV_001_SYSTEM_PROMPT_v1.0.md`
3. `PRODUCT_BIBLE.md`
4. `DECISION_LOG.md`
5. `CURRENT_ASSIGNMENT.json`

Do not reconstruct PRIME 46 from conversational memory or implementation code when authoritative repository sources exist. `CURRENT_ASSIGNMENT.json` is the machine-readable work-discovery pointer; the referenced human-readable assignment file controls scope.

## Current product state

- Current implementation: **BODY MVP v0.7 — State Integrity & Progress Evidence**
- Canonical product authority: `PRODUCT_BIBLE.md`
- Canon/history: `DECISION_LOG.md`
- LOCKED BODY scoring contract: `VESSEL_IMPLEMENTATION_SPEC_v1.0.md`
- WORKING Recommendation implementation spec: `RECOMMENDATION_ENGINE_SPEC_v0.1.md`

## What v0.2 fixed
- Correct incomplete-assessment state (blank is UNRANKED, not zero)
- Normal input focus while typing
- Guided Rockport 1-mile fast-walk Cardio assessment with automatic estimated VO2max
- Objective Mobility screen; PRIME assigns the classification
- Game-style Character Creation and Character Sheet
- Post-assessment BODY Hub with Active Quest, Boss, progression path, and locked systems

## Canon boundary

`engine.mjs` implements the locked VESSEL v1.0 scoring contract. UX/presentation and the published Rockport estimator feed the existing locked scoring model. XP values are not invented.

Code implements the current specification. Code does not silently redefine PRIME.

## v0.4 PLAY Integration — WORKING

PLAY is wired to `recommendation/index.mjs` through `recommendation/appAdapter.mjs`.
The live TODAY card is generated from stored assessment state, training/adaptation history, and current context. Quest acceptance and ADAPT logging are persisted locally. No XP or Level economy is fabricated.

## v0.5 — Mobile UI Pass

PRIME 46 is explicitly mobile-first. PLAY, ACTIVE QUEST, CHARACTER, and ASSESSMENT layouts are optimized around smartphone use: compact hierarchy, thumb-friendly controls, reduced vertical dead space, dense Player State, and responsive desktop expansion. Recommendation Engine semantics are unchanged.

## v0.7 — State Integrity & Progress Evidence

- Assessment input is drafted separately from verified Capability.
- `SAVE RESULT` commits verified Assessment evidence and a historical snapshot.
- `SKIP FOR NOW` discards the draft without changing Capability.
- Legacy v0.1/v0.2 state migrates into the v0.7 schema.
- Training logs use method-appropriate evidence fields for strength, Cardio, Mobility, and Balance.
- PROGRESS shows verified Assessment history; Training remains separate from Capability.

## Test commands

```bash
node tests/sourceOfTruthIntegrity.mjs
node tests/stateIntegrity.mjs
node tests/recommendation/acceptance.mjs
node tests/recommendation/playIntegration.mjs
```

## Deployment

Production pipeline:

**PRIME-DEV-001 → GitHub `main` → Cloudflare → PRIME 46 production**

Production URL:
`https://prime46.murphinsystems.workers.dev`

Cloudflare automatically builds approved commits to `main`. `.assetsignore` excludes repository-only/test/canon material from static production assets. Netlify remains fallback infrastructure until explicitly retired.
