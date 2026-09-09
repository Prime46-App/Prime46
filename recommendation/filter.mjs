import { FILTER_STATUS } from './models.mjs';

function matchingConstraints(candidate, constraints = []) {
  return constraints.filter(c => c.lifecycle !== 'cleared' && (
    (c.scope === 'capability' && c.target === candidate.capability) ||
    (c.scope === 'method' && candidate.possibleMethods?.includes(c.target)) ||
    (c.scope === 'domain' && c.target === 'body')
  ));
}

function availableMethods(candidate, constraints = [], context = {}) {
  const blockedMethods = new Set(constraints.filter(c => c.lifecycle !== 'cleared' && c.scope === 'method' && c.severity === 'significant').map(c => c.target));
  let methods = (candidate.possibleMethods ?? []).filter(m => !blockedMethods.has(m));
  if (context.availableMethods?.length) methods = methods.filter(m => context.availableMethods.includes(m));
  if (context.unavailableMethods?.length) methods = methods.filter(m => !context.unavailableMethods.includes(m));
  return methods;
}

export function filterCandidate(candidate, { playerState = {}, context = {}, trainingHistory = [], adaptationHistory = [] } = {}) {
  const constraints = matchingConstraints(candidate, playerState.constraints ?? []);
  const significantCapability = constraints.find(c => c.scope !== 'method' && c.severity === 'significant' && c.lifecycle === 'active');
  const methods = availableMethods(candidate, constraints, context);
  const reasons = [];

  if (significantCapability) {
    // A capability-level significant limitation blocks the target unless canonically marked as modifiable.
    if (!significantCapability.allowModifiedReturn) {
      return { ...candidate, filterStatus:FILTER_STATUS.BLOCK, eligible:false, validMethods:[], filterReasons:['SIGNIFICANT_LIMITATION'] };
    }
    if (!methods.length) {
      return { ...candidate, filterStatus:FILTER_STATUS.BLOCK, eligible:false, validMethods:[], filterReasons:['SIGNIFICANT_LIMITATION','NO_SAFE_METHOD'] };
    }
    reasons.push('SIGNIFICANT_LIMITATION_REQUIRES_MODIFICATION');
  }

  if (!methods.length) {
    return { ...candidate, filterStatus:FILTER_STATUS.BLOCK, eligible:false, validMethods:[], filterReasons:['OPPORTUNITY_METHOD_UNAVAILABLE'] };
  }

  const minutesNeeded = candidate.minimumMinutes ?? 0;
  if (context.availableMinutes != null && minutesNeeded > context.availableMinutes) {
    return { ...candidate, filterStatus:FILTER_STATUS.BLOCK, eligible:false, validMethods:methods, filterReasons:['INSUFFICIENT_TIME'] };
  }

  // Evidence/entry gate: keep play open, but convert unsupported specific training into re-establishment.
  const state = candidate.state ?? {};
  let requiresReestablish = false;
  if (candidate.questType === 'train' && !state.currentEvidence && !state.foundationalTrainingAllowed) {
    requiresReestablish = true;
    reasons.push('INSUFFICIENT_EVIDENCE_REESTABLISH');
  }

  // Current appropriateness: only suppress redundant high-demand cardio, never cardio participation as a whole.
  if (candidate.capability === 'cardio' && candidate.cardioRole === 'primary' && context.suppressHighDemandCardioToday && candidate.questType === 'train') {
    reasons.push('RECENT_HIGH_DEMAND_CARDIO');
  }

  const modified = reasons.length > 0 || methods.length !== (candidate.possibleMethods ?? []).length || requiresReestablish;
  return {
    ...candidate,
    filterStatus: modified ? FILTER_STATUS.MODIFY : FILTER_STATUS.PASS,
    eligible:true,
    validMethods:methods,
    requiresReestablish,
    filterReasons:reasons,
  };
}

export function runFilter(candidates, inputs) {
  return candidates.map(c => filterCandidate(c, inputs));
}
