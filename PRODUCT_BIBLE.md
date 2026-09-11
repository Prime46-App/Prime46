# PRIME 46 — PRODUCT BIBLE

**Status:** CANONICAL CONSOLIDATION
**Authority:** Highest repository product authority under `PRIME_DEV_001_SYSTEM_PROMPT_v1.0.md`
**Purpose:** Consolidate existing authoritative product truth without creating new canon.

> This document organizes existing repository truth. It does not promote WORKING or OPEN material to LOCKED, does not supersede historical source records, and does not authorize product changes.

## 1. Product Identity — LOCKED

PRIME 46 is a **personal-development operating system disguised as a game**.

Core promise: **BECOME MORE.**

Core premise: **You are not managing habits. You are building yourself.**

The player levels themselves, not a fictional avatar.

Core architecture: **4 ACTIONS × 6 DIMENSIONS × 1 CHARACTER: YOU.**

### Four Actions
- CHOOSE
- ACT
- ENDURE
- ADAPT

### Six Dimensions
- BODY — THE VESSEL
- MIND — THE LENS
- WILL — THE FLAME
- CONNECTION — THE BRIDGE
- CAPABILITY — THE FORGE
- PURPOSE — THE COMPASS

**Provenance:** `PRIME_DEV_001_SYSTEM_PROMPT_v1.0.md`; supporting locks in `DECISION_LOG.md`.

## 2. Authority and Decision Model — LOCKED

Repository authority order:
1. `PRODUCT_BIBLE.md`
2. `DECISION_LOG.md`
3. Current approved specifications
4. Repository implementation
5. Conversation/context

**CANON BEATS MEMORY.**

Decision status vocabulary:
- **LOCKED** — approved canon; do not change without explicit authorization.
- **WORKING** — current implementation/design direction; may be refined within its approved purpose.
- **OPEN** — not decided; do not invent permanent product rules to fill the gap.
- **SUPERSEDED** — no longer authoritative.

Implementation does not silently redefine PRIME. Conflicts with LOCKED canon must be surfaced before behavior changes.

**Provenance:** `PRIME_DEV_001_SYSTEM_PROMPT_v1.0.md`; `DECISION_LOG.md` Source-of-Truth Protocol.

## 3. Development Strategy — LOCKED

Development is vertical and BODY-first:

**DESIGN BODY → BUILD BODY → PLAY BODY → IMPROVE BODY → EXPAND PRIME**

The other five Dimensions must not be prematurely implemented merely because their architecture exists.

**Provenance:** `PRIME_DEV_001_SYSTEM_PROMPT_v1.0.md`.

## 4. BODY / THE VESSEL Architecture — LOCKED

### STRENGTH
- Push
- Pull
- Squat
- Carry

### ENDURANCE
- Cardio
- Work Capacity — LOCKED/LATER

### MOVEMENT
- Mobility
- Balance
- Body Control — LOCKED/LATER

**Provenance:** `VESSEL_IMPLEMENTATION_SPEC_v1.0.md`; `DECISION_LOG.md` VESSEL v1.0 architecture lock.

## 5. BODY Tier System — LOCKED

- 0–19 FOUNDATION
- 20–39 DEVELOPING
- 40–59 CAPABLE
- 60–79 STRONG
- 80–89 ADVANCED
- 90–100 ELITE

**Provenance:** `VESSEL_IMPLEMENTATION_SPEC_v1.0.md`.

## 6. Evidence and Scoring Separation — LOCKED

Raw performance is preserved. These concepts are separate and must not be conflated:
- **PERFORMANCE** — raw evidence.
- **CAPABILITY** — current demonstrated ability.
- **PROGRESS** — change from prior self.
- **XP** — game/process reward.
- **PEER STANDING** — external comparison.

Do not invent external percentile claims where credible norms do not exist.

Critical invariant:

> **TRAINING DEVELOPS CAPABILITY. VERIFIED ASSESSMENT / BOSS PROVES CAPABILITY.**

Training performance must never automatically become demonstrated Capability.

**Provenance:** `VESSEL_IMPLEMENTATION_SPEC_v1.0.md`; `PRIME_DEV_001_SYSTEM_PROMPT_v1.0.md`; `RECOMMENDATION_ENGINE_SPEC_v0.1.md`.

## 7. Locked Assessment and Scoring Contracts

### Push v0.1
Strict push-up anchors:
`0→0, 10→20, 17→40, 21→50, 24→60, 26→70, 30→80, 34→85, 36→90, 40→95, 65→100`.

### Pull v0.1
Strict pull-up anchors:
`0→0, 1→15, 2→25, 3→35, 4→40, 5→44, 6→48, 7→52, 8→56, 9→60, 10→64, 11→68, 12→72, 13→76, 14→80, 15→84, 16→88, 17→92, 18→96, 19+→100`.

Do not present Pull scores as population percentiles.

### Cardio v0.1
Progression:
**Rockport 1-mile fast walk → Run the Mile achievement → Cooper 1.5-mile advanced test.**

Primary capability metric: estimated VO2max.

VO2 anchors:
`24.2→5, 26.8→10, 31.9→25, 37.8→50, 45.0→75, 52.1→90, 55.6→95`.

No locked score-100 VO2 anchor exists in v0.1; do not invent one.

### Squat v0.1
Canonical test: **barbell back squat**.

Primary metric: **1RM / bodyweight**. Measured 1RM preferred; estimated low-rep 1RM must be labeled estimated.

Machine performances remain records and are never converted to barbell equivalents.

Curve:
`0.5x→10, 0.75x→20, 1.0x→40, 1.25x→50, 1.5x→60, 1.75x→70, 2.0x→80, 2.25x→85, 2.5x→90, 2.75x→95, 3.0x→100`.

Track absolute and relative PRs.

### Carry v0.1
Canonical test: bilateral farmer carry, 40 m, equal implements, no straps; controlled gait/posture, no drop. Chalk may be recorded.

Primary metric: total external load / bodyweight. Completion time is recorded but does not affect Capability score.

Curve:
`0.25x→20, 0.5x→40, 0.75x→60, 1.0x→80, 1.25x→90, 1.5x→100`.

Farmer Hold is a supporting record/Boss, not a substitute assessment.

### Mobility v0.1
Tests: **Deep Squat + Overhead Reach**.

Output only: **LIMITED / FUNCTIONAL / PROFICIENT**. Do not fabricate a 0–100 Mobility score.

Record observations, limiters, and asymmetry.

### Balance v0.1
Eyes-open single-leg stand, both sides; 60-second ceiling.

Side anchors:
`0→0, 10s→20, 20s→40, 30s→60, 40s→80, 50s→90, 60s→100`.

Overall Balance = `70% weaker-side score + 30% stronger-side score`.

Asymmetry % = `(best seconds - worst seconds) / best seconds * 100`.

**Provenance for Section 7:** `VESSEL_IMPLEMENTATION_SPEC_v1.0.md`.

## 8. Domain and VESSEL Aggregation — LOCKED

### Strength
Raw Strength = mean(Push, Pull, Squat, Carry).

Mastery gates:
- any branch <40 → Strength cannot reach STRONG; cap 59
- otherwise any branch <60 → cannot reach ADVANCED; cap 79
- otherwise any branch <80 → cannot reach ELITE; cap 89

### Endurance
v1.0 Endurance = Cardio score. Work Capacity remains locked for later.

### Movement
v1.0 numerical basis = Balance score.

Mobility mastery gate:
- LIMITED → Movement cap 39
- FUNCTIONAL → Movement cap 79
- PROFICIENT → no Mobility cap

Body Control remains locked for later.

### VESSEL
Raw VESSEL = equal mean of Strength, Endurance, Movement (1/3 each).

Cross-domain mastery gates:
- any domain <40 → VESSEL cannot reach STRONG; cap 59
- otherwise any domain <60 → cannot reach ADVANCED; cap 79
- otherwise any domain <80 → cannot reach ELITE; cap 89

**Provenance:** `VESSEL_IMPLEMENTATION_SPEC_v1.0.md`.

## 9. Core Gameplay — LOCKED

**CHOOSE → ACT → ENDURE → ADAPT → BOSS FIGHT**

- **CHOOSE:** PRIME presents meaningful development options; player chooses.
- **ACT:** player performs real-world action.
- **ENDURE:** player completes the chosen commitment through appropriate difficulty; unsafe suffering is not progress.
- **ADAPT:** PRIME records what reality revealed and uses that evidence to influence what comes next.
- **BOSS FIGHT:** standardized retesting against **YOU, LAST TIME** proves whether demonstrated Capability improved.

Boss verdict:
- higher-is-better: current > previous → BOSS_DEFEATED
- lower-is-better: current < previous → BOSS_DEFEATED
- equal → STALEMATE
- otherwise → BOSS_SURVIVES

Any legitimate PR defeats the Boss. Improvement percentage is displayed separately.

**Provenance:** `PRIME_DEV_001_SYSTEM_PROMPT_v1.0.md`; `VESSEL_IMPLEMENTATION_SPEC_v1.0.md`; detailed Boss locks in `DECISION_LOG.md`.

## 10. BODY Data Model — LOCKED

**ASSESSMENT → TRAINING → PROGRESS**

- **ASSESSMENT:** standardized evidence of demonstrated Capability.
- **TRAINING:** real-world work performed to improve Capability.
- **PROGRESS:** change over time, including Capability history, Boss results, PRs, trends, and milestones.

Training may influence future prescription/recommendation but may not silently become verified Capability.

**Provenance:** `PRIME_DEV_001_SYSTEM_PROMPT_v1.0.md`; `DECISION_LOG.md`; Assignment #002 completion evidence in `PRIME_DEV_001_ASSIGNMENT_002.md`.

## 11. Primary Navigation — LOCKED

**PLAY · CHARACTER · TRAINING · PROGRESS**

- PLAY — “What should I do today?”
- CHARACTER — “Who am I now?”
- TRAINING — “What have I done?”
- PROGRESS — “Am I becoming more?”

PLAY is the primary post-onboarding home experience.

**Provenance:** `PRIME_DEV_001_SYSTEM_PROMPT_v1.0.md`; `DECISION_LOG.md`.

## 12. Baseline Principle — LOCKED

Baseline does not gate play.

Missing evidence limits PRIME's knowledge, not participation. Players may begin normal BODY gameplay before completing every assessment. PRIME may recommend establishing missing evidence when its information value exceeds another training session.

**Provenance:** `PRIME_DEV_001_SYSTEM_PROMPT_v1.0.md`; `DECISION_LOG.md`.

## 13. How PRIME Thinks — LOCKED

Canonical decision pipeline:

**FILTER → PRIORITIZE → PRESCRIBE → BOSS CHECK → CHOOSE**

Governing principle:

**REALITY constrains → DEVELOPMENT prioritizes → ADAPTATION personalizes → AGENCY decides.**

### FILTER
Determines what is appropriate and realistically possible. Eligibility, not priority. Outcomes include PASS, MODIFY, BLOCK.

### PRIORITIZE
Ranks eligible actions by developmental case using NEED, EVIDENCE, BALANCE, and RECENCY. No single signal automatically wins every conflict.

### PRESCRIBE
Determines today's version of the selected challenge using current evidence, training trajectory, adaptation, and safeguards. Dose decisions include PROGRESS, CONSOLIDATE, MODIFY, REGRESS, and RE-ESTABLISH.

### BOSS CHECK
Determines whether enough has changed to make standardized retesting meaningful. Reality gets the final vote.

### CHOOSE
PRIME gives direction without taking control. Default architecture: one PRIME Recommended Quest, up to two PRIME-ranked alternatives, and a subordinate Browse BODY Activities escape hatch. PRIME does not manufacture alternatives to satisfy a quota.

**Provenance:** `DECISION_LOG.md`; summary in `PRIME_DEV_001_SYSTEM_PROMPT_v1.0.md`.

## 14. Recommendation Engine Implementation — WORKING

`RECOMMENDATION_ENGINE_SPEC_v0.1.md` is a **WORKING IMPLEMENTATION SPECIFICATION**, not independent new canon.

Implementation input/pipeline:

`PLAYER STATE + TRAINING HISTORY + ADAPTATION HISTORY + CURRENT CONTEXT`
→ `GENERATE CANDIDATES`
→ `FILTER`
→ `PRIORITIZE`
→ `PRESCRIBE`
→ `BOSS CHECK`
→ `CHOOSE`

Non-negotiable implementation invariants include:
- blocked actions never become PRIME-prescribed
- missing evidence never creates invented Capability or loads
- Training never silently becomes verified Capability
- historical bests never replace current verified reality
- rejection never deletes Need
- behavioral preference is not motive
- Boss readiness is not created by time alone
- verified Boss/Assessment evidence outranks inference
- insufficient evidence produces RE-ESTABLISH rather than guessing
- no valid candidates is legal
- CHOOSE does not manufacture alternatives
- recommendation provenance remains explicit
- MODIFY does not inherently reduce priority

CARDIO Special-Role Rule: Cardio may operate as PRIMARY QUEST TARGET, COMPANION LAYER, or ACTIVE RECOVERY. Recency applies to the specific Cardio demand/intensity/purpose, not Cardio participation as a whole.

PRIORITIZE uses qualitative rule ordering, not additive pseudo-precise numeric weights.

**Provenance:** `RECOMMENDATION_ENGINE_SPEC_v0.1.md`; supporting locks in `DECISION_LOG.md`.

## 15. Mobile-First — LOCKED

The smartphone is PRIME 46's primary play surface.

Design for:
- one-hand use
- thumb-friendly controls
- fast scanning
- minimal unnecessary scrolling
- dominant TODAY/current Quest
- compact Player State
- readable game UI
- appropriate touch targets
- compact Current Context controls

Desktop expands from the phone-first hierarchy.

**Provenance:** `PRIME_DEV_001_SYSTEM_PROMPT_v1.0.md`; `DECISION_LOG.md`.

## 16. Current Implementation State — WORKING

Current repository/application version: **PRIME 46 BODY MVP v0.7 — State Integrity & Progress Evidence**.

Verified milestone behavior recorded in Assignment #002 / README:
- assessment input drafts are separate from verified Capability
- SAVE RESULT commits verified evidence and a history snapshot
- SKIP FOR NOW does not change Capability
- legacy state migrates into the v0.7 schema
- Training logs use method-appropriate evidence fields
- PROGRESS shows verified Assessment history
- Training remains separate from Capability

Current implementation modules include:
- `app.mjs`
- `engine.mjs`
- `state.mjs`
- `recommendation/*.mjs`

Current automated suites:
- `node tests/stateIntegrity.mjs`
- `node tests/recommendation/acceptance.mjs`
- `node tests/recommendation/playIntegration.mjs`

**Provenance:** `README.md`; `PRIME_DEV_001_ASSIGNMENT_002.md`; repository tree.

## 17. Deployment Path — LOCKED OPERATING INFRASTRUCTURE

Pipeline:

**PRIME-DEV-001 → GitHub `main` → Cloudflare → PRIME 46 production**

Production URL:
`https://prime46.murphinsystems.workers.dev`

Cloudflare automatically builds production after approved commits to `main`.

Netlify remains a fallback and must not be retired without explicit authorization.

**Provenance:** `PRIME_DEV_001_SYSTEM_PROMPT_v1.0.md`; `DEPLOYMENT_TEST.md`.

## 18. OPEN / Explicitly Deferred Systems

The following must not be invented merely to make the implementation feel complete:
- XP economy / numeric XP values
- Level thresholds where not separately locked
- Work Capacity implementation
- Body Control implementation
- implementation of the five non-BODY Dimensions
- new scoring curves or substitute assessments

**Provenance:** `VESSEL_IMPLEMENTATION_SPEC_v1.0.md`; `PRIME_DEV_001_ASSIGNMENT_002.md`; `DECISION_LOG.md`.

## 19. SUPERSEDED Material

Historical `SUPERSEDED` entries remain in `DECISION_LOG.md` as evidence of evolution. They do not control current behavior. A Product Bible consolidation does not delete or rewrite them.

**Provenance:** `DECISION_LOG.md`; `PRIME_DEV_001_ASSIGNMENT_003.md`.

## 20. Assignment and Work Discovery

A fresh PRIME-DEV-001 instance must begin with `SOURCE_OF_TRUTH_INDEX.md`, then read `CURRENT_ASSIGNMENT.json` to determine whether authorized work exists. Human-readable assignment files remain authoritative for assignment scope and meaning.

The pointer is discovery infrastructure only; it does not create product authority.

**Provenance:** `PRIME_DEV_001_ASSIGNMENT_003.md`.

## 21. Reconstruction Rule

A fresh agent must be able to reconstruct from repository evidence alone:
- what PRIME 46 is
- authority hierarchy and escalation boundary
- 4 Actions × 6 Dimensions × 1 Character architecture
- current BODY-first scope
- BODY data model and navigation
- Recommendation Engine pipeline
- current implementation version and test commands
- production URL and deployment path
- active/idle assignment state
- OPEN/WORKING material that must not be mistaken for canon

If a required fact cannot be reconstructed from repository evidence, that is a source-of-truth defect—not permission to invent it.

**PRESERVE THE TRUTH. THEN BUILD FROM IT.**
