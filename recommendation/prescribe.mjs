import { DOSE_DECISION, latestForCapability } from './models.mjs';

function latestAdaptation(history, capability) {
  return history.filter(x => x.capability === capability).sort((a,b) => new Date(b.timestamp)-new Date(a.timestamp))[0] ?? null;
}

export function prescribe(candidate, { trainingHistory = [], adaptationHistory = [] } = {}) {
  const state = candidate.state ?? {};
  const training = latestForCapability(trainingHistory, candidate.capability);
  const adaptation = latestAdaptation(adaptationHistory, candidate.capability);

  let doseDecision = DOSE_DECISION.CONSOLIDATE;
  let intent = candidate.questType === 'assess' ? 'assess' : (state.need === 'maintenance' ? 'maintain' : 'develop');

  if (candidate.requiresReestablish || candidate.questType === 'assess') doseDecision = DOSE_DECISION.RE_ESTABLISH;
  else if (candidate.filterStatus === 'modify') doseDecision = DOSE_DECISION.MODIFY;
  else if (adaptation?.limitation === 'significant') doseDecision = DOSE_DECISION.MODIFY;
  else if (training?.objectivePerformance?.completed === false) doseDecision = DOSE_DECISION.CONSOLIDATE;
  else if (adaptation?.effort === 'easy' && adaptation?.limitation === 'none' && adaptation?.capacityRemaining === 'more') doseDecision = DOSE_DECISION.PROGRESS;
  else if (adaptation?.effort === 'hard' && adaptation?.limitation === 'none' && adaptation?.capacityRemaining === 'empty') doseDecision = DOSE_DECISION.CONSOLIDATE;

  const method = candidate.validMethods?.[0] ?? candidate.possibleMethods?.[0] ?? null;
  const dose = candidate.questType === 'assess'
    ? { type:'standardized_assessment', inventedLoad:false }
    : { type:'derive_from_training_history', anchorEvidence:state.currentEvidence?.id ?? null, trajectoryEvent:training?.id ?? null, inventedLoad:false };

  const evidenceAction = candidate.questType === 'assess' ? (state.currentEvidence ? 're_establish' : 'establish') : null;

  return {
    target:candidate.developmentalTarget,
    capability:candidate.capability,
    questType:candidate.questType,
    method,
    dose,
    intent,
    successCondition:candidate.questType === 'assess' ? 'Capture valid standardized evidence' : 'Complete the prescribed valid dose and record Adaptation',
    doseDecision,
    cardioRole:candidate.cardioRole ?? null,
    evidenceAction,
  };
}
