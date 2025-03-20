import { Character } from './characters';
import { Monster } from './monsters';
import { PredictiveEncounterDesigner, PredictiveEncounterDesignOptions, PredictiveEncounterDesign } from '../utils/predictive-encounter-design';
import { CampaignStorage } from './campaign-storage';
import { RandomGenerator } from '../utils/random-generator';

export interface Encounter {
  id: string;
  name: string;
  monsters: Monster[];
  characters: Character[];
  terrain: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Deadly';
  narrative: {
    synopsis: string;
    thematicElements: string[];
    emotionalTone: string;
  };
  tacticalInsights: string[];
  potentialChallenges: string[];
}

export class EncounterManager {
  private campaignStorage: CampaignStorage;

  constructor(campaignStorage: CampaignStorage) {
    this.campaignStorage = campaignStorage;
  }

  /**
   * Generate a predictive encounter for a specific campaign
   * @param campaignId Campaign identifier
   * @param characters Characters participating in the encounter
   * @param options Additional encounter generation options
   * @returns Generated encounter
   */
  async generatePredictiveEncounter(
    campaignId: string, 
    characters: Character[], 
    options: Partial<PredictiveEncounterDesignOptions> = {}
  ): Promise<Encounter> {
    // Retrieve campaign context
    const campaignContext = await this.campaignStorage.getCampaignContext(campaignId);
    
    // Retrieve previous encounter history
    const previousEncounters = await this.campaignStorage.getCampaignEncounterHistory(campaignId);

    // Prepare encounter design options
    const encounterOptions: PredictiveEncounterDesignOptions = {
      characters,
      campaignContext,
      previousEncounterHistory: previousEncounters,
      difficultyPreference: options.difficultyPreference || 'Medium',
      playerSkillLevel: this.determinePlayerSkillLevel(characters)
    };

    // Generate predictive encounter design
    const predictiveDesign = PredictiveEncounterDesigner.designEncounter(encounterOptions);

    // Transform predictive design to encounter
    return this.transformPredictiveDesignToEncounter(predictiveDesign, campaignId);
  }

  /**
   * Transform predictive design to encounter
   * @param design Predictive encounter design
   * @param campaignId Campaign identifier
   * @returns Encounter object
   */
  private transformPredictiveDesignToEncounter(
    design: PredictiveEncounterDesign, 
    campaignId: string
  ): Encounter {
    return {
      id: RandomGenerator.generateUniqueId(),
      name: `${design.encounter.narrative.environmentalDescription} Encounter`,
      monsters: design.encounter.monsters,
      characters: design.encounter.characters,
      terrain: design.encounter.narrative.environmentalDescription,
      difficulty: this.mapDifficultyScore(design.learningInsights.strategicComplexity),
      narrative: {
        synopsis: design.encounter.narrative.synopsis,
        thematicElements: this.extractThematicElements(design.encounter.monsters),
        emotionalTone: this.determineEmotionalTone(design.encounter.monsters)
      },
      tacticalInsights: design.recommendedTactics,
      potentialChallenges: design.potentialChallenges
    };
  }

  /**
   * Determine player skill level based on characters
   * @param characters Player characters
   * @returns Skill level category
   */
  private determinePlayerSkillLevel(characters: Character[]): PredictiveEncounterDesignOptions['playerSkillLevel'] {
    const averageLevel = characters.reduce((sum, char) => sum + char.level, 0) / characters.length;
    const multiclassCount = characters.filter(c => c.multiclassLevels?.length > 0).length;

    if (averageLevel > 10 && multiclassCount > 1) return 'Expert';
    if (averageLevel > 7 && multiclassCount > 0) return 'Advanced';
    if (averageLevel > 4) return 'Intermediate';
    return 'Beginner';
  }

  /**
   * Map strategic complexity to difficulty
   * @param complexityScore Complexity score
   * @returns Encounter difficulty
   */
  private mapDifficultyScore(complexityScore: number): Encounter['difficulty'] {
    if (complexityScore < 0.3) return 'Easy';
    if (complexityScore < 0.6) return 'Medium';
    if (complexityScore < 0.8) return 'Hard';
    return 'Deadly';
  }

  /**
   * Extract thematic elements from monsters
   * @param monsters Encounter monsters
   * @returns Thematic elements
   */
  private extractThematicElements(monsters: Monster[]): string[] {
    const thematicElements = new Set<string>();

    monsters.forEach(monster => {
      if (monster.type === 'Undead') thematicElements.add('Mortality');
      if (monster.type === 'Fiend') thematicElements.add('Corruption');
      if (monster.specialAbilities?.some(a => a.name.includes('Regeneration'))) {
        thematicElements.add('Resilience');
      }
    });

    return Array.from(thematicElements);
  }

  /**
   * Determine emotional tone based on monsters
   * @param monsters Encounter monsters
   * @returns Emotional tone
   */
  private determineEmotionalTone(monsters: Monster[]): string {
    const tones = [
      { 
        tone: 'Ominous', 
        condition: () => monsters.some(m => m.type === 'Fiend' || m.type === 'Undead') 
      },
      { 
        tone: 'Mysterious', 
        condition: () => monsters.some(m => m.type === 'Aberration') 
      },
      { 
        tone: 'Tense', 
        condition: () => monsters.some(m => m.challengeRating > 5) 
      },
      { 
        tone: 'Epic', 
        condition: () => monsters.length > 3 
      }
    ];

    const matchedTone = tones.find(t => t.condition());
    return matchedTone ? matchedTone.tone : 'Neutral';
  }

  /**
   * Save encounter to campaign history
   * @param campaignId Campaign identifier
   * @param encounter Generated encounter
   */
  async saveEncounterToCampaign(campaignId: string, encounter: Encounter): Promise<void> {
    await this.campaignStorage.addEncounterToCampaignHistory(campaignId, encounter);
  }
}

// Singleton instance
export const encounterManager = new EncounterManager(new CampaignStorage());
