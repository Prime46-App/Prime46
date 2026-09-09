# PRIME BODY Recommendation Engine v0.1

**Milestone:** Input reality. Produce today's intelligent choice.

This implementation follows the locked pipeline:

`FILTER → PRIORITIZE → PRESCRIBE → BOSS CHECK → CHOOSE`

It intentionally does **not** award XP, define Levels, invent assessment results, or silently convert Training into verified Capability.

## Important invariants
- FILTER is authoritative.
- Missing evidence does not gate play, but it limits prescription specificity.
- PRIORITIZE is qualitative/rule-based; it exposes no fake numeric priority score.
- MODIFY does not automatically lower priority.
- Cardio can be PRIMARY, COMPANION, or ACTIVE RECOVERY; recency applies to demand/intensity/purpose, not Cardio presence itself.
- Boss readiness separates developmental readiness from appropriateness today.
- CHOOSE preserves player agency and provenance.
