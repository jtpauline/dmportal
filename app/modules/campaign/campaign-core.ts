import { Character } from '../character/character-core';
import { Encounter } from '../encounter/encounter-generator';
import { NarrativeGenerator, EncounterNarrative } from '../utils/narrative-generator';
import { CampaignProgressionSystem } from './campaign-progression';
import { CampaignAnalytics } from './campaign-analytics';
import { IdGenerator } from '../utils/id-generator';

// Persistent storage for campaigns
const CAMPAIGN_STORAGE: { [key: string]: Campaign } = {};

export interface Campaign {
  id: string;
  name: string;
  description: string;
  createdAt: string | Date; // Allow both string and Date
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
    // Use custom ID generator with 'campaign' prefix
    const campaignId = IdGenerator.generatePrefixedId('campaign');
    
    const baseProgressionData = {
      averagePartyLevel: campaignData.characters.length > 0 
        ? campaignData.characters.reduce((sum, char) => sum + char.level, 0) / campaignData.characters.length 
        : 1,
      totalExperiencePoints: 0,
      completedEncounters: 0
    };

    const newCampaign: Campaign = {
      id: campaignId,
      ...campaignData,
      createdAt: new Date().toISOString(), // Convert to ISO string for consistent storage
      progressionData: baseProgressionData
    };

    // Store campaign in persistent storage
    CAMPAIGN_STORAGE[campaignId] = newCampaign;

    return newCampaign;
  }

  // Async method to fetch campaign by ID
  async fetchCampaignById(campaignId: string): Promise<Campaign | undefined> {
    console.log("Fetching campaign with ID:", campaignId);
    console.log("Available campaigns:", Object.keys(CAMPAIGN_STORAGE));
    
    const campaign = CAMPAIGN_STORAGE[campaignId];
    
    if (!campaign) {
      console.error(`Campaign with ID ${campaignId} not found`);
    }
    
    return campaign;
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

  // Utility method to list all campaigns
  listCampaigns(): Campaign[] {
    return Object.values(CAMPAIGN_STORAGE);
  }
}
