# PRIME-DEV-001 — ASSIGNMENT #004

**Status: AUTHORIZED**

- **Authorized:** 2026-09-11
- **Authorized by:** Don Murphin — Founder / Product Owner / Player One

## Milestone
**PRIME 46 BODY MVP v0.8 — BOSS FIGHT & CLOSED PROGRESSION LOOP**

## Objective
Complete the missing end of the first vertical BODY gameplay loop so verified development can progress from Training and ADAPT evidence into a meaningful Boss rematch, verdict, updated Capability history, and the next developmental cycle.

Milestone promise:
> **TRAIN → ADAPT → PROVE IT → FACE YOUR NEXT SELF.**

This milestone must complete the player-facing connection between the already-implemented CHOOSE → ACT → ENDURE → ADAPT flow and the LOCKED BOSS FIGHT system without inventing new canon.

## Why this milestone is next
BODY MVP v0.7 already implements:
- PLAY / CHOOSE
- ACT and ENDURE quest states
- structured Training evidence capture
- ADAPT feedback
- verified Assessment evidence
- Training history
- PROGRESS history
- Recommendation Engine integration

The highest-value missing link is the closed progression loop from development evidence to standardized Boss retesting and back into PRIME's next recommendation cycle.

## Authorized scope
1. Inspect repository state and canonical sources before implementation, following `SOURCE_OF_TRUTH_INDEX.md` and `PRIME_DEV_001_SYSTEM_PROMPT_v1.0.md`.
2. Preserve LOCKED Core Gameplay semantics: CHOOSE → ACT → ENDURE → ADAPT → BOSS FIGHT.
3. Preserve LOCKED BODY data semantics: ASSESSMENT → TRAINING → PROGRESS.
4. Implement the player-facing Boss lifecycle already defined by canon:
   - WAITING
   - REMATCH AVAILABLE
   - REMATCH RECOMMENDED
   - BOSS FIGHT
   - VERDICT
   - readiness reset / new developmental cycle
5. Preserve the distinction between ordinary Assessment, Training, and Boss evidence.
6. Persist Boss-state evidence sufficient to represent, at minimum:
   - capability being tested
   - prior verified benchmark / prior-self reference
   - current verified Boss result
   - undefeated Boss target where applicable
   - Boss state
   - verdict
   - attempt timestamp
   - source/provenance needed to distinguish PRIME-recommended vs player-initiated Boss attempts where the current architecture supports it
7. Implement the existing LOCKED Boss verdict semantics without changing them:
   - legitimate improvement → `BOSS_DEFEATED`
   - equal standardized result → `STALEMATE`
   - worse standardized result → `BOSS_SURVIVES`
8. Preserve the rule that any legitimate improvement defeats the Boss; do not introduce arbitrary minimum improvement thresholds.
9. Preserve the rule that time alone does not create Boss readiness and Training completion alone does not create Boss readiness.
10. Preserve the distinction between Developmental Readiness and Today Readiness as defined by canon.
11. Ensure a legitimate Boss attempt consumes/resets the developmental evidence that justified the rematch so another PRIME-recommended rematch requires new post-attempt development.
12. Ensure verified Boss performance becomes current verified Capability evidence and outranks prior inference, while historical Boss results remain preserved in Progress/history.
13. Ensure regression updates current verified reality without silently lowering an undefeated Boss target contrary to canon.
14. Surface Boss outcomes in PROGRESS so the player can see what was attempted, the verdict, and the verified change over time.
15. Feed new verified Boss evidence back into the Recommendation Engine so PRIME's next recommendation reflects the new current reality.
16. Preserve the rule that player refusal does not erase Boss Readiness.
17. Preserve FILTER authority: an otherwise-ready Boss may still be inappropriate today because of current limitations/context.
18. Preserve mobile-first PLAY · CHARACTER · TRAINING · PROGRESS architecture and existing v0.7 state-integrity guarantees.
19. Add automated tests covering Boss lifecycle, verdicts, persistence, readiness reset, Capability/history updates, Recommendation Engine integration, regression behavior, and state migration/integrity where affected.
20. Run all existing source-of-truth, state-integrity, Recommendation Engine acceptance, and PLAY integration tests and preserve all current passes.
21. Deploy through the established GitHub `main` → Cloudflare production pipeline only after tests pass.
22. Verify production after deployment.
23. Request the smallest purposeful Player One QA mission only if automated evidence cannot adequately verify the player-facing Boss flow.

## Explicitly out of scope
- XP economy or numeric XP values
- Level thresholds or level progression
- Skill trees
- Character visual evolution
- Work Capacity implementation
- Body Control implementation
- The five non-BODY Dimensions
- New scoring curves
- Substitute assessments
- Replacing canonical assessments
- Rewriting Recommendation Engine philosophy
- Full workout-programming engine
- New exercise-progression philosophy
- Large exercise library
- Social systems
- Major visual redesign unrelated to Boss-loop usability
- Retiring Netlify

## Product constraints
Do not turn Assignment #004 into a workout-programming redesign. The current system may use generic safe dose structure and must not invent player Capability, starting loads, or unsupported progression rules to make the Boss loop feel more complete.

Training may develop Capability and influence future prescription, but only verified Assessment / Boss evidence proves Capability.

## Acceptance criteria
- A capability can move through the canonically valid Boss readiness states without fabricated readiness.
- PRIME can present an appropriate Boss rematch through the existing CHOOSE architecture.
- A Boss attempt uses the canonical standardized assessment for the capability.
- The system can distinguish a Boss attempt from ordinary Training and preserve Boss provenance/history.
- `BOSS_DEFEATED`, `STALEMATE`, and `BOSS_SURVIVES` are produced exactly according to LOCKED verdict semantics.
- Any legitimate improvement defeats the Boss; no new minimum threshold is invented.
- Verified Boss evidence updates current verified Capability/history correctly.
- A worse Boss result updates current reality without corrupting the undefeated Boss target semantics.
- A legitimate Boss attempt resets/consumes the developmental readiness evidence that justified the rematch.
- Another PRIME-recommended rematch requires new post-attempt development evidence.
- Player refusal does not erase readiness.
- FILTER/current appropriateness can suppress recommendation of an otherwise developmentally ready Boss.
- PROGRESS clearly displays Boss-result history and verified change.
- Recommendation Engine decisions after a Boss attempt reflect the new verified evidence.
- Training still never silently changes Capability.
- Existing valid player state is preserved or migrated safely where practical.
- Existing source-of-truth, state-integrity, Recommendation Engine acceptance, and PLAY integration suites remain green.
- New Boss lifecycle tests pass.
- Mobile-first PLAY · CHARACTER · TRAINING · PROGRESS remain functional.
- Cloudflare production deployment succeeds and is verified.
- No LOCKED canon is silently changed.

## Escalation rule
If implementation requires deciding or changing what Boss readiness means, what evidence qualifies as developmental readiness, how Capability is scored, what constitutes a canonical Boss attempt, how regression affects Boss-target semantics beyond what canon already states, or any other product/gameplay meaning not explicitly resolved by authoritative sources, STOP and classify it as **PRODUCT DECISION** or **CANON CONFLICT** before changing behavior.

Resolve BUGS and IMPLEMENTATION DECISIONS autonomously within the authority granted by `PRIME_DEV_001_SYSTEM_PROMPT_v1.0.md`.

## Required verification
Before marking this assignment COMPLETE:
1. Run repository source-of-truth integrity tests.
2. Run state-integrity tests.
3. Run Recommendation Engine acceptance tests.
4. Run PLAY integration tests.
5. Run new Boss lifecycle/regression tests.
6. Verify persistence/state migration where changed.
7. Verify production deployment and critical player-facing routes.
8. Clearly distinguish VERIFIED / INFERRED / UNKNOWN in the completion report.

## Required report
Use the PRIME-DEV-001 WORK CYCLE format from System Prompt v1.0:

PRIME-DEV-001 — WORK CYCLE

Milestone:
Status: COMPLETE / BLOCKED / ESCALATION REQUIRED
Built:
Tests:
Deployment:
Player One QA:
Product decisions required:
Next action:

Do not expand scope after satisfying this assignment.

**BUILT. NOT GIVEN.**
