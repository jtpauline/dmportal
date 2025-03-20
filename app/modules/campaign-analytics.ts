import { Campaign, CampaignType, CampaignAlignment } from './campaigns';
import { Character } from './characters';
import { Encounter } from './encounters';

export interface CampaignAnalytics {
  partyComposition: {
    totalCharacters: number;
    averageLevel: number;
    classDistribution: { [className: string]: number };
    alignmentDistribution: { [alignment: string]: number };
  };
  campaignCharacteristics: {
    campaignType: CampaignType;
    campaignAlignment: CampaignAlignment;
    magicalAbundance: 'low' | 'moderate' | 'high' | 'magical dominant';
  };
  encounterAnalytics: {
    totalEncounters: number;
    encounterTypeDistribution: { [type: string]: number };
    averageChallengeRating: number;
  };
  progressTracking: {
    currentAverageLevel: number;
    xpProgress: {
      totalXPEarned: number;
      nextLevelXP: number;
    };
    sessionsPlayed: number;
  };
  riskAssessment: {
    partyVulnerability: number;
    encounterDifficulty: number;
  };
}

export class CampaignAnalyzer {
  analyzeCampaign(campaign: Campaign): CampaignAnalytics {
    return {
      partyComposition: this.analyzePartyComposition(campaign.characters),
      campaignCharacteristics: {
        campaignType: campaign.setting.type,
        campaignAlignment: campaign.alignment,
        magicalAbundance: campaign.setting.magicalAbundance
      },
      encounterAnalytics: this.analyzeEncounters(campaign.encounters),
      progressTracking: this.trackCampaignProgress(campaign),
      riskAssessment: this.assessCampaignRisk(campaign)
    };
  }

  private analyzePartyComposition(characters: Character[]): CampaignAnalytics['partyComposition'] {
    const classDistribution = characters.reduce((dist, char) => {
      char.classes.forEach(cls => {
        dist[cls.name] = (dist[cls.name] || 0) + 1;
      });
      return dist;
    }, {});

    const alignmentDistribution = characters.reduce((dist, char) => {
      dist[char.alignment] = (dist[char.alignment] || 0) + 1;
      return dist;
    }, {});

    return {
      totalCharacters: characters.length,
      averageLevel: characters.reduce((sum, char) => sum + char.level, 0) / characters.length,
      classDistribution,
      alignmentDistribution
    };
  }

  private analyzeEncounters(encounters: Encounter[]): CampaignAnalytics['encounterAnalytics'] {
    const encounterTypeDistribution = encounters.reduce((dist, encounter) => {
      dist[encounter.type] = (dist[encounter.type] || 0) + 1;
      return dist;
    }, {});

    return {
      totalEncounters: encounters.length,
      encounterTypeDistribution,
      averageChallengeRating: encounters.reduce((sum, enc) => sum + enc.challengeRating, 0) / encounters.length
    };
  }

  private trackCampaignProgress(campaign: Campaign): CampaignAnalytics['progressTracking'] {
    const currentAverageLevel = campaign.metadata.averagePartyLevel;
    const nextLevelXP = campaign.xpTracker.xpThresholds[currentAverageLevel + 1] || 0;

    return {
      currentAverageLevel,
      xpProgress: {
        totalXPEarned: campaign.xpTracker.totalXP,
        nextLevelXP
      },
      sessionsPlayed: campaign.metadata.sessionsPlayed
    };
  }

  private assessCampaignRisk(campaign: Campaign): CampaignAnalytics['riskAssessment'] {
    const partyVulnerability = campaign.characters.reduce((vulnerability, char) => {
      const levelFactor = char.level / 20;
      const hpFactor = char.hitPoints / 100;
      return vulnerability + (1 - (levelFactor * hpFactor));
    }, 0) / campaign.characters.length;

    const encounterDifficulty = campaign.encounters.reduce((sum, enc) => sum + enc.challengeRating, 0) / campaign.encounters.length;

    return {
      partyVulnerability,
      encounterDifficulty
    };
  }
}
