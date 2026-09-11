export const STORAGE_KEY = 'prime46.body.mvp.v0.7';
export const LEGACY_STORAGE_KEYS = ['prime46.body.mvp.v0.2', 'prime46.body.mvp.v0.1'];
export const ASSESSMENT_IDS = ['push','pull','squat','carry','cardio','mobility','balance'];

export const defaultTests = {
  push:{reps:''}, pull:{reps:''}, squat:{oneRmLb:'',estimated:false},
  carry:{totalLoadLb:'',distanceM:40,timeSec:'',completed:false},
  cardio:{walkMin:'',walkSec:'',finishHr:'',vo2:'',method:'rockport'},
  mobility:{deep:{depth:null,heels:null,balance:null,returnStand:null,compensation:null},over:{overhead:null,elbows:null,trunkComp:null,symmetry:null},limiter:''},
  balance:{leftSec:'',rightSec:''}
};

export const defaultState = {
  schemaVersion:7,
  profile:{name:'Don',age:46,sex:'male',heightFt:5,heightIn:8,bodyweightLb:168},
  tests:defaultTests,
  assessmentDrafts:{}, assessmentHistory:[],
  assessmentSession:{entry:'sequence',step:0},
  trainingHistory:[],adaptationHistory:[],constraints:[],goals:[],bosses:{},preference:null,
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
  const migrated=deepMerge(defaultState,{...source,tests:legacyTests,schemaVersion:7});
  migrated.assessmentDrafts = source.schemaVersion>=7 && source.assessmentDrafts && typeof source.assessmentDrafts==='object' ? clone(source.assessmentDrafts) : {};
  migrated.assessmentHistory = Array.isArray(source.assessmentHistory) ? clone(source.assessmentHistory) : [];
  migrated.assessmentSession = deepMerge(defaultState.assessmentSession,source.assessmentSession||{});
  migrated.trainingHistory = Array.isArray(source.trainingHistory) ? clone(source.trainingHistory) : [];
  migrated.adaptationHistory = Array.isArray(source.adaptationHistory) ? clone(source.adaptationHistory) : [];
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
  if(state.assessmentDrafts) delete state.assessmentDrafts[capability];
  return snapshot;
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
