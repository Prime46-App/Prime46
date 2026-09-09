import { CARDIO_ROLE } from './models.mjs';

/**
 * Cardio is special: it may support a non-Cardio primary Quest without competing for the main CHOOSE slot.
 * No duration/intensity number is invented here; the layer describes role and prescription boundary only.
 */
export function buildCardioLayer({ choiceSet, playerState = {}, context = {} } = {}) {
  const primaryCapability = choiceSet?.recommended?.quest?.capability ?? choiceSet?.recommended?.boss?.capability ?? null;
  if (!choiceSet?.recommended || primaryCapability === 'cardio' || context.cardioAllowed === false) return null;

  const hasSorenessOrStiffness = Boolean(context.muscleSoreness || context.stiffness || context.activeRecoveryRequested);
  const cardioGoal = (playerState.goals ?? []).some(g => g.capability === 'cardio' && g.active !== false);
  const companionRequested = context.cardioCompanion === true || cardioGoal;

  if (hasSorenessOrStiffness) {
    return {
      capability:'cardio',
      role:CARDIO_ROLE.ACTIVE_RECOVERY,
      intent:'recover',
      demand:'light',
      dose:{ type:'light_active_recovery', inventedDuration:false, inventedIntensity:false },
      developmentalExposure:false,
      reasonCodes:['CARDIO_ACTIVE_RECOVERY','CARDIO_RECENCY_NOT_BLANKET_SUPPRESSION'],
    };
  }

  if (companionRequested) {
    return {
      capability:'cardio',
      role:CARDIO_ROLE.COMPANION,
      intent:'support',
      demand:context.cardioCompanionDemand ?? 'low_to_moderate',
      dose:{ type:'companion_cardio', inventedDuration:false, inventedIntensity:false },
      developmentalExposure: context.cardioCompanionMeaningfulDevelopment === true,
      reasonCodes:['CARDIO_COMPANION_LAYER','CARDIO_RECENCY_NOT_BLANKET_SUPPRESSION'],
    };
  }
  return null;
}
