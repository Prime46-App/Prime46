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
