export const STORAGE_KEY = 'prime46.body.mvp.v0.8';
export const LEGACY_STORAGE_KEYS = ['prime46.body.mvp.v0.7', 'prime46.body.mvp.v0.2', 'prime46.body.mvp.v0.1'];
export const ASSESSMENT_IDS = ['push','pull','squat','carry','cardio','mobility','balance'];

export const defaultTests = {
  push:{reps:''}, pull:{reps:''}, squat:{oneRmLb:'',estimated:false},
  carry:{totalLoadLb:'',distanceM:40,timeSec:'',completed:false},
  cardio:{walkMin:'',walkSec:'',finishHr:'',vo2:'',method:'rockport'},
  mobility:{deep:{depth:null,heels:null,balance:null,returnStand:null,compensation:null},over:{overhead:null,elbows:null,trunkComp:null,symmetry:null},limiter:''},
  balance:{leftSec:'',rightSec:''}
};

export const defaultState = {
  schemaVersion:8,
  profile:{name:'Don',age:46,sex:'male',heightFt:5,heightIn:8,bodyweightLb:168},
  tests:defaultTests,
  assessmentDrafts:{}, assessmentHistory:[],
  assessmentSession:{entry:'sequence',step:0,mode:'assessment',bossProvenance:null},
  trainingHistory:[],adaptationHistory:[],bossHistory:[],constraints:[],goals:[],bosses:{},preference:null,
  currentContext:{availableMinutes:60,location:'gym',muscleSoreness:false,stiffness:false,cardioCompanion:false,cardioAllowed:true},
  activeQuest:null,lastAdaptSummary:null
};

export const clone = value => JSON.parse(JSON.stringify(value));

export function deepMerge(base, extra){
  if(!extra || typeof extra!=='object') return clone(base);
  const out=clone(base);
  for(const [key,value] of Object.entries(extra)){
    if(value && typeof value==='object' && !Array.isArray(value) && out[key] && typeof out[key]==='object') out[key]=deepMerge(out[key],value);
    else out[key]=clone(value);
  }
  return out;
}

function validLegacyTests(tests){
  return tests && typeof tests==='object' ? deepMerge(defaultTests,tests) : clone(defaultTests);
}

export function migrateState(raw){
  const source=raw && typeof raw==='object' ? raw : {};
  const legacyTests=validLegacyTests(source.tests);
  if(typeof legacyTests.mobility?.deepSquat==='string') legacyTests.mobility=clone(defaultTests.mobility);
  if(!legacyTests.cardio.walkMin) legacyTests.cardio={...defaultTests.cardio,vo2:legacyTests.cardio.vo2||''};
  const migrated=deepMerge(defaultState,{...source,tests:legacyTests,schemaVersion:8});
  migrated.assessmentDrafts = source.schemaVersion>=7 && source.assessmentDrafts && typeof source.assessmentDrafts==='object' ? clone(source.assessmentDrafts) : {};
  migrated.assessmentHistory = Array.isArray(source.assessmentHistory) ? clone(source.assessmentHistory) : [];
  migrated.assessmentSession = deepMerge(defaultState.assessmentSession,source.assessmentSession||{});
  migrated.trainingHistory = Array.isArray(source.trainingHistory) ? clone(source.trainingHistory) : [];
  migrated.adaptationHistory = Array.isArray(source.adaptationHistory) ? clone(source.adaptationHistory) : [];
  migrated.bossHistory = Array.isArray(source.bossHistory) ? clone(source.bossHistory) : [];
  migrated.bosses = source.bosses && typeof source.bosses==='object' ? clone(source.bosses) : {};
  for(const snapshot of migrated.assessmentHistory){
    if(snapshot?.verified && ASSESSMENT_IDS.includes(snapshot.capability) && !migrated.bosses[snapshot.capability]){
      ensureBossCycle(migrated,snapshot.capability,snapshot.raw,snapshot.evidence,snapshot.timestamp);
    }
  }
  return migrated;
}

export function beginAssessmentDraft(state, capability){
  if(!ASSESSMENT_IDS.includes(capability)) return null;
  if(!state.assessmentDrafts) state.assessmentDrafts={};
  if(!state.assessmentDrafts[capability]) state.assessmentDrafts[capability]=clone(state.tests[capability]??defaultTests[capability]);
  return state.assessmentDrafts[capability];
}

export function commitAssessment(state, capability, result, computedEvidence, timestamp=new Date().toISOString()){
  if(!ASSESSMENT_IDS.includes(capability)) throw new Error(`Unknown assessment: ${capability}`);
  const previous=state.tests?.[capability] ? clone(state.tests[capability]) : null;
  state.tests[capability]=clone(result);
  state.assessmentHistory ??=[];
  const snapshot={
    id:`assessment-${capability}-${Date.parse(timestamp)||Date.now()}`,
    timestamp, capability, verified:true, source:'assessment_save',
    raw:clone(result), evidence:clone(computedEvidence), previousRaw:previous
  };
  state.assessmentHistory.push(snapshot);
  ensureBossCycle(state,capability,result,computedEvidence,timestamp);
  if(state.assessmentDrafts) delete state.assessmentDrafts[capability];
  return snapshot;
}

export function canonicalBossMetric(capability, rawResult, computedEvidence){
  if(capability==='push'||capability==='pull') return finiteNumber(rawResult?.reps);
  if(capability==='squat') return finiteNumber(computedEvidence?.raw?.ratio);
  if(capability==='carry') return finiteNumber(computedEvidence?.raw?.ratio);
  if(capability==='cardio') return finiteNumber(computedEvidence?.raw?.vo2);
  if(capability==='balance') return finiteNumber(computedEvidence?.score);
  if(capability==='mobility') return ({LIMITED:1,FUNCTIONAL:2,PROFICIENT:3})[computedEvidence?.classification] ?? null;
  return null;
}

export function ensureBossCycle(state,capability,rawResult,computedEvidence,timestamp=new Date().toISOString()){
  if(!ASSESSMENT_IDS.includes(capability)||state.bosses?.[capability]) return state.bosses?.[capability]??null;
  const metric=canonicalBossMetric(capability,rawResult,computedEvidence);
  if(!Number.isFinite(metric)) return null;
  state.bosses??={};
  state.bosses[capability]={
    capability,benchmarkResult:metric,currentVerifiedResult:metric,undefeatedBossTarget:metric,
    developmentalReadiness:false,todayReadiness:null,readinessEvidence:[],
    cycleStartedAt:timestamp,lastAttemptAt:null,lastVerdict:null,
  };
  return state.bosses[capability];
}

export function establishBossReadiness(state,capability,evidence){
  const boss=state.bosses?.[capability];
  if(!boss||boss.developmentalReadiness===true||!evidence?.id||!evidence?.timestamp) return false;
  boss.developmentalReadiness=true;
  boss.readinessEstablishedAt=evidence.timestamp;
  boss.readinessEvidence=[...clone(boss.readinessEvidence??[]),clone(evidence)];
  return true;
}

export function updateBossReadinessFromTraining(state,event){
  if(!event?.developmentalExposure) return false;
  const capability=event.capabilityTargets?.length===1?event.capabilityTargets[0]:null;
  const boss=state.bosses?.[capability];
  if(!boss||boss.developmentalReadiness===true||new Date(event.timestamp)<=new Date(boss.cycleStartedAt)) return false;
  const transfer=event.transferEvidence===true;
  const current=comparableTrainingValue(event.objectivePerformance);
  const prior=(state.trainingHistory??[]).filter(x=>x.id!==event.id&&x.developmentalExposure&&x.capabilityTargets?.length===1&&x.capabilityTargets[0]===capability&&x.method===event.method&&new Date(x.timestamp)>new Date(boss.cycleStartedAt)).map(x=>comparableTrainingValue(x.objectivePerformance)).filter(Number.isFinite).at(-1);
  if(!transfer&&(!Number.isFinite(current)||!Number.isFinite(prior)||current<=prior)) return false;
  return establishBossReadiness(state,capability,{id:event.id,timestamp:event.timestamp,type:transfer?'explicit_transfer':'comparable_training_trajectory',method:event.method});
}

function comparableTrainingValue(performance){
  if(!performance||typeof performance!=='object') return null;
  if(Number.isFinite(performance.distance)&&Number.isFinite(performance.durationMin)&&performance.durationMin>0) return performance.distance/performance.durationMin;
  if(Number.isFinite(performance.secondsPerSide)) return performance.secondsPerSide;
  if(Number.isFinite(performance.durationMin)) return performance.durationMin;
  const sets=performance.sets??[];
  if(!sets.length||sets.some(x=>!Number.isFinite(x.reps))) return null;
  return sets.reduce((sum,x)=>sum+(Number.isFinite(x.loadLb)?x.loadLb:1)*x.reps,0);
}

export function skipAssessment(state, capability){
  if(state.assessmentDrafts) delete state.assessmentDrafts[capability];
}

export function loadPersistedState(storage){
  try{
    let raw=storage.getItem(STORAGE_KEY);
    if(!raw){ for(const key of LEGACY_STORAGE_KEYS){ raw=storage.getItem(key); if(raw) break; } }
    return migrateState(raw?JSON.parse(raw):null);
  }catch{return clone(defaultState)}
}

export function trainingLogKind(capability, method=''){
  if(capability==='cardio') return 'cardio';
  if(capability==='mobility') return 'mobility';
  if(capability==='balance') return 'balance';
  if(/walk|run|mile|cooper|elliptical|bike|cardio/.test(method)) return 'cardio';
  return 'strength';
}

export function buildObjectivePerformance({kind,values={},notes='',dose=null}){
  const base={completed:true,notes,dose,kind};
  if(kind==='strength'){
    const count=Number(values.setCount);
    return {...base,sets:Number.isFinite(count)&&count>0?Array.from({length:count},()=>({loadLb:numberOrNull(values.loadLb),reps:numberOrNull(values.reps)})):[]};
  }
  if(kind==='cardio') return {...base,durationMin:numberOrNull(values.durationMin),distance:numberOrNull(values.distance),intensity:values.intensity||null};
  if(kind==='balance') return {...base,rounds:numberOrNull(values.rounds),secondsPerSide:numberOrNull(values.secondsPerSide)};
  if(kind==='mobility') return {...base,durationMin:numberOrNull(values.durationMin),focus:values.focus||null};
  return base;
}

function numberOrNull(value){if(value===null||value===undefined||value==='')return null;const number=Number(value);return Number.isFinite(number)?number:null}
function finiteNumber(value){const number=Number(value);return value===null||value===undefined||value===''||!Number.isFinite(number)?null:number}
