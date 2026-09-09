export const CAPABILITIES = ['push','pull','squat','carry','cardio','mobility','balance'];
export const FILTER_STATUS = Object.freeze({ PASS:'pass', MODIFY:'modify', BLOCK:'block' });
export const DOSE_DECISION = Object.freeze({
  PROGRESS:'progress', CONSOLIDATE:'consolidate', MODIFY:'modify', REGRESS:'regress', RE_ESTABLISH:'re_establish'
});
export const BOSS_STATE = Object.freeze({ WAITING:'waiting', AVAILABLE:'rematch_available', RECOMMENDED:'rematch_recommended' });
export const CARDIO_ROLE = Object.freeze({ PRIMARY:'primary', COMPANION:'companion', ACTIVE_RECOVERY:'active_recovery' });
export const QUEST_SOURCE = Object.freeze({ PRIME_RECOMMENDED:'prime_recommended', PRIME_ALTERNATIVE:'prime_ranked_alternative', PLAYER_BROWSE:'player_browse' });

export function clone(value) { return JSON.parse(JSON.stringify(value)); }
export function byCapability(list, capability) { return list?.find(x => x.capability === capability) ?? null; }
export function latestForCapability(list = [], capability) {
  return list.filter(x => x.capabilityTargets?.includes(capability) || x.capability === capability)
    .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))[0] ?? null;
}
