import { Spell } from '../spells';
import { Character } from '../characters';
import { SpellInteractionAnalysis } from './spell-interaction-analyzer';

export interface SpellInteractionTrainingData {
  spellCombination: string[];
  interactionOutcome: {
    effectivness: number;
    synergyScore: number;
    unexpectedEffects: string[];
  };
  contextualFactors: {
    characterClass: string;
    environmentType: string;
    combatDifficulty: number;
  };
}

export interface SpellInteractionPrediction {
  spellCombination: string[];
  predictedCompatibility: number;
  potentialSynergyEffects: string[];
  riskFactors: string[];
  confidenceScore: number;
}

export class AdvancedSpellInteractionMLPredictor {
  private static instance: AdvancedSpellInteractionMLPredictor;
  private trainingData: SpellInteractionTrainingData[] = [];
  private modelWeights: Record<string, number> = {};

  private constructor() {}

  /**
   * Singleton instance getter
   */
  public static getInstance(): AdvancedSpellInteractionMLPredictor {
    if (!this.instance) {
      this.instance = new AdvancedSpellInteractionMLPredictor();
    }
    return this.instance;
  }

  /**
   * Train the ML model with interaction data
   * @param trainingDataset Training dataset for spell interactions
   */
  trainModel(trainingDataset: SpellInteractionTrainingData[]): void {
    this.trainingData = trainingDataset;
    this.computeModelWeights();
  }

  /**
   * Compute model weights based on training data
   */
  private computeModelWeights(): void {
    // Initialize weight computation
    const weightFactors: Record<string, number> = {
      synergyScore: 0,
      unexpectedEffectsPenalty: 0,
      characterClassFactor: 0,
      environmentTypeFactor: 0
    };

    // Aggregate weights from training data
    this.trainingData.forEach(dataPoint => {
      weightFactors.synergyScore += dataPoint.interactionOutcome.synergyScore;
      weightFactors.unexpectedEffectsPenalty += 
        dataPoint.interactionOutcome.unexpectedEffects.length * 0.1;
      
      // Character class influence
      weightFactors.characterClassFactor += this.getCharacterClassWeight(
        dataPoint.contextualFactors.characterClass
      );

      // Environment type influence
      weightFactors.environmentTypeFactor += this.getEnvironmentTypeWeight(
        dataPoint.contextualFactors.environmentType
      );
    });

    // Normalize and store weights
    const datasetSize = this.trainingData.length;
    this.modelWeights = {
      synergyScoreWeight: weightFactors.synergyScore / datasetSize,
      unexpectedEffectsPenaltyWeight: weightFactors.unexpectedEffectsPenalty / datasetSize,
      characterClassWeight: weightFactors.characterClassFactor / datasetSize,
      environmentTypeWeight: weightFactors.environmentTypeFactor / datasetSize
    };
  }

  /**
   * Predict spell interaction outcomes
   * @param spellCombination Spells to analyze
   * @param character Character casting the spells
   * @param environmentContext Current environment
   * @returns Predicted spell interaction
   */
  predictSpellInteraction(
    spellCombination: Spell[], 
    character: Character, 
    environmentContext: string
  ): SpellInteractionPrediction {
    // Compute base compatibility
    const baseCompatibility = this.computeBaseCompatibility(spellCombination);
    
    // Apply contextual modifiers
    const contextualModifier = this.applyContextualModifiers(
      character, 
      environmentContext
    );

    // Generate potential synergy effects
    const potentialSynergyEffects = this.generateSynergyEffects(spellCombination);

    // Compute risk factors
    const riskFactors = this.assessRiskFactors(spellCombination);

    // Compute confidence score
    const confidenceScore = this.computeConfidenceScore(
      baseCompatibility, 
      contextualModifier
    );

    return {
      spellCombination: spellCombination.map(spell => spell.name),
      predictedCompatibility: baseCompatibility * contextualModifier,
      potentialSynergyEffects,
      riskFactors,
      confidenceScore
    };
  }

  /**
   * Compute base spell compatibility
   * @param spellCombination Spells to analyze
   * @returns Base compatibility score
   */
  private computeBaseCompatibility(spellCombination: Spell[]): number {
    // Analyze spell schools, levels, and types
    const schoolCompatibility = this.analyzeSpellSchoolCompatibility(spellCombination);
    const levelDifferenceScore = this.computeLevelDifferenceScore(spellCombination);
    
    // Weighted combination of factors
    return (
      schoolCompatibility * 0.6 + 
      levelDifferenceScore * 0.4
    );
  }

  /**
   * Analyze spell school compatibility
   * @param spellCombination Spells to analyze
   * @returns School compatibility score
   */
  private analyzeSpellSchoolCompatibility(spellCombination: Spell[]): number {
    const schoolCounts: Record<string, number> = {};
    
    // Count spell schools
    spellCombination.forEach(spell => {
      schoolCounts[spell.school] = (schoolCounts[spell.school] || 0) + 1;
    });

    // More diverse schools slightly reduce compatibility
    const uniqueSchoolCount = Object.keys(schoolCounts).length;
    const schoolDiversityPenalty = uniqueSchoolCount > 2 ? 0.8 : 1;

    return schoolDiversityPenalty;
  }

  /**
   * Compute level difference score
   * @param spellCombination Spells to analyze
   * @returns Level difference compatibility score
   */
  private computeLevelDifferenceScore(spellCombination: Spell[]): number {
    const levels = spellCombination.map(spell => spell.level);
    const levelVariance = Math.max(...levels) - Math.min(...levels);

    // Smaller level differences are more compatible
    return levelVariance <= 2 ? 1 : 1 - (levelVariance * 0.1);
  }

  /**
   * Apply contextual modifiers to spell interaction
   * @param character Character casting spells
   * @param environmentContext Current environment
   * @returns Contextual modifier score
   */
  private applyContextualModifiers(
    character: Character, 
    environmentContext: string
  ): number {
    // Character intelligence/wisdom influence
    const mentalStateFactor = 
      (character.intelligence + character.wisdom) / 40;

    // Environment type modifier
    const environmentModifier = this.getEnvironmentTypeWeight(environmentContext);

    return mentalStateFactor * environmentModifier;
  }

  /**
   * Generate potential synergy effects
   * @param spellCombination Spells to analyze
   * @returns Potential synergy effects
   */
  private generateSynergyEffects(spellCombination: Spell[]): string[] {
    const synergyEffects: string[] = [];

    // Analyze spell types for potential synergies
    const spellTypes = new Set(spellCombination.map(spell => spell.type));
    
    if (spellTypes.has('Damage') && spellTypes.has('Buff')) {
      synergyEffects.push('Amplified Damage Output');
    }

    if (spellTypes.has('Protection') && spellTypes.has('Healing')) {
      synergyEffects.push('Enhanced Defensive Capabilities');
    }

    return synergyEffects;
  }

  /**
   * Assess risk factors for spell combination
   * @param spellCombination Spells to analyze
   * @returns Risk factors
   */
  private assessRiskFactors(spellCombination: Spell[]): string[] {
    const riskFactors: string[] = [];

    // Analyze potential conflicting spell interactions
    const spellSchools = spellCombination.map(spell => spell.school);
    const uniqueSchools = new Set(spellSchools);

    if (uniqueSchools.size > 2) {
      riskFactors.push('High Magical Complexity');
    }

    return riskFactors;
  }

  /**
   * Compute confidence score for prediction
   * @param baseCompatibility Base spell compatibility
   * @param contextualModifier Contextual interaction modifier
   * @returns Confidence score
   */
  private computeConfidenceScore(
    baseCompatibility: number, 
    contextualModifier: number
  ): number {
    return Math.min(
      (baseCompatibility * contextualModifier) * 10, 
      1
    );
  }

  /**
   * Get character class weight for prediction
   * @param characterClass Character's class
   * @returns Class-specific weight
   */
  private getCharacterClassWeight(characterClass: string): number {
    const classWeights: Record<string, number> = {
      'Wizard': 1.2,
      'Sorcerer': 1.1,
      'Cleric': 1.0,
      'Druid': 0.9,
      'Warlock': 0.8
    };

    return classWeights[characterClass] || 1.0;
  }

  /**
   * Get environment type weight for prediction
   * @param environmentType Current environment
   * @returns Environment-specific weight
   */
  private getEnvironmentTypeWeight(environmentType: string): number {
    const environmentWeights: Record<string, number> = {
      'Dungeon': 1.2,
      'Wilderness': 1.1,
      'Urban': 1.0,
      'Planar': 0.9,
      'Underwater': 0.8
    };

    return environmentWeights[environmentType] || 1.0;
  }

  /**
   * Evaluate model performance
   * @returns Performance metrics
   */
  evaluateModelPerformance(): {
    trainingDatasetSize: number;
    modelWeights: Record<string, number>;
    performanceMetrics: {
      averageCompatibilityPrediction: number;
      synergyEffectAccuracy: number;
    };
  } {
    const averageCompatibilityPrediction = this.trainingData.reduce(
      (acc, dataPoint) => acc + dataPoint.interactionOutcome.synergyScore, 
      0
    ) / this.trainingData.length;

    const synergyEffectAccuracy = this.trainingData.filter(
      dataPoint => dataPoint.interactionOutcome.unexpectedEffects.length > 0
    ).length / this.trainingData.length;

    return {
      trainingDatasetSize: this.trainingData.length,
      modelWeights: this.modelWeights,
      performanceMetrics: {
        averageCompatibilityPrediction,
        synergyEffectAccuracy
      }
    };
  }
}

// Create a singleton instance for global access
export const AdvancedSpellInteractionMLPredictorInstance = 
  AdvancedSpellInteractionMLPredictor.getInstance();
