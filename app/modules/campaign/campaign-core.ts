import { Character } from '../character/character-core';
import { Encounter } from '../encounter/encounter-generator';
import { NarrativeGenerator, EncounterNarrative } from '../utils/narrative-generator';
import { CampaignProgressionSystem } from './campaign-progression';
import { CampaignAnalytics } from './campaign-analytics';

export interface Campaign {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  characters: Character[];
  encounters: Encounter[];
  narrativeContext: {
    overarchingStory: string;
    majorPlotPoints: string[];
    currentChapter: number;
  };
  progressionData: {
    averagePartyLevel: number;
    totalExperiencePoints: number;
    completedEncounters: number;
  };
}

export class CampaignManager {
  private progressionSystem: CampaignProgressionSystem;
  private analyticsSystem: CampaignAnalytics;

  constructor() {
    this.progressionSystem = new CampaignProgressionSystem();
    this.analyticsSystem = new CampaignAnalytics();
  }

  createCampaign(campaignData: Omit<Campaign, 'id' | 'createdAt' | 'progressionData'>): Campaign {
    const baseProgressionData = {
      averagePartyLevel: campaignData.characters.reduce((sum, char) => sum + char.level, 0) / campaignData.characters.length,
      totalExperiencePoints: 0,
      completedEncounters: 0
    };

    return {
      id: crypto.randomUUID(),
      ...campaignData,
      createdAt: new Date(),
      progressionData: baseProgressionData
    };
  }

  generateCampaignNarrative(campaign: Campaign): EncounterNarrative {
    return NarrativeGenerator.generateNarrative({
      terrain: 'mixed',
      environmentalFactors: ['dynamic'],
      monsters: campaign.encounters.flatMap(e => e.monsters),
      characters: campaign.characters
    });
  }

  analyzeCampaignProgression(campaign: Campaign) {
    return this.progressionSystem.analyzeCampaignTrajectory(campaign);
  }

  generateCampaignInsights(campaign: Campaign) {
    return this.analyticsSystem.generateComprehensiveCampaignReport(campaign);
  }
}
