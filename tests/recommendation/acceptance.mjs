import assert from 'node:assert/strict';
import { generateBodyRecommendation } from '../../recommendation/index.mjs';

function cap(capability, overrides={}) {
  return {
    capability,
    currentEvidence:{ id:`${capability}-e1`, standardized:true },
    need:'maintenance', informationValue:'adequate', balance:'balanced', recency:'ready_for_exposure',
    ...overrides,
  };
}

function baseline() {
  return {
    playerState:{
      capabilities:[
        cap('push',{ need:'maintenance', recency:'recent' }),
        cap('pull',{ need:'major_limiter' }),
        cap('squat',{ currentEvidence:null, informationValue:'high' }),
        cap('carry',{ currentEvidence:{id:'carry-e1'}, need:'advancement', balance:'underexposed' }),
        cap('cardio',{ currentEvidence:null, informationValue:'high', balance:'underexposed' }),
        cap('mobility',{ need:'maintenance' }),
        cap('balance',{ need:'maintenance' }),
      ],
      constraints:[], goals:[]
    },
    trainingHistory:[], adaptationHistory:[], currentContext:{ availableMethods:['pushup','press','row','pulldown','pullup','squat_assessment_path','farmer_carry','rockport','mile','cooper','mobility_session','balance_session','walk','elliptical','bike','run'] }
  };
}

function recommendedId(r) { return r.recommended?.candidateId ?? null; }
function filterRow(r,id){ return r.filter.find(x=>x.id===id); }
function rankRow(r,id){ return r.prioritize.find(x=>x.id===id); }

const tests=[];
function test(name,fn){ tests.push([name,fn]); }

// 1 Control
test('01 control recommends Pull',()=>{
  const r=generateBodyRecommendation(baseline());
  assert.equal(recommendedId(r),'pull_train');
  assert.equal(filterRow(r,'pull_train').status,'pass');
  assert.ok(rankRow(r,'pull_train').reasonCodes.includes('PULL_MAJOR_LIMITER'));
});

// 2 Pull trained yesterday: Need remains but very recent suppresses repetition.
test('02 recent Pull suppresses repetition without deleting Need',()=>{
  const x=baseline(); x.playerState.capabilities.find(c=>c.capability==='pull').recency='very_recent';
  x.playerState.capabilities.find(c=>c.capability==='cardio').informationValue='critical';
  const r=generateBodyRecommendation(x);
  assert.equal(recommendedId(r),'cardio_assess');
  assert.equal(rankRow(r,'pull_train').signals.need,'major_limiter');
  assert.equal(rankRow(r,'pull_train').signals.recency,'very_recent');
});

// 3 Significant Pull limitation blocks strict Pull.
test('03 significant Pull limitation blocks Pull target when no modified return is allowed',()=>{
  const x=baseline(); x.playerState.constraints=[{scope:'capability',target:'pull',severity:'significant',lifecycle:'active',allowModifiedReturn:false}];
  x.playerState.capabilities.find(c=>c.capability==='cardio').informationValue='critical';
  const r=generateBodyRecommendation(x);
  assert.equal(filterRow(r,'pull_train').status,'block');
  assert.notEqual(recommendedId(r),'pull_train');
});

// 4 Same limitation, safe Pull method exists; MODIFY preserves target.
test('04 safe alternate Pull method preserves Pull through MODIFY',()=>{
  const x=baseline();
  x.playerState.constraints=[
    {scope:'capability',target:'pull',severity:'significant',lifecycle:'active',allowModifiedReturn:true},
    {scope:'method',target:'pullup',severity:'significant',lifecycle:'active'}
  ];
  const r=generateBodyRecommendation(x);
  assert.equal(filterRow(r,'pull_train').status,'modify');
  assert.equal(recommendedId(r),'pull_train');
  assert.equal(r.recommended.quest.doseDecision,'modify');
});

// 5 High-information-value unknown can outrank known weakness.
test('05 critical Cardio unknown can outrank known Pull weakness',()=>{
  const x=baseline(); x.playerState.capabilities.find(c=>c.capability==='cardio').informationValue='critical';
  x.playerState.capabilities.find(c=>c.capability==='pull').recency='very_recent';
  const r=generateBodyRecommendation(x);
  assert.equal(recommendedId(r),'cardio_assess');
  assert.ok(r.recommended.reasons.includes('CARDIO_CRITICAL_INFORMATION_VALUE'));
});

// 6 Explicit Cardio current goal raises Cardio need.
test('06 explicit Cardio goal raises goal relevance',()=>{
  const x=baseline();
  const cardio=x.playerState.capabilities.find(c=>c.capability==='cardio');
  cardio.currentEvidence={id:'cardio-e1'}; cardio.informationValue='adequate'; cardio.need='advancement'; cardio.recency='ready_for_exposure';
  x.playerState.capabilities.find(c=>c.capability==='pull').recency='very_recent';
  x.playerState.goals=[{capability:'cardio',priority:'current_focus',active:true}];
  const r=generateBodyRecommendation(x);
  assert.equal(recommendedId(r),'cardio_train');
  assert.ok(r.recommended.reasons.includes('CARDIO_PLAYER_GOAL'));
});

// 7 Repeated choices are preference evidence, not motive. Engine does not alter goal relevance.
test('07 repeated Cardio choices without explicit goal do not erase Pull Need or infer motive',()=>{
  const x=baseline();
  x.playerState.preference={ repeatedChoice:{capability:'cardio',count:5}, intentClarificationRequired:true };
  const r=generateBodyRecommendation(x);
  assert.equal(recommendedId(r),'pull_train');
  assert.equal(rankRow(r,'pull_train').signals.need,'major_limiter');
  assert.equal(rankRow(r,'cardio_assess').signals.goalRelevance,null);
});

// 8 Player-directed method with verified improvement can inform method selection through allowed method ordering.
test('08 player-proven Pull method is usable without changing provenance of current recommendation',()=>{
  const x=baseline();
  x.currentContext.availableMethods=['row','pulldown','pullup','pushup','press','squat_assessment_path','farmer_carry','rockport','mile','cooper','mobility_session','balance_session'];
  x.trainingHistory=[{id:'t1',timestamp:'2026-09-08T10:00:00Z',capabilityTargets:['pull'],method:'row',source:'player_initiated',objectivePerformance:{completed:true,verifiedImprovement:true}}];
  const r=generateBodyRecommendation(x);
  assert.equal(recommendedId(r),'pull_train');
  assert.equal(r.recommended.quest.capability,'pull');
  assert.equal(r.recommended.source,'prime_recommended');
});

// 9 Boss developmentally ready, poor timing -> available not recommended.
test('09 Pull Boss developmentally ready but poor timing is REMATCH AVAILABLE',()=>{
  const x=baseline();
  x.playerState.capabilities.find(c=>c.capability==='pull').currentBoss={developmentalReadiness:true,todayReadiness:true,undefeatedBossTarget:5,currentVerifiedResult:5};
  x.adaptationHistory=[{timestamp:'2026-09-09T09:00:00Z',capability:'pull',effort:'hard',limitation:'none',capacityRemaining:'empty',recent:true}];
  const r=generateBodyRecommendation(x);
  assert.equal(r.bossStates.find(b=>b.capability==='pull').state,'rematch_available');
  assert.equal(r.recommended.type,'quest');
});

// 10 Boss ready and appropriate -> Boss becomes recommendation.
test('10 Pull Boss ready and appropriate becomes PRIME recommendation',()=>{
  const x=baseline();
  x.playerState.capabilities.find(c=>c.capability==='pull').currentBoss={developmentalReadiness:true,todayReadiness:true,undefeatedBossTarget:5,currentVerifiedResult:5};
  const r=generateBodyRecommendation(x);
  assert.equal(r.bossStates.find(b=>b.capability==='pull').state,'rematch_recommended');
  assert.equal(r.recommended.type,'boss');
  assert.equal(r.recommended.boss.capability,'pull');
});

// Cardio special-role invariant.
test('CARDIO rule: recent high-demand Cardio suppresses redundant primary demand, not Cardio presence as a whole',()=>{
  const x=baseline();
  const cardio=x.playerState.capabilities.find(c=>c.capability==='cardio');
  cardio.currentEvidence={id:'cardio-e1'}; cardio.informationValue='adequate'; cardio.need='meaningful_need'; cardio.recency='very_recent';
  x.currentContext.suppressHighDemandCardioToday=true;
  const r=generateBodyRecommendation(x);
  assert.equal(filterRow(r,'cardio_train').status,'modify');
  assert.equal(filterRow(r,'cardio_train').eligible,true);
});

// Cardio companion layer can coexist with another primary Quest.
test('CARDIO companion can attach to Pull without competing for the primary slot',()=>{
  const x=baseline(); x.currentContext.cardioCompanion=true;
  const r=generateBodyRecommendation(x);
  assert.equal(recommendedId(r),'pull_train');
  assert.equal(r.cardioLayer?.role,'companion');
  assert.equal(r.cardioLayer?.developmentalExposure,false);
});

// Light Cardio can be used as active recovery without counting as developmental Cardio exposure.
test('CARDIO active recovery can coexist with Pull and does not count as developmental Cardio exposure',()=>{
  const x=baseline(); x.currentContext.muscleSoreness=true;
  const r=generateBodyRecommendation(x);
  assert.equal(recommendedId(r),'pull_train');
  assert.equal(r.cardioLayer?.role,'active_recovery');
  assert.equal(r.cardioLayer?.demand,'light');
  assert.equal(r.cardioLayer?.developmentalExposure,false);
});

// Adversarial A-01.
test('A-01 conflicting signals resolve without numeric priority score',()=>{
  const x=baseline();
  // Pull: biggest limiter + significant limitation with a modified safe path.
  x.playerState.constraints=[
    {scope:'capability',target:'pull',severity:'significant',lifecycle:'active',allowModifiedReturn:true},
    {scope:'method',target:'pullup',severity:'significant',lifecycle:'active'}
  ];
  x.playerState.capabilities.find(c=>c.capability==='pull').currentBoss={developmentalReadiness:true,todayReadiness:false,undefeatedBossTarget:5,currentVerifiedResult:5};
  // Cardio: explicit goal + underexposed + very recent hard exposure.
  const cardio=x.playerState.capabilities.find(c=>c.capability==='cardio');
  cardio.currentEvidence={id:'cardio-e1'}; cardio.informationValue='adequate'; cardio.need='advancement'; cardio.balance='underexposed'; cardio.recency='very_recent';
  x.playerState.goals=[{capability:'cardio',priority:'current_focus',active:true}];
  // Squat: critical unresolved evidence.
  const squat=x.playerState.capabilities.find(c=>c.capability==='squat'); squat.informationValue='critical';
  // Carry: neglected but unavailable.
  const carry=x.playerState.capabilities.find(c=>c.capability==='carry'); carry.balance='neglected';
  x.currentContext.unavailableMethods=['farmer_carry'];
  x.currentContext.suppressHighDemandCardioToday=true;
  const r=generateBodyRecommendation(x);
  assert.equal(filterRow(r,'carry_train').status,'block');
  assert.equal(filterRow(r,'pull_train').status,'modify');
  assert.equal(r.bossStates.find(b=>b.capability==='pull').state,'rematch_available');
  assert.equal(recommendedId(r),'squat_assess');
  assert.equal('priorityScore' in rankRow(r,'squat_assess'),false);
});

let passed=0;
for (const [name,fn] of tests) {
  try { fn(); console.log(`PASS ${name}`); passed++; }
  catch (err) { console.error(`FAIL ${name}`); console.error(err); process.exitCode=1; }
}
console.log(`\n${passed}/${tests.length} acceptance checks passed.`);
if (passed !== tests.length) process.exitCode=1;
