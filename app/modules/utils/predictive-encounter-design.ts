import { Character } from '../characters';
import { Monster } from '../monsters';
import { RandomGenerator } from './random-generator';
import { TacticalInsightsGenerator } from './tactical-insights-generator';
import { EncounterScalingSystem } from './encounter-scaling-system';

export interface PredictiveEncounterDesignContext {
  characters: Character[];
  campaignStage: number;
  difficultyPreference?: 'Easy' | 'Medium' | 'Hard' | 'Deadly';
  terrainType?: string;
  environmentalFactors?: string[];
}

export interface PredictiveEncounterResult {
  encounter: {
    monsters: Monster[];
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Deadly';
  };
  strategicInsights: {
    characterSynergies: string[];
    potentialTactics: string[];
    encounterChallenges: string[];
  };
}

export class PredictiveEncounterDesigner {
  /**
   * Generate a predictive encounter design
   * @param context Predictive encounter design context
   * @returns Predictive encounter result
   */
  static generatePredictiveEncounter(
    context: PredictiveEncounterDesignContext
  ): PredictiveEncounterResult {
    // Analyze character composition
    const characterAnalysis = this.analyzeCharacterComposition(context.characters);

    // Generate base monster composition
    const baseMonsters = this.generateMonsterComposition(
      context.characters, 
      context.difficultyPreference || 'Medium'
    );

    // Scale encounter based on campaign progression
    const scaledEncounter = EncounterScalingSystem.scaleEncounter({
      characters: context.characters,
      baseEncounter: {
        monsters: baseMonsters,
        difficulty: context.difficultyPreference || 'Medium'
      },
      scalingFactors: {
        campaignProgressionStage: context.campaignStage,
        playerExperience: this.determinePlayerExperienceLevel(context.characters)
      }
    });

    // Generate tactical insights
    const tacticalInsights = TacticalInsightsGenerator.generateTacticalInsights({
      characters: context.characters,
      monsters: scaledEncounter.scaledMonsters,
      terrain: context.terrainType || 'Generic',
      environmentalFactors: context.environmentalFactors || []
    });

    return {
      encounter: {
        monsters: scaledEncounter.scaledMonsters,
        difficulty: context.difficultyPreference || 'Medium'
      },
      strategicInsights: {
        characterSynergies: characterAnalysis.characterSynergies,
        potentialTactics: tacticalInsights.recommendedTactics,
        encounterChallenges: tacticalInsights.potentialRisks
      }
    };
  }

  /**
   * Analyze character composition
   * @param characters Player characters
   * @returns Character composition analysis
   */
  private static analyzeCharacterComposition(
    characters: Character[]
  ): {
    characterSynergies: string[];
    multiclassComplexity: number;
    uniqueClassCount: number;
  } {
    // Identify potential character synergies
    const synergies = [
      'Complementary ability combinations',
      'Diverse skill set coverage',
      'Potential multiclass interaction',
      'Balanced role distribution'
    ];

    const characterSynergies = RandomGenerator.selectUniqueFromArray(
      synergies, 
      Math.min(synergies.length, 2)
    );

    // Calculate multiclass complexity
    const multiclassComplexity = characters.reduce((complexity, char) => 
      complexity + (char.multiclassLevels?.length || 0), 0
    );

    // Count unique classes
    const uniqueClasses = new Set(characters.map(char => char.class)).size;

    return {
      characterSynergies,
      multiclassComplexity,
      uniqueClassCount: uniqueClasses
    };
  }

  /**
   * Generate monster composition
   * @param characters Player characters
   * @param difficulty Encounter difficulty
   * @returns Generated monster composition
   */
  private static generateMonsterComposition(
    characters: Character[],
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Deadly'
  ): Monster[] {
    const averageCharacterLevel = characters.reduce((sum, char) => sum + char.level, 0) / characters.length;

    const monsterTypeTemplates = {
      'Easy': [
        { name: 'Goblin Scout', challengeRating: 0.25, type: 'Humanoid' },
        { name: 'Wolf', challengeRating: 0.25, type: 'Beast' },
        { name: 'Kobold', challengeRating: 0.125, type: 'Humanoid' }
      ],
      'Medium': [
        { name: 'Orc War Chief', challengeRating: 2, type: 'Humanoid' },
        { name: 'Bugbear', challengeRating: 1, type: 'Humanoid' },
        { name: 'Dire Wolf', challengeRating: 1, type: 'Beast' }
      ],
      'Hard': [
        { name: 'Ogre', challengeRating: 3, type: 'Giant' },
        { name: 'Hill Giant', challengeRating: 5, type: 'Giant' },
        { name: 'Young Green Dragon', challengeRating: 4, type: 'Dragon' }
      ],
      'Deadly': [
        { name: 'Adult Blue Dragon', challengeRating: 10, type: 'Dragon' },
        { name: 'Lich', challengeRating: 9, type: 'Undead' },
        { name: 'Vampire Spawn', challengeRating: 6, type: 'Undead' }
      ]
    };

    const monsterTypes = monsterTypeTemplates[difficulty];

    // Determine number of monsters based on party size and difficulty
    const monsterCount = {
      'Easy': 2,
      'Medium': 3,
      'Hard': 4,
      'Deadly': 5
    }[difficulty];

    // Select monsters ensuring challenge rating is appropriate
    const selectedMonsters = RandomGenerator.selectUniqueFromArray(
      monsterTypes, 
      monsterCount
    );

    // Adjust monster challenge ratings based on average character level
    return selectedMonsters.map(monster => ({
      ...monster,
      challengeRating: Math.min(
        monster.challengeRating, 
        Math.max(0.25, averageCharacterLevel / 2)
      )
    }));
  }

  /**
   * Determine player experience level
   * @param characters Player characters
   * @returns Player experience level
   */
  private static determinePlayerExperienceLevel(
    characters: Character[]
  ): 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' {
    const averageLevel = characters.reduce((sum, char) => sum + char.level, 0) / characters.length;
    const multiclassCount = characters.filter(c => 
      c.multiclassLevels && c.multiclassLevels.length > 0
    ).length;

    if (averageLevel < 3 && multiclassCount === 0) return 'Beginner';
    if (averageLevel < 7) return 'Intermediate';
    if (averageLevel < 12) return 'Advanced';
    return 'Expert';
  }
}
