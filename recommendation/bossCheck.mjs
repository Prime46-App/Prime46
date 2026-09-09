import { BOSS_STATE } from './models.mjs';

export function bossCheck(capabilityState, { context = {}, adaptationHistory = [] } = {}) {
  const boss = capabilityState?.currentBoss;
  if (!boss) return null;
  const developmentalReadiness = boss.developmentalReadiness === true;
  let todayReadiness = boss.todayReadiness !== false;

  const significant = (context.activeLimitations ?? []).some(x => x.capability === capabilityState.capability && x.severity === 'significant');
  const latestAdapt = adaptationHistory.filter(x => x.capability === capabilityState.capability).sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp))[0];
  if (significant || (latestAdapt?.effort === 'hard' && latestAdapt?.capacityRemaining === 'empty' && latestAdapt?.recent === true)) todayReadiness = false;

  let state = BOSS_STATE.WAITING;
  if (developmentalReadiness && todayReadiness) state = BOSS_STATE.RECOMMENDED;
  else if (developmentalReadiness) state = BOSS_STATE.AVAILABLE;

  return {
    capability:capabilityState.capability,
    state,
    developmentalReadiness,
    todayReadiness,
    undefeatedBossTarget:boss.undefeatedBossTarget,
    currentVerifiedResult:boss.currentVerifiedResult,
  };
}

export function evaluateBossResult({ direction='higher', undefeatedBossTarget, currentResult }) {
  const better = direction === 'higher' ? currentResult > undefeatedBossTarget : currentResult < undefeatedBossTarget;
  const equal = currentResult === undefeatedBossTarget;
  return {
    verdict: better ? 'boss_defeated' : equal ? 'stalemate' : 'boss_survives',
    newCurrentVerifiedResult: currentResult,
    newUndefeatedBossTarget: better ? currentResult : undefeatedBossTarget,
    resetReadinessEvidence:true,
  };
}
