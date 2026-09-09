# PRIME 46 — THE VESSEL v1.0 Implementation Contract
Status: LOCKED / DESIGN SCOPE FREEZE

## Hierarchy
BODY — THE VESSEL
- STRENGTH: Push, Pull, Squat, Carry
- ENDURANCE: Cardio, Work Capacity [LOCKED/LATER]
- MOVEMENT: Mobility, Balance, Body Control [LOCKED/LATER]

## Tiers
- 0–19 FOUNDATION
- 20–39 DEVELOPING
- 40–59 CAPABLE
- 60–79 STRONG
- 80–89 ADVANCED
- 90–100 ELITE

## Evidence rule
Raw performance is preserved. Performance, Capability, Peer Standing, Personal Progress, and XP are separate concepts. Do not invent external percentiles where credible norms do not exist.

## Push v0.1
Curve anchors (strict reps → score):
0→0, 10→20, 17→40, 21→50, 24→60, 26→70, 30→80, 34→85, 36→90, 40→95, 65→100.
Evidence A.

## Pull v0.1
Strict pull-ups anchors:
0→0, 1→15, 2→25, 3→35, 4→40, 5→44, 6→48, 7→52, 8→56, 9→60, 10→64, 11→68, 12→72, 13→76, 14→80, 15→84, 16→88, 17→92, 18→96, 19+→100.
Evidence B. Do not present as population percentile.

## Cardio v0.1
Progression: Rockport 1-mile fast walk → Run the Mile achievement → Cooper 1.5-mile advanced test.
Primary capability metric is estimated VO2max.
VO2 anchors: 24.2→5, 26.8→10, 31.9→25, 37.8→50, 45.0→75, 52.1→90, 55.6→95.
Evidence A. No locked score-100 VO2 anchor exists in v0.1; do not invent one.

## Squat v0.1
Canonical test: barbell back squat.
Primary metric: 1RM / bodyweight. Measured 1RM preferred; estimated low-rep 1RM must be labeled estimated.
Machine performances remain records and are never converted to barbell equivalents.
Curve: 0.5x→10, 0.75x→20, 1.0x→40, 1.25x→50, 1.5x→60, 1.75x→70, 2.0x→80, 2.25x→85, 2.5x→90, 2.75x→95, 3.0x→100.
Track absolute and relative PRs. Evidence B.

## Carry v0.1
Canonical test: bilateral farmer carry, 40 m, equal implements, no straps; controlled gait/posture, no drop. Chalk may be recorded.
Primary metric: total external load / bodyweight. Completion time is recorded but does not affect Capability score.
Curve: 0.25x→20, 0.5x→40, 0.75x→60, 1.0x→80, 1.25x→90, 1.5x→100.
Farmer Hold is a supporting record/Boss, not a substitute test. Evidence C / PRIME criterion. No percentile claims.

## Mobility v0.1
Tests: Deep Squat + Overhead Reach.
Output only: LIMITED / FUNCTIONAL / PROFICIENT. No fake 0–100 Mobility score.
Record screen observations, limiters, and asymmetry. Improvement can defeat a prior movement-limitation Boss.

## Balance v0.1
Eyes-open single-leg stand, both sides; 60-second ceiling.
Side score anchors: 0→0, 10s→20, 20s→40, 30s→60, 40s→80, 50s→90, 60s→100.
Overall Balance = 70% weaker-side score + 30% stronger-side score.
Asymmetry % = (best seconds - worst seconds) / best seconds * 100.

## Strength
Raw Strength = mean(Push, Pull, Squat, Carry).
Mastery gates:
- any branch <40: Strength cannot reach STRONG; cap 59
- otherwise any branch <60: cannot reach ADVANCED; cap 79
- otherwise any branch <80: cannot reach ELITE; cap 89

## Endurance
v1.0 Endurance = Cardio score. Work Capacity remains locked for later.

## Movement
v1.0 numerical basis = Balance score.
Mobility is a mastery gate:
- LIMITED: Movement cap 39
- FUNCTIONAL: Movement cap 79
- PROFICIENT: no Mobility cap
Body Control remains locked for later.

## VESSEL
Raw VESSEL = equal mean of Strength, Endurance, Movement (1/3 each).
Apply same mastery gates across the three domains:
- any domain <40: cannot reach STRONG; cap 59
- otherwise any domain <60: cannot reach ADVANCED; cap 79
- otherwise any domain <80: cannot reach ELITE; cap 89

## Boss Fight
The Boss is the player's previous standardized performance.
- higher-is-better: current > previous = BOSS_DEFEATED
- lower-is-better: current < previous = BOSS_DEFEATED
- equal = STALEMATE
- otherwise = BOSS_SURVIVES
Any legitimate PR defeats the Boss.
Improvement % is displayed separately.

## Scope freeze
Do not invent XP economy, Work Capacity, Body Control, new Dimensions, or substitute benchmark curves during BODY MVP implementation. Conflicts return to product design explicitly.
