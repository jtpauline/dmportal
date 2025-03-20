import { Encounter } from './encounters';
import { Character } from './characters';
import { RandomGenerator } from '../utils/random-generator';

export interface CampaignContext {
  id: string;
  name: string;
  currentChapter?: string;
  environmentalPreferences?: string[];
  narrativeThemes?: string[];
  difficultyPreference?: 'Easy' | 'Medium' | 'Hard' | 'Deadly';
}

export class CampaignStorage {
  private campaigns: Map<string, {
    context: CampaignContext;
    characters: Character[];
    encounterHistory: Encounter[];
  }> = new Map();

  /**
   * Create a new campaign
   * @param name Campaign name
   * @returns Campaign context
   */
  createCampaign(name: string): CampaignContext {
    const campaignId = RandomGenerator.generateUniqueId();
    const campaignContext: CampaignContext = {
      id: campaignId,
      name,
      currentChapter: 'Prologue',
      environmentalPreferences: [],
      narrativeThemes: [],
      difficultyPreference: 'Medium'
    };

    this.campaigns.set(campaignId, {
      context: campaignContext,
      characters: [],
      encounterHistory: []
    });

    return campaignContext;
  }

  /**
   * Get campaign context
   * @param campaignId Campaign identifier
   * @returns Campaign context
   */
  async getCampaignContext(campaignId: string): Promise<CampaignContext> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }
    return campaign.context;
  }

  /**
   * Add characters to a campaign
   * @param campaignId Campaign identifier
   * @param characters Characters to add
   */
  async addCharactersToCampaign(campaignId: string, characters: Character[]): Promise<void> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }
    campaign.characters.push(...characters);
  }

  /**
   * Get campaign characters
   * @param campaignId Campaign identifier
   * @returns Campaign characters
   */
  async getCampaignCharacters(campaignId: string): Promise<Character[]> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }
    return campaign.characters;
  }

  /**
   * Add encounter to campaign history
   * @param campaignId Campaign identifier
   * @param encounter Encounter to add
   */
  async addEncounterToCampaignHistory(campaignId: string, encounter: Encounter): Promise<void> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }
    campaign.encounterHistory.push(encounter);

    // Update campaign context based on encounter
    this.updateCampaignContextFromEncounter(campaign.context, encounter);
  }

  /**
   * Get campaign encounter history
   * @param campaignId Campaign identifier
   * @returns Encounter history
   */
  async getCampaignEncounterHistory(campaignId: string): Promise<Encounter[]> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }
    return campaign.encounterHistory;
  }

  /**
   * Update campaign context based on encounter characteristics
   * @param context Campaign context
   * @param encounter Recent encounter
   */
  private updateCampaignContextFromEncounter(context: CampaignContext, encounter: Encounter): void {
    // Update environmental preferences
    if (!context.environmentalPreferences.includes(encounter.terrain)) {
      context.environmentalPreferences.push(encounter.terrain);
    }

    // Update narrative themes
    encounter.narrative.thematicElements.forEach(theme => {
      if (!context.narrativeThemes.includes(theme)) {
        context.narrativeThemes.push(theme);
      }
    });

    // Adjust difficulty preference based on encounter difficulty
    const difficultyMap = {
      'Easy': 0,
      'Medium': 1,
      'Hard': 2,
      'Deadly': 3
    };

    const currentDifficultyValue = difficultyMap[context.difficultyPreference];
    const encounterDifficultyValue = difficultyMap[encounter.difficulty];

    if (encounterDifficultyValue > currentDifficultyValue) {
      const newDifficultyOptions = ['Easy', 'Medium', 'Hard', 'Deadly'];
      context.difficultyPreference = newDifficultyOptions[
        Math.min(encounterDifficultyValue, newDifficultyOptions.length - 1)
      ] as CampaignContext['difficultyPreference'];
    }
  }
}
