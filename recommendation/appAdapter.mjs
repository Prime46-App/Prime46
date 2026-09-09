const RECENCY_WINDOWS = Object.freeze({
  VERY_RECENT_HOURS:36,
  RECENT_HOURS:96,
  BALANCE_LOOKBACK_DAYS:14,
});

function latestExposure(trainingHistory=[], capability){
  return trainingHistory
    .filter(e => e.capabilityTargets?.includes(capability) && e.developmentalExposure !== false)
    .sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp))[0] ?? null;
}
function hoursSince(timestamp, now=Date.now()){
  if(!timestamp) return Infinity;
  return Math.max(0,(now-new Date(timestamp).getTime())/36e5);
}
function recencyFor(trainingHistory, capability, now){
  const latest=latestExposure(trainingHistory,capability);
  const h=hoursSince(latest?.timestamp,now);
  if(h<=RECENCY_WINDOWS.VERY_RECENT_HOURS)return 'very_recent';
  if(h<=RECENCY_WINDOWS.RECENT_HOURS)return 'recent';
  return 'ready_for_exposure';
}
function balanceFor(trainingHistory, capability, now){
  const cutoff=now-RECENCY_WINDOWS.BALANCE_LOOKBACK_DAYS*864e5;
  const count=trainingHistory.filter(e=>e.capabilityTargets?.includes(capability) && e.developmentalExposure!==false && new Date(e.timestamp).getTime()>=cutoff).length;
  if(count===0)return 'underexposed';
  if(count>=5)return 'overrepresented';
  return 'balanced';
}
function evidence(capability, result){
  if(!result)return null;
  if(capability==='mobility')return {id:'mobility-current',standardized:true,measurement:result.classification};
  return {id:`${capability}-current`,standardized:true,measurement:result.score};
}
function baseNeed(result){
  const score=result?.score;
  if(!Number.isFinite(score))return 'maintenance';
  if(score<40)return 'meaningful_need';
  if(score<60)return 'meaningful_need';
  if(score<80)return 'advancement';
  return 'maintenance';
}

function methodsForLocation(location){
  if(location==='home') return ['pushup','bodyweight_squat','mobility_session','balance_session','walk','run','mile','cooper'];
  if(location==='outdoors') return ['walk','run','mile','cooper','mobility_session','balance_session','bodyweight_squat'];
  return ['pushup','press','row','pulldown','pullup','barbell_squat','goblet_squat','bodyweight_squat','squat_assessment_path','farmer_carry','farmer_carry_40m','rockport','mile','cooper','mobility_session','balance_session','walk','elliptical','bike','run'];
}
function latestAdaptation(adaptationHistory=[],capability){return adaptationHistory.filter(x=>x.capability===capability).sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp))[0]??null}

export function buildRecommendationInputs({state,computed,now=Date.now()}={}){
  const trainingHistory=state.trainingHistory ?? [];
  const adaptationHistory=state.adaptationHistory ?? [];
  const map={push:computed.push,pull:computed.pull,squat:computed.squat,carry:computed.carry,cardio:computed.cardio,mobility:computed.mobility,balance:computed.balance};
  const known=Object.entries(map).filter(([,r])=>Number.isFinite(r?.score));
  const lowest=known.length>=2 ? known.slice().sort((a,b)=>a[1].score-b[1].score)[0]?.[0] : null;
  const capabilities=Object.entries(map).map(([capability,result])=>{
    const currentEvidence=evidence(capability,result);
    let need=baseNeed(result);
    if(capability===lowest) need='major_limiter';
    return {
      capability,
      currentEvidence,
      currentScore:Number.isFinite(result?.score)?result.score:null,
      need,
      informationValue:currentEvidence?'adequate':'high',
      balance:balanceFor(trainingHistory,capability,now),
      recency:recencyFor(trainingHistory,capability,now),
      currentBoss:state.bosses?.[capability] ?? null,
    };
  });
  const location=state.currentContext?.location ?? 'gym';
  const cardioRecency=recencyFor(trainingHistory,'cardio',now);
  const cardioAdapt=latestAdaptation(adaptationHistory,'cardio');
  const suppressHighDemandCardioToday=cardioRecency==='very_recent' && cardioAdapt?.effort==='hard' && cardioAdapt?.capacityRemaining==='empty';
  const currentContext={
    availableMinutes:Number(state.currentContext?.availableMinutes ?? 60),
    location,
    availableMethods:state.currentContext?.availableMethods ?? methodsForLocation(location),
    muscleSoreness:Boolean(state.currentContext?.muscleSoreness),
    stiffness:Boolean(state.currentContext?.stiffness),
    cardioCompanion:Boolean(state.currentContext?.cardioCompanion),
    cardioAllowed:state.currentContext?.cardioAllowed !== false,
    suppressHighDemandCardioToday,
  };
  return {
    playerState:{capabilities,constraints:state.constraints??[],goals:state.goals??[],preference:state.preference??null},
    trainingHistory,
    adaptationHistory,
    currentContext,
  };
}

export { RECENCY_WINDOWS };
