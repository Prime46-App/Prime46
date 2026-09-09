/**
 * PRIME 46 — BODY / THE VESSEL scoring engine v0.1
 * Implements locked v1.0 BODY scoring rules only.
 * No XP economy, quests, or UI behavior is invented here.
 */

export const ENGINE_VERSION = '0.1.0';
export const VESSEL_SPEC_VERSION = '1.0';

export const TIERS = [
  { min: 0,  max: 19,  name: 'FOUNDATION' },
  { min: 20, max: 39,  name: 'DEVELOPING' },
  { min: 40, max: 59,  name: 'CAPABLE' },
  { min: 60, max: 79,  name: 'STRONG' },
  { min: 80, max: 89,  name: 'ADVANCED' },
  { min: 90, max: 100, name: 'ELITE' },
];

export const EVIDENCE = {
  push: { grade: 'A', basis: 'Normative' },
  pull: { grade: 'B', basis: 'Criterion' },
  cardio: { grade: 'A', basis: 'Normative' },
  squat: { grade: 'B', basis: 'Criterion' },
  carry: { grade: 'C', basis: 'PRIME Criterion' },
  mobility: { grade: 'CLASSIFICATION', basis: 'Movement screen' },
  balance: { grade: 'B', basis: 'Normative/criterion hybrid' },
};

const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));
const round1 = n => Math.round(n * 10) / 10;

export function tierFor(score) {
  if (score == null || Number.isNaN(score)) return null;
  const s = clamp(score);
  return TIERS.find(t => s >= t.min && s <= t.max)?.name ?? null;
}

/** Piecewise-linear interpolation through sorted [x, score] anchors. */
export function interpolate(x, anchors) {
  if (!Number.isFinite(x)) throw new TypeError('x must be finite');
  if (x <= anchors[0][0]) {
    if (anchors[0][0] === 0) return clamp(anchors[0][1]);
    return clamp((x / anchors[0][0]) * anchors[0][1]);
  }
  for (let i = 1; i < anchors.length; i++) {
    const [x1, y1] = anchors[i - 1];
    const [x2, y2] = anchors[i];
    if (x <= x2) {
      const p = (x - x1) / (x2 - x1);
      return clamp(y1 + p * (y2 - y1));
    }
  }
  return clamp(anchors.at(-1)[1]);
}

// LOCKED v0.1 benchmark anchors
export const CURVES = {
  push: [[0,0],[10,20],[17,40],[21,50],[24,60],[26,70],[30,80],[34,85],[36,90],[40,95],[65,100]],
  pull: [[0,0],[1,15],[2,25],[3,35],[4,40],[5,44],[6,48],[7,52],[8,56],[9,60],[10,64],[11,68],[12,72],[13,76],[14,80],[15,84],[16,88],[17,92],[18,96],[19,100]],
  cardioVo2: [[24.2,5],[26.8,10],[31.9,25],[37.8,50],[45.0,75],[52.1,90],[55.6,95]],
  squatRatio: [[0,0],[0.5,10],[0.75,20],[1.0,40],[1.25,50],[1.5,60],[1.75,70],[2.0,80],[2.25,85],[2.5,90],[2.75,95],[3.0,100]],
  carryRatio: [[0,0],[0.25,20],[0.5,40],[0.75,60],[1.0,80],[1.25,90],[1.5,100]],
  balanceSeconds: [[0,0],[10,20],[20,40],[30,60],[40,80],[50,90],[60,100]],
};

function result(metric, raw, score, extra = {}) {
  const s = round1(clamp(score));
  return {
    metric,
    raw,
    score: s,
    tier: tierFor(s),
    evidence: EVIDENCE[metric],
    ...extra,
  };
}

export function scorePush(reps) {
  return result('push', { reps }, interpolate(reps, CURVES.push));
}

export function scorePull(reps) {
  return result('pull', { reps }, interpolate(reps, CURVES.pull), {
    peerPercentileAvailable: false,
  });
}

export function scoreCardioVo2(vo2) {
  return result('cardio', { vo2 }, interpolate(vo2, CURVES.cardioVo2), {
    peerPercentileApprox: round1(interpolate(vo2, CURVES.cardioVo2)),
  });
}

export function scoreSquat({ oneRmLb, bodyweightLb, estimated = false }) {
  if (!(bodyweightLb > 0) || !(oneRmLb >= 0)) throw new RangeError('Valid bodyweightLb and oneRmLb required');
  const ratio = oneRmLb / bodyweightLb;
  return result('squat', { oneRmLb, bodyweightLb, ratio: round1(ratio * 100) / 100, estimated }, interpolate(ratio, CURVES.squatRatio), {
    measurement: estimated ? 'ESTIMATED_1RM' : 'MEASURED_1RM',
    peerPercentileAvailable: false,
  });
}

export function scoreCarry({ totalLoadLb, bodyweightLb, distanceM = 40, completed = true, timeSec = null }) {
  if (!(bodyweightLb > 0) || !(totalLoadLb >= 0)) throw new RangeError('Valid bodyweightLb and totalLoadLb required');
  const ratio = totalLoadLb / bodyweightLb;
  const validCanonicalAttempt = completed && distanceM >= 40;
  const score = validCanonicalAttempt ? interpolate(ratio, CURVES.carryRatio) : 0;
  return result('carry', { totalLoadLb, bodyweightLb, ratio: round1(ratio * 100) / 100, distanceM, completed, timeSec }, score, {
    canonicalAttempt: validCanonicalAttempt,
    peerPercentileAvailable: false,
  });
}

export function classifyMobility({ deepSquat, overheadReach }) {
  const allowed = new Set(['LIMITED','FUNCTIONAL','PROFICIENT']);
  if (!allowed.has(deepSquat) || !allowed.has(overheadReach)) {
    throw new TypeError('Mobility screens must be LIMITED, FUNCTIONAL, or PROFICIENT');
  }
  const rank = { LIMITED: 0, FUNCTIONAL: 1, PROFICIENT: 2 };
  const classification = rank[deepSquat] <= rank[overheadReach] ? deepSquat : overheadReach;
  return {
    metric: 'mobility',
    classification,
    screens: { deepSquat, overheadReach },
    numericalScore: null,
    evidence: EVIDENCE.mobility,
  };
}

export function scoreBalance({ leftSec, rightSec }) {
  const left = Math.min(60, Math.max(0, leftSec));
  const right = Math.min(60, Math.max(0, rightSec));
  const leftScore = interpolate(left, CURVES.balanceSeconds);
  const rightScore = interpolate(right, CURVES.balanceSeconds);
  const weaker = Math.min(leftScore, rightScore);
  const stronger = Math.max(leftScore, rightScore);
  const overall = weaker * 0.70 + stronger * 0.30;
  const bestSec = Math.max(left, right);
  const worstSec = Math.min(left, right);
  const asymmetryPct = bestSec === 0 ? 0 : ((bestSec - worstSec) / bestSec) * 100;
  return result('balance', {
    leftSec: round1(left), rightSec: round1(right), bestSec: round1(bestSec), weakSec: round1(worstSec), asymmetryPct: round1(asymmetryPct)
  }, overall, {
    sideScores: { left: round1(leftScore), right: round1(rightScore) },
  });
}

/**
 * LOCKED mastery gates:
 * - STRONG requires every component >=40
 * - ADVANCED requires every component >=60
 * - ELITE requires every component >=80
 */
export function applyMasteryGates(rawScore, componentScores) {
  const vals = componentScores.filter(Number.isFinite);
  if (!vals.length) return null;
  const min = Math.min(...vals);
  let cap = 100;
  let gate = null;
  if (min < 40) { cap = 59; gate = { blockedTier: 'STRONG', requirement: 40 }; }
  else if (min < 60) { cap = 79; gate = { blockedTier: 'ADVANCED', requirement: 60 }; }
  else if (min < 80) { cap = 89; gate = { blockedTier: 'ELITE', requirement: 80 }; }
  const score = round1(Math.min(rawScore, cap));
  return { rawScore: round1(rawScore), score, tier: tierFor(score), minComponent: round1(min), gate };
}

export function calculateStrength({ push, pull, squat, carry }) {
  const components = { push, pull, squat, carry };
  const vals = Object.values(components).map(v => v?.score).filter(Number.isFinite);
  if (vals.length !== 4) return { status: 'UNRANKED', reason: 'Push, Pull, Squat, and Carry are all required', components };
  const raw = vals.reduce((a,b) => a+b,0) / vals.length;
  return { status: 'RANKED', ...applyMasteryGates(raw, vals), components };
}

export function calculateEndurance({ cardio }) {
  if (!Number.isFinite(cardio?.score)) return { status: 'UNRANKED', reason: 'Cardio assessment required', workCapacity: 'LOCKED' };
  return { status: 'RANKED', score: cardio.score, rawScore: cardio.score, tier: cardio.tier, cardio, workCapacity: 'LOCKED' };
}

export function calculateMovement({ balance, mobility }) {
  if (!Number.isFinite(balance?.score) || !mobility?.classification) {
    return { status: 'UNRANKED', reason: 'Balance and Mobility assessments required', bodyControl: 'LOCKED' };
  }
  const capByMobility = { LIMITED: 39, FUNCTIONAL: 79, PROFICIENT: 100 }[mobility.classification];
  const score = round1(Math.min(balance.score, capByMobility));
  return {
    status: 'RANKED', rawScore: balance.score, score, tier: tierFor(score),
    balance, mobility, mobilityGate: score < balance.score ? { classification: mobility.classification, cap: capByMobility } : null,
    bodyControl: 'LOCKED'
  };
}

export function calculateVessel({ strength, endurance, movement }) {
  const domains = { strength, endurance, movement };
  const vals = Object.values(domains).map(v => v?.score).filter(Number.isFinite);
  if (vals.length !== 3) return { status: 'UNRANKED', reason: 'Strength, Endurance, and Movement must all be ranked', domains };
  const raw = vals.reduce((a,b) => a+b,0) / 3;
  return { status: 'RANKED', ...applyMasteryGates(raw, vals), domains };
}

export function bossFight({ previous, current, direction = 'higher' }) {
  if (!Number.isFinite(previous) || !Number.isFinite(current) || previous < 0 || current < 0) throw new RangeError('Valid previous/current required');
  let outcome;
  if (current === previous) outcome = 'STALEMATE';
  else if ((direction === 'higher' && current > previous) || (direction === 'lower' && current < previous)) outcome = 'BOSS_DEFEATED';
  else outcome = 'BOSS_SURVIVES';

  let improvementPct = null;
  if (previous > 0) {
    improvementPct = direction === 'higher'
      ? ((current - previous) / previous) * 100
      : ((previous - current) / previous) * 100;
  }
  return { previous, current, direction, outcome, improvementPct: improvementPct == null ? null : round1(improvementPct) };
}

export function nextTierTarget(metric, currentValue) {
  const curve = CURVES[metric];
  if (!curve) return null;
  const currentScore = interpolate(currentValue, curve);
  const thresholds = [20,40,60,80,90,100];
  const nextScore = thresholds.find(t => t > currentScore);
  if (!nextScore) return null;
  // Find exact/interpolated x where score reaches nextScore.
  for (let i=1;i<curve.length;i++) {
    const [x1,y1] = curve[i-1], [x2,y2] = curve[i];
    if (nextScore >= y1 && nextScore <= y2 && y2 !== y1) {
      const p = (nextScore-y1)/(y2-y1);
      return { targetScore: nextScore, targetValue: round1(x1+p*(x2-x1)), tier: tierFor(nextScore) };
    }
  }
  return null;
}
