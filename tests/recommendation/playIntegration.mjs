import assert from 'node:assert/strict';
import { buildRecommendationInputs } from '../../recommendation/appAdapter.mjs';
import { generateBodyRecommendation } from '../../recommendation/index.mjs';

const computed={push:{score:95},pull:{score:44},squat:null,carry:null,cardio:null,mobility:{classification:'FUNCTIONAL'},balance:null};
const state={trainingHistory:[],adaptationHistory:[],constraints:[],goals:[],bosses:{},currentContext:{availableMinutes:60,location:'gym',cardioCompanion:false}};
const inputs=buildRecommendationInputs({state,computed,now:new Date('2026-09-09T12:00:00Z').getTime()});
const result=generateBodyRecommendation(inputs);
assert.equal(inputs.playerState.capabilities.find(x=>x.capability==='pull').need,'major_limiter');
assert.equal(result.recommended?.candidateId,'pull_train');

const cardioState={...state,trainingHistory:[{timestamp:'2026-09-09T05:00:00Z',capabilityTargets:['cardio'],developmentalExposure:true}],adaptationHistory:[{timestamp:'2026-09-09T05:05:00Z',capability:'cardio',effort:'hard',limitation:'none',capacityRemaining:'empty'}]};
const cardioInputs=buildRecommendationInputs({state:cardioState,computed:{...computed,cardio:{score:55}},now:new Date('2026-09-09T12:00:00Z').getTime()});
assert.equal(cardioInputs.currentContext.suppressHighDemandCardioToday,true);

const homeInputs=buildRecommendationInputs({state:{...state,currentContext:{availableMinutes:60,location:'home'}},computed,now:new Date('2026-09-09T12:00:00Z').getTime()});
assert.equal(homeInputs.currentContext.availableMethods.includes('pulldown'),false);
assert.equal(homeInputs.currentContext.availableMethods.includes('pushup'),true);
console.log('PASS PLAY integration adapter: measured state -> engine inputs -> recommendation');

// QA-03: after recent Pull training, missing Balance evidence must surface as ESTABLISH/ASSESS,
// never DEVELOP/MAINTAIN.
const qa03State={
  ...state,
  trainingHistory:[{id:'qa03-pull',timestamp:'2026-09-09T11:41:38-07:00',capabilityTargets:['pull'],developmentalExposure:true,objectivePerformance:{completed:true}}],
  adaptationHistory:[{id:'qa03-adapt',timestamp:'2026-09-09T11:41:38-07:00',capability:'pull',effort:'right',limitation:'none',capacityRemaining:'about_right'}]
};
const qa03Inputs=buildRecommendationInputs({state:qa03State,computed,now:new Date('2026-09-09T11:47:00-07:00').getTime()});
const qa03=generateBodyRecommendation(qa03Inputs);
assert.equal(qa03.recommended?.candidateId,'balance_assess');
assert.equal(qa03.recommended?.quest?.questType,'assess');
assert.equal(qa03.recommended?.quest?.intent,'assess');
assert.equal(qa03.recommended?.quest?.evidenceAction,'establish');
assert.equal(qa03.recommended?.quest?.target,'Establish Balance Baseline');
assert.equal(qa03.recommended?.quest?.method,'balance_assessment');
console.log('PASS QA-03: missing Balance evidence -> ESTABLISH BALANCE assessment, not DEVELOP/MAINTAIN');
