# PRIME 46 — BODY MVP v0.7
Player One QA revision of the playable BODY / THE VESSEL MVP.

## What v0.2 fixes
- Correct incomplete-assessment state (blank is UNRANKED, not zero)
- Normal input focus while typing
- Guided Rockport 1-mile fast-walk Cardio assessment with automatic estimated VO2max
- Objective Mobility screen; PRIME assigns the classification
- Game-style Character Creation and Character Sheet
- Post-assessment BODY Hub with Active Quest, Boss, progression path, and locked systems

## Deployment
Static site. Upload `index.html`, `app.mjs`, `engine.mjs`, and `styles.css` to the repository root used by Netlify. The markdown files are documentation only.

## Canon boundary
`engine.mjs` remains the locked VESSEL v1.0 scoring implementation. v0.2 changes UX/presentation and adds the published Rockport estimator before feeding VO2max into the existing cardio score curve. XP values are not invented.

## v0.4 PLAY Integration — WORKING
PLAY is now wired to `recommendation/index.mjs` through `recommendation/appAdapter.mjs`.
The live TODAY card is generated from stored assessment state, training/adaptation history, and current context. Quest acceptance and ADAPT logging are persisted locally. No XP or Level economy is fabricated.

Run acceptance checks:
```bash
node tests/stateIntegrity.mjs
node tests/recommendation/acceptance.mjs
node tests/recommendation/playIntegration.mjs
```

## v0.5 — Mobile UI Pass
PRIME 46 is now explicitly mobile-first. PLAY, ACTIVE QUEST, CHARACTER, and ASSESSMENT layouts are optimized around smartphone use: compact hierarchy, thumb-friendly controls, reduced vertical dead space, dense Player State, and responsive desktop expansion. Recommendation Engine semantics are unchanged.

## v0.7 — State Integrity & Progress Evidence
- Assessment input is drafted separately from verified Capability.
- `SAVE RESULT` commits verified Assessment evidence and a historical snapshot.
- `SKIP FOR NOW` discards the draft without changing Capability.
- Legacy v0.1/v0.2 state migrates into the v0.7 schema.
- Training logs use method-appropriate evidence fields for strength, Cardio, Mobility, and Balance.
- PROGRESS shows verified Assessment history; Training remains separate from Capability.
