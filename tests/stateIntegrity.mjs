import assert from 'node:assert/strict';
import {clone,defaultState,migrateState,beginAssessmentDraft,commitAssessment,skipAssessment,trainingLogKind,buildObjectivePerformance} from '../state.mjs';

const fresh=()=>clone(defaultState);

{const s=fresh(),draft=beginAssessmentDraft(s,'push');draft.reps='25';assert.equal(s.tests.push.reps,'');skipAssessment(s,'push');assert.equal(s.tests.push.reps,'');assert.equal(s.assessmentHistory.length,0);console.log('PASS assessment draft + skip preserve verified Capability')}

{const s=fresh(),draft=beginAssessmentDraft(s,'push');draft.reps='25';commitAssessment(s,'push',draft,{score:63,tier:'STRONG',raw:{reps:25}},'2026-09-11T07:00:00.000Z');assert.equal(s.tests.push.reps,'25');assert.equal(s.assessmentHistory.length,1);assert.equal(s.assessmentHistory[0].verified,true);assert.equal(s.assessmentHistory[0].evidence.score,63);assert.equal(s.assessmentDrafts.push,undefined);console.log('PASS SAVE RESULT commits explicit verified evidence')}

{const s=fresh();commitAssessment(s,'push',{reps:'20'},{score:48,tier:'CAPABLE'},'2026-09-01T07:00:00.000Z');commitAssessment(s,'push',{reps:'25'},{score:63,tier:'STRONG'},'2026-09-11T07:00:00.000Z');assert.deepEqual(s.assessmentHistory.map(x=>x.evidence.score),[48,63]);assert.equal(s.assessmentHistory[1].previousRaw.reps,'20');console.log('PASS verified Assessment history preserves change over time')}

{const s=migrateState({profile:{name:'Player'},tests:{push:{reps:40},pull:{reps:5}},trainingHistory:[{id:'t1'}]});assert.equal(s.schemaVersion,7);assert.equal(s.tests.push.reps,40);assert.equal(s.trainingHistory[0].id,'t1');assert.deepEqual(s.assessmentHistory,[]);console.log('PASS legacy state migration preserves valid existing data')}

{const s=fresh();s.tests.push.reps='20';const before=clone(s.tests);s.trainingHistory.push({capabilityTargets:['push'],objectivePerformance:{completed:true,sets:[{loadLb:100,reps:10}]}});assert.deepEqual(s.tests,before);console.log('PASS Training history cannot silently change Capability')}

{assert.equal(trainingLogKind('pull','row'),'strength');assert.equal(trainingLogKind('cardio','elliptical'),'cardio');assert.equal(trainingLogKind('mobility','mobility_session'),'mobility');assert.equal(trainingLogKind('balance','balance_session'),'balance');const cardio=buildObjectivePerformance({kind:'cardio',values:{durationMin:'20',distance:'1.5',intensity:'moderate'}});assert.equal(cardio.durationMin,20);assert.equal(cardio.sets,undefined);const strength=buildObjectivePerformance({kind:'strength',values:{loadLb:'100',reps:'10',setCount:'3'}});assert.equal(strength.sets.length,3);console.log('PASS method-aware Training evidence fields')}

console.log('\n6/6 state-integrity checks passed.');
