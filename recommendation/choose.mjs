import { QUEST_SOURCE, BOSS_STATE } from './models.mjs';

export function choose({ rankedCandidates = [], prescriptions = new Map(), bossStates = [] } = {}) {
  const recommendedBoss = bossStates.find(b => b?.state === BOSS_STATE.RECOMMENDED);
  if (recommendedBoss) {
    const normal = rankedCandidates.slice(0,2).map((c,i) => ({
      source:QUEST_SOURCE.PRIME_ALTERNATIVE,
      quest:prescriptions.get(c.id), reasons:c.reasonCodes, rank:i+1
    }));
    return {
      recommended:{ source:QUEST_SOURCE.PRIME_RECOMMENDED, type:'boss', boss:recommendedBoss, reasons:[`${recommendedBoss.capability.toUpperCase()}_BOSS_REMATCH_RECOMMENDED`] },
      alternatives:normal,
      browseAvailable:true,
    };
  }

  const [top,...rest] = rankedCandidates;
  if (!top) return { recommended:null, alternatives:[], browseAvailable:true, noRecommendationReason:'NO_APPROPRIATE_BODY_QUEST' };
  return {
    recommended:{ source:QUEST_SOURCE.PRIME_RECOMMENDED, type:'quest', quest:prescriptions.get(top.id), reasons:top.reasonCodes, candidateId:top.id },
    alternatives:rest.slice(0,2).map(c => ({ source:QUEST_SOURCE.PRIME_ALTERNATIVE, type:'quest', quest:prescriptions.get(c.id), reasons:c.reasonCodes, candidateId:c.id })),
    browseAvailable:true,
  };
}
