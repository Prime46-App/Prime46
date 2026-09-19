import assert from 'node:assert/strict';
import { clone, defaultState } from '../../state.mjs';
import { recordBossAttempt } from '../../boss/attemptTransaction.mjs';

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
  const s=fixture(20,20);s.bosses.push.undefeatedBossTarget=undefined;
  const before=clone(s);assert.throws(()=>attempt(s,21),/target/);assert.deepEqual(s,before);
}
{
  const s=fixture(20,20);s.bosses.push.undefeatedBossTarget=10;
  const r=attempt(s,9,{direction:'lower'});assert.equal(r.verdict,'BOSS_DEFEATED');assert.equal(s.bosses.push.undefeatedBossTarget,9);
}
console.log('Boss transaction regression checks passed');
