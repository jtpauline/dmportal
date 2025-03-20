import { Character } from '../characters';
import { Monster } from '../monsters';
import { RandomGenerator } from './random-generator';
import { TacticalInsightsGenerator } from './tactical-insights-generator';

export interface EncounterScalingContext {
  characters: Character[];
  baseEncounter: {
    monsters: Monster[];
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Deadly';
  };
  scalingFactors: {
    campaignProgressionStage?: number;
    previousEncounterOutcomes?: 'Victory' | 'Defeat' | 'Narrow Escape';
    playerExperience?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  };
}

export interface ScaledEncounterResult {
  scaledMonsters: Monster[];
  difficultyAdjustment: number;
  recommendedTactics: string[];
  potentialChallenges: string[];
}

export class EncounterScalingSystem {
  /**
   * Scale encounter based on various contextual factors
   * @param context Encounter scaling context
   * @returns Scaled encounter details
   */
  static scaleEncounter(
    context: EncounterScalingContext
  ): ScaledEncounterResult {
    // Analyze character capabilities
    const characterAnalysis = this.analyzeCharacterCapabilities(context.characters);

    // Calculate base scaling factor
    const baseScalingFactor = this.calculateBaseScalingFactor(context);

    // Scale monsters
    const scaledMonsters = this.scaleMonsters(
      context.baseEncounter.monsters, 
      baseScalingFactor
    );

    // Generate tactical insights
    const tacticalInsights = TacticalInsightsGenerator.generateTacticalInsights({
      characters: context.characters,
      monsters: scaledMonsters,
      terrain: 'Generic',
      environmentalFactors: []
    });

    return {
      scaledMonsters,
      difficultyAdjustment: baseScalingFactor,
      recommendedTactics: tacticalInsights.recommendedTactics,
      potentialChallenges: tacticalInsights.potentialRisks
    };
  }

  /**
   * Analyze character capabilities for scaling
   * @param characters Player characters
   * @returns Character capability analysis
   */
  private static analyzeCharacterCapabilities(
    characters: Character[]
  ): {
    averageLevel: number;
    multiclassComplexity: number;
    uniqueClassCount: number;
  } {
    const averageLevel = characters.reduce((sum, char) => sum + char.level, 0) / characters.length;
    
    const multiclassComplexity = characters.reduce((complexity, char) => 
      complexity + (char.multiclassLevels?.length || 0), 0
    );

    const uniqueClasses = new Set(characters.map(char => char.class)).size;

    return {
      averageLevel,
      multiclassComplexity,
      uniqueClassCount: uniqueClasses
    };
  }

  /**
   * Calculate base scaling factor
   * @param context Encounter scaling context
   * @returns Scaling factor
   */
  private static calculateBaseScalingFactor(
    context: EncounterScalingContext
  ): number {
    const { scalingFactors, baseEncounter } = context;
    
    // Base difficulty multipliers
    const difficultyMultipliers = {
      'Easy': 0.8,
      'Medium': 1.0,
      'Hard': 1.2,
      'Deadly': 1.5
    };

    // Campaign progression scaling
    const progressionScaling = scalingFactors.campaignProgressionStage 
      ? Math.min(1.5, 1 + (scalingFactors.campaignProgressionStage * 0.1))
      : 1;

    // Previous encounter outcome scaling
    const outcomeScaling = {
      'Victory': 1.1,
      'Defeat': 0.9,
      'Narrow Escape': 1.0
    }[scalingFactors.previousEncounterOutcomes || 'Narrow Escape'];

    // Player experience scaling
    const experienceScaling = {
      'Beginner': 0.9,
      'Intermediate': 1.0,
      'Advanced': 1.1,
      'Expert': 1.2
    }[scalingFactors.playerExperience || 'Intermediate'];

    // Calculate final scaling factor
    const baseMultiplier = difficultyMultipliers[baseEncounter.difficulty];
    
    return Math.min(2.0, 
      baseMultiplier * 
      progressionScaling * 
      outcomeScaling * 
      experienceScaling
    );
  }

  /**
   * Scale monster attributes
   * @param monsters Original monsters
   * @param scalingFactor Scaling factor
   * @returns Scaled monsters
   */
  private static scaleMonsters(
    monsters: Monster[], 
    scalingFactor: number
  ): Monster[] {
    return monsters.map(monster => {
      // Create a deep copy to avoid mutating original monster
      const scaledMonster = { ...monster };

      // Scale challenge rating
      scaledMonster.challengeRating = Math.max(
        0.25, 
        Number((monster.challengeRating * scalingFactor).toFixed(2))
      );

      // Scale hit points
      scaledMonster.hitPoints = Math.max(
        1, 
        Math.round(monster.hitPoints * scalingFactor)
      );

      // Scale damage output
      if (scaledMonster.actions) {
        scaledMonster.actions = scaledMonster.actions.map(action => ({
          ...action,
          damage: action.damage 
            ? action.damage.map(dmg => ({
                ...dmg,
                averageDamage: Math.max(
                  1, 
                  Math.round(dmg.averageDamage * scalingFactor)
                )
              }))
            : undefined
        }));
      }

      // Add potential new abilities or modify existing ones
      if (scalingFactor > 1.2) {
        const potentialNewAbilities = [
          'Legendary Resistance',
          'Improved Critical Hit',
          'Enhanced Mobility'
        ];

        scaledMonster.specialAbilities = [
          ...(scaledMonster.specialAbilities || []),
          ...RandomGenerator.selectUniqueFromArray(
            potentialNewAbilities, 
            Math.floor(scalingFactor - 1)
          ).map(ability => ({ name: ability }))
        ];
      }

      return scaledMonster;
    });
  }
}
