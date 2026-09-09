/**
 * Qualitative PRIORITIZE v0.1.
 * No additive score is produced. Candidates are compared through canon-backed decision rules.
 */
const NEED_ORDER = ['low_current_need','maintenance','advancement','meaningful_need','major_limiter'];
const EVIDENCE_ORDER = ['low_information_value','adequate','valuable_unknown','critical_unknown'];
const BALANCE_ORDER = ['overrepresented','balanced','underexposed','neglected'];
const RECENCY_ORDER = ['very_recent','recent','ready_for_exposure','long_unexposed'];
const rank = (arr, v) => Math.max(0, arr.indexOf(v));

export function deriveSignals(candidate, { playerState = {}, context = {} } = {}) {
  const s = candidate.state ?? {};
  let need = s.need ?? 'maintenance';
  const goal = (playerState.goals ?? []).find(g => g.capability === candidate.capability && g.active !== false);
  if (goal?.priority === 'current_focus' && rank(NEED_ORDER, need) < rank(NEED_ORDER, 'meaningful_need')) need = 'meaningful_need';
  else if (goal?.priority === 'important' && rank(NEED_ORDER, need) < rank(NEED_ORDER, 'advancement')) need = 'advancement';

  let evidence = s.informationValue === 'critical' ? 'critical_unknown'
    : s.informationValue === 'high' ? 'valuable_unknown'
    : s.currentEvidence ? 'adequate' : 'valuable_unknown';
  const balance = s.balance ?? 'balanced';
  let recency = s.recency ?? 'ready_for_exposure';

  // Cardio special-role rule: recency suppression is demand-specific, not capability-wide.
  if (candidate.capability === 'cardio' && candidate.cardioRole && candidate.cardioRole !== 'primary') {
    recency = 'ready_for_exposure';
  }

  return { need, evidence, balance, recency, goalRelevance:goal?.priority ?? null };
}

function isVeryRecent(c) { return c.signals.recency === 'very_recent'; }
function isMajorLimiter(c) { return c.signals.need === 'major_limiter'; }
function isCriticalUnknown(c) { return c.signals.evidence === 'critical_unknown'; }
function isValuableUnknown(c) { return ['critical_unknown','valuable_unknown'].includes(c.signals.evidence); }

export function compareCandidates(a,b) {
  // Rule 1: a currently actionable major limiter usually wins ordinary conflicts.
  if (isMajorLimiter(a) !== isMajorLimiter(b)) {
    const major = isMajorLimiter(a) ? a : b;
    const other = major === a ? b : a;
    // But an important unresolved unknown can outrank a known weakness when information value is critical,
    // especially when the limiter has strong recency suppression or only a constrained path today.
    if (isCriticalUnknown(other) && (isVeryRecent(major) || major.filterStatus === 'modify')) return other === a ? -1 : 1;
    if (!isVeryRecent(major)) return major === a ? -1 : 1;
  }

  // Rule 2: critical information value can outrank ordinary development.
  if (isCriticalUnknown(a) !== isCriticalUnknown(b)) return isCriticalUnknown(a) ? -1 : 1;

  // Rule 3: very recent meaningful exposure suppresses redundant repetition without deleting Need.
  if (isVeryRecent(a) !== isVeryRecent(b)) return isVeryRecent(a) ? 1 : -1;

  // Rule 4: explicit current focus breaks otherwise defensible ties.
  const ag = a.signals.goalRelevance === 'current_focus';
  const bg = b.signals.goalRelevance === 'current_focus';
  if (ag !== bg) return ag ? -1 : 1;

  // Rule 5: stronger developmental Need.
  const nd = rank(NEED_ORDER,b.signals.need) - rank(NEED_ORDER,a.signals.need);
  if (nd) return nd;

  // Rule 6: information value.
  const ed = rank(EVIDENCE_ORDER,b.signals.evidence) - rank(EVIDENCE_ORDER,a.signals.evidence);
  if (ed) return ed;

  // Rule 7: neglected/underexposed raises priority.
  const bd = rank(BALANCE_ORDER,b.signals.balance) - rank(BALANCE_ORDER,a.signals.balance);
  if (bd) return bd;

  // Rule 8: long-unexposed/ready exposure over recent exposure.
  const rd = rank(RECENCY_ORDER,b.signals.recency) - rank(RECENCY_ORDER,a.signals.recency);
  if (rd) return rd;

  // Stable deterministic fallback only; not a developmental weight.
  return a.id.localeCompare(b.id);
}

export function reasonCodes(candidate) {
  const s = candidate.signals;
  const out = [];
  if (s.need === 'major_limiter') out.push(`${candidate.capability.toUpperCase()}_MAJOR_LIMITER`);
  else if (s.need === 'meaningful_need') out.push(`${candidate.capability.toUpperCase()}_MEANINGFUL_NEED`);
  if (s.evidence === 'critical_unknown') out.push(`${candidate.capability.toUpperCase()}_CRITICAL_INFORMATION_VALUE`);
  else if (s.evidence === 'valuable_unknown') out.push(`${candidate.capability.toUpperCase()}_HIGH_INFORMATION_VALUE`);
  if (s.balance === 'neglected') out.push(`${candidate.capability.toUpperCase()}_NEGLECTED`);
  else if (s.balance === 'underexposed') out.push(`${candidate.capability.toUpperCase()}_UNDEREXPOSED`);
  if (s.recency === 'very_recent') out.push(`${candidate.capability.toUpperCase()}_VERY_RECENT`);
  if (s.goalRelevance) out.push(`${candidate.capability.toUpperCase()}_PLAYER_GOAL`);
  if (candidate.filterStatus === 'modify') out.push(`${candidate.capability.toUpperCase()}_MODIFIED_VALID_PATH`);
  return out;
}

export function prioritize(eligible, inputs) {
  const ranked = eligible.map(c => ({ ...c, signals:deriveSignals(c, inputs) })).sort(compareCandidates);
  return ranked.map((c,i) => ({ ...c, priorityRank:i+1, reasonCodes:reasonCodes(c) }));
}
