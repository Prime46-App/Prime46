# PRIME 46 — BODY MVP UI v0.1

Playable browser prototype for the locked BODY / THE VESSEL v1.0 assessment and Character Sheet.

## Run locally
Because the scoring engine uses ES modules, serve the folder over HTTP rather than double-clicking the HTML file.

```bash
python3 -m http.server 8080 --directory .
```
Then open `http://localhost:8080`.

## Included
- Character/profile setup
- Initial Assessment flow: Push, Pull, Squat, Carry, Cardio, Mobility, Balance
- Live capability scoring through `engine.mjs`
- Strength / Endurance / Movement aggregation
- VESSEL score + mastery gate display when all assessments are complete
- Strengths, Weaknesses, Opportunities
- Raw performance table with evidence grades
- Local browser persistence

## Scope protection
This UI implements the locked VESSEL v1.0 specification. It does **not** invent XP, Work Capacity, Body Control, Quests, or progression economy.

## Known implementation boundary
Cardio accepts an estimated/measured VO2max result. It does not calculate Rockport VO2 from walk time/heart rate because the exact estimator formula was not part of the locked implementation contract. This avoids making code the source of new canon.
