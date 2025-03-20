import { Character } from '../characters';
import { Monster } from '../monsters';
import { RandomGenerator } from './random-generator';
import { EncounterScalingSystem } from './encounter-scaling-system';

export interface AdaptiveDifficultyOptions {
  characters: Character[];
  currentEncounter: {
    monsters: Monster[];
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Deadly';
  };
  playerPerformance?: {
    averageHealthRemaining?: number;
    resourceUtilization?: number;
    tacticalEffectiveness?: number;
  };
  campaignContext?: {
    progressionStage: number;
    previousEncounterOutcome?: 'Victory' | 'Defeat' | 'Narrow Escape';
  };
}

export interface AdaptiveDifficultyResult {
  adjustedMonsters: Monster[];
  difficultyFeedback: {
    overallDifficultyAdjustment: number;
    recommendedPlayerStrategies: string[];
    potentialChallenges: string[];
  };
}

export class AdaptiveDifficultySystem {
  /**
   * Dynamically adjust encounter difficulty
   * @param options Adaptive difficulty parameters
   * @returns Adjusted encounter with difficulty feedback
   */
  static adjustDifficulty(
    options: AdaptiveDifficultyOptions
  ): AdaptiveDifficultyResult {
    // Analyze player performance
    const performanceMetrics = this.analyzePlayerPerformance(options);

    // Scale encounter based on performance and context
    const scaledEncounter = EncounterScalingSystem.scaleEncounter({
      characters: options.characters,
      baseEncounter: options.currentEncounter,
      scalingFactors: {
        campaignProgressionStage: options.campaignContext?.progressionStage,
        previousEncounterOutcomes: options.campaignContext?.previousEncounterOutcome,
        playerExperience: this.determinePlayerExperienceLevel(options.characters)
      }
    });

    // Generate adaptive difficulty feedback
    const difficultyFeedback = this.generateDifficultyFeedback(
      performanceMetrics, 
      scaledEncounter
    );

    return {
      adjustedMonsters: scaledEncounter.scaledMonsters,
      difficultyFeedback: {
        overallDifficultyAdjustment: scaledEncounter.difficultyAdjustment,
        recommendedPlayerStrategies: scaledEncounter.recommendedTactics,
        potentialChallenges: [
          ...scaledEncounter.potentialChallenges,
          ...difficultyFeedback.additionalChallenges
        ]
      }
    };
  }

  /**
   * Analyze player performance metrics
   * @param options Adaptive difficulty options
   * @returns Performance analysis
   */
  private static analyzePlayerPerformance(
    options: AdaptiveDifficultyOptions
  ): {
    healthPerformance: number;
    resourceEfficiency: number;
    tacticalScore: number;
  } {
    const { playerPerformance } = options;

    return {
      healthPerformance: playerPerformance?.averageHealthRemaining ?? 0.5,
      resourceEfficiency: playerPerformance?.resourceUtilization ?? 0.5,
      tacticalScore: playerPerformance?.tacticalEffectiveness ?? 0.5
    };
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

  /**
   * Generate difficulty feedback
   * @param performanceMetrics Player performance metrics
   * @param scaledEncounter Scaled encounter details
   * @returns Difficulty feedback
   */
  private static generateDifficultyFeedback(
    performanceMetrics: ReturnType<typeof this.analyzePlayerPerformance>,
    scaledEncounter: any
  ): {
    additionalChallenges: string[];
    strategicRecommendations: string[];
  } {
    const additionalChallenges: string[] = [];
    const strategicRecommendations: string[] = [];

    // Analyze health performance
    if (performanceMetrics.healthPerformance < 0.3) {
      additionalChallenges.push(
        'High risk of character incapacitation',
        'Consider defensive tactical approaches'
      );
    }

    // Analyze resource efficiency
    if (performanceMetrics.resourceEfficiency < 0.4) {
      strategicRecommendations.push(
        'Optimize resource management',
        'Conserve high-impact abilities for critical moments'
      );
    }

    // Analyze tactical effectiveness
    if (performanceMetrics.tacticalScore < 0.5) {
      additionalChallenges.push(
        'Tactical coordination needs improvement',
        'Focus on synergistic character abilities'
      );
    }

    // Add scaled encounter challenges
    if (scaledEncounter.difficultyAdjustment > 1.2) {
      additionalChallenges.push(
        'Encounter difficulty has been significantly increased',
        'Expect more complex and challenging combat scenarios'
      );
    }

    return {
      additionalChallenges,
      strategicRecommendations
    };
  }
}
