# PRIME 46 — BODY MVP v0.8 MERGED / PRODUCTION VERIFICATION OPEN

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

- Current `main` implementation: **BODY MVP v0.8 — Boss Fight & Closed Progression Loop**.
- PR #1 was merged to `main` at `779a6bd30e6942c29e7408c0297bdc826c879bb0`; main integrity run `35932184399` passed.
- Exact candidate mobile acceptance at **390 × 844** passed in GitHub Actions run `35931853091`.
- **Production v0.8 is NOT yet verified.** The first live production recheck after merge/retrigger failed because production behaved like the prior asset set; target version promotion/final live verification remain open.
- Assignment #004 therefore remains **AUTHORIZED / OPEN — BLOCKED ON PRODUCTION PROMOTION + FINAL LIVE ACCEPTANCE**.
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

## v0.8 merged implementation — Boss Fight & Closed Progression Loop

- Verified assessments establish persistent Boss baselines without fabricating readiness.
- Qualifying post-baseline development can establish readiness; completion or time alone cannot.
- PRIME-recommended and player-initiated rematches use the canonical assessment and retain distinct provenance.
- Boss attempts atomically update current verified reality, history, verdict, undefeated target, and readiness reset.
- Regression updates current reality without lowering the undefeated Boss target.
- PROGRESS displays Boss verdicts separately from current verified Capability.
- State schema v8 migrates valid v0.7 player evidence and Boss history.

## Test commands

```bash
node tests/sourceOfTruthIntegrity.mjs
node tests/stateIntegrity.mjs
node tests/recommendation/acceptance.mjs
node tests/recommendation/playIntegration.mjs
node tests/boss/attemptTransaction.mjs
```

## Deployment

Production pipeline:

**PRIME-DEV-001 → GitHub `main` → Cloudflare → PRIME 46 production**

Production URL:
`https://prime46.murphinsystems.workers.dev`

Cloudflare connected builds run from approved commits to `main`, but the current deployment command uses `wrangler versions upload`, which creates an uploaded Worker version without by itself proving production traffic moved to that version. Production must be independently promoted/deployed and then verified at the live Worker. `.assetsignore` excludes repository-only/test/canon material from static production assets. Netlify remains fallback infrastructure until explicitly retired.
