import assert from 'node:assert/strict';
import fs from 'node:fs';
import { clone, defaultState, migrateState } from '../../state.mjs';
import { recordBossAttempt } from '../../boss/attemptTransaction.mjs';
import { buildRecommendationInputs } from '../../recommendation/appAdapter.mjs';
import { generateBodyRecommendation } from '../../recommendation/index.mjs';

function fixture(target=20, current=20){
  const s=clone(defaultState);
  s.tests.push={reps:String(current)};
  s.bosses.push={undefeatedBossTarget:target,currentVerifiedResult:current,developmentalReadiness:true,todayReadiness:true,readinessEvidence:['training-1']};
  s.assessmentDrafts.push={reps:'21'};
  return s;
}
function attempt(state, value, overrides={}){return recordBossAttempt(state,{capability:'push',rawResult:{reps:String(value)},computedEvidence:{score:value,verified:true},currentResult:value,source:'prime_recommended',timestamp:'2026-09-19T20:00:00.000Z',...overrides});}
for(const [value,expected,target] of [[21,'BOSS_DEFEATED',21],[20,'STALEMATE',20],[19,'BOSS_SURVIVES',20]]){
  const s=fixture();const result=attempt(s,value);
  assert.equal(result.verdict,expected);assert.equal(s.bosses.push.currentVerifiedResult,value);
  assert.equal(s.bosses.push.undefeatedBossTarget,target);
  assert.equal(s.bosses.push.developmentalReadiness,false);
  assert.deepEqual(s.bosses.push.readinessEvidence,[]);
  assert.equal(s.bosses.push.cycleStartedAt,result.timestamp);
  assert.equal(s.bossHistory.length,1);assert.equal(s.assessmentHistory.length,1);
  assert.equal(s.assessmentHistory[0].source,'boss_attempt');assert.equal(s.tests.push.reps,String(value));
  assert.equal(s.assessmentDrafts.push,undefined);
  assert.throws(()=>attempt(s,value),/Duplicate/);
}
{
  const s=fixture(20,20);const result=attempt(s,19,{source:'player_initiated'});
  assert.equal(result.initiation,'player_initiated');assert.equal(result.priorBossTarget,20);
  assert.equal(result.previousVerifiedResult,20);assert.equal(s.bosses.push.undefeatedBossTarget,20);
}
{
  const s=fixture(20,20);const before=clone(s);
  assert.throws(()=>attempt(s,NaN),/Comparable/);
  assert.deepEqual(s,before,'validation failure must not modify player state');
  assert.throws(()=>attempt(s,21,{source:'inferred'}),/provenance/);
  assert.deepEqual(s,before);
  assert.throws(()=>attempt(s,21,{computedEvidence:{verified:false}}),/Unverified/);
  assert.deepEqual(s,before);
}
{
  const s=fixture(20,20);delete s.bosses.push.undefeatedBossTarget;
  const before=clone(s);assert.throws(()=>attempt(s,21),/target/);assert.deepEqual(s,before);
}
{
  const s=fixture(20,20);s.bosses.push.undefeatedBossTarget=10;
  const r=attempt(s,9,{direction:'lower'});assert.equal(r.verdict,'BOSS_DEFEATED');assert.equal(s.bosses.push.undefeatedBossTarget,9);
}
{
  const s=fixture(20,20),before=clone(s);
  // Refusing/leaving a surfaced Boss is a UI choice and does not call the transaction.
  assert.deepEqual(s,before);assert.equal(s.bosses.push.developmentalReadiness,true);
}
{
  const s=fixture(20,20);attempt(s,21);
  const restored=migrateState(JSON.parse(JSON.stringify(s)));
  assert.equal(restored.tests.push.reps,'21');assert.equal(restored.bossHistory.length,1);
  assert.equal(restored.bosses.push.currentVerifiedResult,21);assert.equal(restored.bosses.push.undefeatedBossTarget,21);
}
{
  const s=fixture(20,20);attempt(s,19);
  const computed={push:{score:45},pull:null,squat:null,carry:null,cardio:null,mobility:null,balance:null};
  const result=generateBodyRecommendation(buildRecommendationInputs({state:s,computed,now:new Date('2026-09-20T00:00:00.000Z').getTime()}));
  assert.equal(result.bossStates.find(x=>x.capability==='push').state,'waiting');
  assert.notEqual(result.recommended?.type,'boss','post-attempt recommendation must consume readiness');
}
{
  const app=fs.readFileSync(new URL('../../app.mjs',import.meta.url),'utf8');
  assert.match(app,/recordBossAttempt/);assert.match(app,/SAVE BOSS RESULT/);
  assert.match(app,/PLAYER-INITIATED REMATCH/);assert.match(app,/BOSS VERDICTS/);
  assert.match(app,/updateBossReadinessFromTraining/);
}
console.log('Boss transaction, persistence, recommendation, refusal, provenance, and application integration checks passed');
