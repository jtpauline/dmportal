import { v4 as uuidv4 } from 'uuid';
import { CampaignStorage } from './campaign-storage';
import { CampaignAnalyzer } from './campaign-analytics';
import { Character } from './characters';
import { Encounter } from './encounters';

// D&D 3.5 Specific Campaign Enums
export enum CampaignType {
  DUNGEON_CRAWL = 'Dungeon Crawl',
  WILDERNESS_ADVENTURE = 'Wilderness Adventure',
  URBAN_CAMPAIGN = 'Urban Campaign',
  PLANAR_ADVENTURE = 'Planar Adventure',
  POLITICAL_INTRIGUE = 'Political Intrigue'
}

export enum CampaignAlignment {
  LAWFUL_GOOD = 'Lawful Good',
  NEUTRAL_GOOD = 'Neutral Good',
  CHAOTIC_GOOD = 'Chaotic Good',
  LAWFUL_NEUTRAL = 'Lawful Neutral',
  TRUE_NEUTRAL = 'True Neutral',
  CHAOTIC_NEUTRAL = 'Chaotic Neutral',
  LAWFUL_EVIL = 'Lawful Evil',
  NEUTRAL_EVIL = 'Neutral Evil',
  CHAOTIC_EVIL = 'Chaotic Evil'
}

export interface CampaignRules {
  allowedBooks: string[];
  characterCreationMethod: 'standard' | 'point-buy' | 'elite-array';
  startingLevel: number;
  multiclassing: boolean;
  prestigeClassesAllowed: boolean;
  houseRules: string[];
}

export interface CampaignSetting {
  name: string;
  description: string;
  type: CampaignType;
  primaryRegion: string;
  magicalAbundance: 'low' | 'moderate' | 'high' | 'magical dominant';
  primaryConflict: string;
}

export interface Campaign {
  id: string;
  name: string;
  dungeon_master: string;
  setting: CampaignSetting;
  rules: CampaignRules;
  alignment: CampaignAlignment;
  characters: Character[];
  encounters: Encounter[];
  
  // D&D 3.5 Specific Campaign Tracking
  xpTracker: {
    totalXP: number;
    xpThresholds: { [level: number]: number };
  };
  
  // Narrative and World-Building Elements
  worldHistory: string[];
  majorNPCs: Array<{
    name: string;
    role: string;
    alignment: string;
    significance: 'minor' | 'major' | 'critical'
  }>;
  
  // Campaign Progression Metadata
  metadata: {
    startDate: Date;
    currentDate: Date;
    sessionsPlayed: number;
    averagePartyLevel: number;
    campaignStatus: 'planning' | 'active' | 'completed' | 'on-hold'
  };
}

export class CampaignManager {
  private campaignAnalyzer: CampaignAnalyzer;

  constructor() {
    this.campaignAnalyzer = new CampaignAnalyzer();
  }

  // Create a new D&D 3.5 Campaign with Specific Configurations
  createCampaign(campaignData: Partial<Campaign>): Campaign {
    const defaultCampaign: Campaign = {
      id: uuidv4(),
      name: campaignData.name || 'Untitled D&D 3.5 Campaign',
      dungeon_master: campaignData.dungeon_master || 'Unknown DM',
      setting: campaignData.setting || {
        name: 'Unnamed Realm',
        description: 'A new campaign setting',
        type: CampaignType.DUNGEON_CRAWL,
        primaryRegion: 'Unspecified',
        magicalAbundance: 'moderate',
        primaryConflict: 'Undefined'
      },
      rules: {
        allowedBooks: [
          'Player\'s Handbook', 
          'Dungeon Master\'s Guide', 
          'Monster Manual'
        ],
        characterCreationMethod: 'standard',
        startingLevel: 1,
        multiclassing: true,
        prestigeClassesAllowed: false,
        houseRules: []
      },
      alignment: CampaignAlignment.TRUE_NEUTRAL,
      characters: [],
      encounters: [],
      xpTracker: {
        totalXP: 0,
        xpThresholds: this.generateXPThresholds()
      },
      worldHistory: [],
      majorNPCs: [],
      metadata: {
        startDate: new Date(),
        currentDate: new Date(),
        sessionsPlayed: 0,
        averagePartyLevel: 1,
        campaignStatus: 'planning'
      }
    };

    CampaignStorage.saveCampaign(defaultCampaign);
    return defaultCampaign;
  }

  // Generate XP Thresholds for D&D 3.5 Leveling
  private generateXPThresholds(): { [level: number]: number } {
    const xpTable: { [level: number]: number } = {
      1: 0,
      2: 1000,
      3: 3000,
      4: 6000,
      5: 10000,
      6: 15000,
      7: 21000,
      8: 28000,
      9: 36000,
      10: 45000,
      // Continue up to level 20
      20: 190000
    };
    return xpTable;
  }

  // Add Character to Campaign with Level Considerations
  addCharacterToCampaign(campaignId: string, character: Character): Campaign {
    const campaign = CampaignStorage.getCampaignById(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    // Validate character against campaign rules
    this.validateCharacter(campaign, character);

    campaign.characters.push(character);
    campaign.metadata.averagePartyLevel = this.calculateAveragePartyLevel(campaign);

    CampaignStorage.updateCampaign(campaign);
    return campaign;
  }

  // Validate Character Against Campaign Rules
  private validateCharacter(campaign: Campaign, character: Character): void {
    // Check starting level
    if (character.level < campaign.rules.startingLevel) {
      throw new Error(`Character must start at least at level ${campaign.rules.startingLevel}`);
    }

    // Multiclassing check
    if (!campaign.rules.multiclassing && character.classes.length > 1) {
      throw new Error('Multiclassing is not allowed in this campaign');
    }
  }

  // Calculate Average Party Level
  private calculateAveragePartyLevel(campaign: Campaign): number {
    if (campaign.characters.length === 0) return 1;
    
    const totalLevels = campaign.characters.reduce((sum, char) => sum + char.level, 0);
    return Math.round(totalLevels / campaign.characters.length);
  }
}
