import { CARDIO_ROLE } from './models.mjs';

/** Controlled BODY v0.1 quest library. These are target archetypes, not fabricated prescriptions. */
export const BODY_QUEST_LIBRARY = Object.freeze([
  { id:'push_train', capability:'push', questType:'train', developmentalTarget:'Develop Push', methods:['pushup','press'] },
  { id:'pull_train', capability:'pull', questType:'train', developmentalTarget:'Develop Pull', methods:['row','pulldown','pullup'] },
  { id:'squat_train', capability:'squat', questType:'train', developmentalTarget:'Develop Squat', methods:['barbell_squat','goblet_squat','bodyweight_squat'] },
  { id:'carry_train', capability:'carry', questType:'train', developmentalTarget:'Develop Carry', methods:['farmer_carry'] },
  { id:'cardio_train', capability:'cardio', questType:'train', developmentalTarget:'Develop Cardio', cardioRole:CARDIO_ROLE.PRIMARY, methods:['walk','elliptical','bike','run'] },
  { id:'mobility_train', capability:'mobility', questType:'train', developmentalTarget:'Develop Mobility', methods:['mobility_session'] },
  { id:'balance_train', capability:'balance', questType:'train', developmentalTarget:'Develop Balance', methods:['balance_session'] },

  { id:'cardio_assess', capability:'cardio', questType:'assess', developmentalTarget:'Establish Cardio Baseline', cardioRole:CARDIO_ROLE.PRIMARY, methods:['rockport','mile','cooper'] },
  { id:'squat_assess', capability:'squat', questType:'assess', developmentalTarget:'Establish Squat Baseline', methods:['squat_assessment_path'] },
  { id:'carry_assess', capability:'carry', questType:'assess', developmentalTarget:'Establish Carry Baseline', methods:['farmer_carry_40m'] },
  { id:'mobility_assess', capability:'mobility', questType:'assess', developmentalTarget:'Establish Mobility Baseline', methods:['mobility_assessment'] },
  { id:'balance_assess', capability:'balance', questType:'assess', developmentalTarget:'Establish Balance Baseline', methods:['balance_assessment'] },
]);

const EVIDENCE_FIRST_CAPABILITIES = new Set(['squat','cardio','carry','mobility','balance']);

function assessmentTarget(q, state) {
  const name = q.capability[0].toUpperCase() + q.capability.slice(1);
  return state.currentEvidence ? `Re-establish ${name} Baseline` : `Establish ${name} Baseline`;
}

export function generateBodyCandidates(playerState = {}) {
  const states = new Map((playerState.capabilities ?? []).map(x => [x.capability, x]));
  const out = [];
  for (const q of BODY_QUEST_LIBRARY) {
    const state = states.get(q.capability) ?? {};
    if (q.questType === 'assess') {
      const missingOrImportant = !state.currentEvidence || state.informationValue === 'critical' || state.informationValue === 'high';
      if (!missingOrImportant) continue;
      out.push({ ...q, developmentalTarget:assessmentTarget(q,state), possibleMethods:[...q.methods], state });
      continue;
    }
    if (q.questType === 'train' && !state.currentEvidence && EVIDENCE_FIRST_CAPABILITIES.has(q.capability)) {
      // Baseline does not gate play globally, but when PRIME already has a canonical assessment path
      // it must not label an unknown capability as DEVELOP/MAINTAIN. Establish evidence first unless
      // a deliberately foundational training path is explicitly allowed.
      if (!state.foundationalTrainingAllowed) continue;
    }
    out.push({ ...q, possibleMethods:[...q.methods], state });
  }
  return out;
}
