import { clone, ASSESSMENT_IDS, canonicalBossMetric } from '../state.mjs';

// Assignment #004: this module has no UI or persistence side effects. Call only after
// a canonical, completed assessment has produced verified computed evidence.
const VERDICTS = Object.freeze({ better:'BOSS_DEFEATED', equal:'STALEMATE', worse:'BOSS_SURVIVES' });

export function recordBossAttempt(state, {
  capability, rawResult, computedEvidence, currentResult, direction = 'higher',
  source, timestamp = new Date().toISOString(), attemptId,
} = {}) {
  if (!state || typeof state !== 'object') throw new Error('Player state required');
  if (!ASSESSMENT_IDS.includes(capability)) throw new Error('Unknown Boss capability');
  if (!['prime_recommended', 'player_initiated'].includes(source)) throw new Error('Boss provenance required');
  if (!['higher', 'lower'].includes(direction)) throw new Error('Unsupported Boss direction');
  if (!Number.isFinite(Date.parse(timestamp))) throw new Error('Invalid Boss timestamp');
  if (!rawResult || typeof rawResult !== 'object' || !computedEvidence || typeof computedEvidence !== 'object') throw new Error('Verified canonical assessment required');
  if (typeof computedEvidence.verified === 'boolean' && !computedEvidence.verified) throw new Error('Unverified result');
  const previous = state.bosses?.[capability];
  if (!previous || !Number.isFinite(previous.undefeatedBossTarget)) throw new Error('Verified undefeated Boss target required');
  const canonicalResult=canonicalBossMetric(capability,rawResult,computedEvidence);
  if (!Number.isFinite(currentResult)) currentResult=canonicalResult;
  if (!Number.isFinite(currentResult)||currentResult!==canonicalResult) throw new Error('Comparable standardized Boss result required');
  const id = attemptId ?? `boss-${capability}-${timestamp}`;
  if (typeof id !== 'string' || !id.trim()) throw new Error('Boss attempt ID required');
  if (state.bossHistory?.some(x => x.id === id) || state.assessmentHistory?.some(x => x.id === id)) throw new Error('Duplicate Boss attempt');
  const priorTarget = previous.undefeatedBossTarget;
  const priorCurrent = previous.currentVerifiedResult;
  const better = direction === 'higher' ? currentResult > priorTarget : currentResult < priorTarget;
  const verdict = better ? VERDICTS.better : currentResult === priorTarget ? VERDICTS.equal : VERDICTS.worse;
  const snapshot = {
    id, timestamp, capability, verified:true, source:'boss_attempt', initiation:source,
    verdict, direction, previousVerifiedResult:priorCurrent ?? null,
    priorBossTarget:priorTarget, currentResult, undefeatedBossTarget:better?currentResult:priorTarget,
    raw:clone(rawResult), evidence:clone(computedEvidence),
  };
  // Prepare the complete next state before mutating the caller's state.
  const nextTests = {...clone(state.tests ?? {}), [capability]:clone(rawResult)};
  const nextBoss = {...clone(previous),currentVerifiedResult:currentResult,
    undefeatedBossTarget:snapshot.undefeatedBossTarget,developmentalReadiness:false,
    todayReadiness:null,lastAttemptAt:timestamp,cycleStartedAt:timestamp,
    readinessEstablishedAt:null,readinessEvidence:[],lastVerdict:verdict};
  const nextBosses = {...clone(state.bosses ?? {}),[capability]:nextBoss};
  const nextBossHistory = [...clone(state.bossHistory ?? []),clone(snapshot)];
  const nextAssessmentHistory = [...clone(state.assessmentHistory ?? []),clone(snapshot)];
  state.tests = nextTests;
  state.bosses = nextBosses;
  state.bossHistory = nextBossHistory;
  state.assessmentHistory = nextAssessmentHistory;
  if (state.assessmentDrafts) delete state.assessmentDrafts[capability];
  return clone(snapshot);
}
