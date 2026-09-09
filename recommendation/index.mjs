import { generateBodyCandidates } from './questLibrary.mjs';
import { runFilter } from './filter.mjs';
import { prioritize } from './prioritize.mjs';
import { prescribe } from './prescribe.mjs';
import { bossCheck } from './bossCheck.mjs';
import { choose } from './choose.mjs';
import { buildCardioLayer } from './cardioLayers.mjs';

export const RECOMMENDATION_ENGINE_VERSION = '0.1.1';
export const RECOMMENDATION_SPEC_STATUS = 'WORKING_IMPLEMENTATION';

export function generateBodyRecommendation({ playerState = {}, trainingHistory = [], adaptationHistory = [], currentContext = {} } = {}) {
  const context = {
    ...currentContext,
    activeLimitations:(playerState.constraints ?? []).filter(c => c.lifecycle !== 'cleared').map(c => ({ capability:c.scope === 'capability' ? c.target : null, severity:c.severity }))
  };
  const inputs = { playerState, trainingHistory, adaptationHistory, context };
  const candidates = generateBodyCandidates(playerState);
  const filtered = runFilter(candidates, inputs);
  const eligible = filtered.filter(c => c.eligible);
  const ranked = prioritize(eligible, inputs);
  const prescriptions = new Map(ranked.map(c => [c.id, prescribe(c, inputs)]));
  const bossStates = (playerState.capabilities ?? []).map(c => bossCheck(c, inputs)).filter(Boolean);
  const choiceSet = choose({ rankedCandidates:ranked, prescriptions, bossStates });
  const cardioLayer = buildCardioLayer({ choiceSet, playerState, context });

  return {
    engineVersion:RECOMMENDATION_ENGINE_VERSION,
    actionPhase:'choose',
    generatedAt:new Date().toISOString(),
    filter:filtered.map(c => ({ id:c.id, capability:c.capability, status:c.filterStatus, eligible:c.eligible, reasons:c.filterReasons, validMethods:c.validMethods })),
    prioritize:ranked.map(c => ({ id:c.id, capability:c.capability, rank:c.priorityRank, signals:c.signals, reasonCodes:c.reasonCodes })),
    prescriptions:Object.fromEntries([...prescriptions.entries()]),
    bossStates,
    cardioLayer,
    ...choiceSet,
  };
}
