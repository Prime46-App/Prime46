import { CARDIO_ROLE } from './models.mjs';

/** Controlled BODY v0.1 quest library. These are target archetypes, not fabricated prescriptions. */
export const BODY_QUEST_LIBRARY = Object.freeze([
  { id:'push_train', capability:'push', questType:'train', developmentalTarget:'Develop Push', methods:['pushup','press'] },
  { id:'pull_train', capability:'pull', questType:'train', developmentalTarget:'Develop Pull', methods:['row','pulldown','pullup'] },
  { id:'squat_train', capability:'squat', questType:'train', developmentalTarget:'Develop Squat', methods:['barbell_squat','goblet_squat','bodyweight_squat'] },
  { id:'carry_train', capability:'carry', questType:'train', developmentalTarget:'Develop Carry', methods:['farmer_carry'] },
  { id:'cardio_train', capability:'cardio', questType:'train', developmentalTarget:'Develop Cardio', cardioRole:CARDIO_ROLE.PRIMARY, methods:['walk','elliptical','bike','run'] },
  { id:'cardio_assess', capability:'cardio', questType:'assess', developmentalTarget:'Establish Cardio Baseline', cardioRole:CARDIO_ROLE.PRIMARY, methods:['rockport','mile','cooper'] },
  { id:'squat_assess', capability:'squat', questType:'assess', developmentalTarget:'Establish Squat Baseline', methods:['squat_assessment_path'] },
  { id:'carry_assess', capability:'carry', questType:'assess', developmentalTarget:'Establish Carry Baseline', methods:['farmer_carry_40m'] },
  { id:'mobility_train', capability:'mobility', questType:'train', developmentalTarget:'Develop Mobility', methods:['mobility_session'] },
  { id:'balance_train', capability:'balance', questType:'train', developmentalTarget:'Develop Balance', methods:['balance_session'] },
]);

export function generateBodyCandidates(playerState = {}) {
  const states = new Map((playerState.capabilities ?? []).map(x => [x.capability, x]));
  const out = [];
  for (const q of BODY_QUEST_LIBRARY) {
    const state = states.get(q.capability) ?? {};
    if (q.questType === 'assess') {
      const missingOrImportant = !state.currentEvidence || state.informationValue === 'critical' || state.informationValue === 'high';
      if (!missingOrImportant) continue;
    }
    if (q.questType === 'train' && !state.currentEvidence && ['squat','cardio','carry'].includes(q.capability)) {
      // Missing evidence does not gate play, but advanced target-specific prescription should re-establish first.
      // Keep foundational train candidate only if explicitly allowed.
      if (!state.foundationalTrainingAllowed) continue;
    }
    out.push({ ...q, possibleMethods:[...q.methods], state });
  }
  return out;
}
