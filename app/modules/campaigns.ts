import { v4 as uuidv4 } from 'uuid';
import { CampaignStorage } from './campaign-storage';
import { CampaignAnalyzer } from './campaign-analytics';

export enum CampaignStatus {
  PLANNING = 'Planning',
  ACTIVE = 'Active',
  PAUSED = 'Paused',
  COMPLETED = 'Completed',
  ABANDONED = 'Abandoned'
}

export enum CampaignDifficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
  EPIC = 'Epic'
}

export interface Campaign {
  id: string;
  name: string;
  dungeon_master: string;
  status: CampaignStatus;
  difficulty: CampaignDifficulty;
  startDate: Date;
  endDate?: Date;
  characters: string[]; // Character IDs
  encounters: string[]; // Encounter IDs
  notes: CampaignNote[];
  locations: CampaignLocation[];
  settings?: CampaignSettings;
}

export interface CampaignNote {
  id: string;
  title: string;
  content: string;
  date: Date;
  tags?: string[];
}

export interface CampaignLocation {
  id: string;
  name: string;
  description: string;
  type: 'city' | 'dungeon' | 'wilderness' | 'other';
  coordinates?: {
    x: number;
    y: number;
  };
}

export interface CampaignSettings {
  ruleset?: string;
  homebrewRules?: string[];
  sessionFrequency?: 'weekly' | 'biweekly' | 'monthly';
  maxPlayers?: number;
}

export class CampaignManager {
  /**
   * Create a new campaign
   */
  createCampaign(campaignData: Partial<Campaign>): Campaign {
    const newCampaign: Campaign = {
      id: uuidv4(),
      name: campaignData.name || 'Untitled Campaign',
      dungeon_master: campaignData.dungeon_master || 'Unknown DM',
      status: campaignData.status || CampaignStatus.PLANNING,
      difficulty: campaignData.difficulty || CampaignDifficulty.MEDIUM,
      startDate: new Date(),
      characters: [],
      encounters: [],
      notes: [],
      locations: [],
      settings: campaignData.settings
    };

    CampaignStorage.saveCampaign(newCampaign);
    return newCampaign;
  }

  // ... rest of the code remains the same
}
