import { MLTrainingDataPoint } from './ml-training-data-collector';
import { SpellInteractionAnalysis } from './spell-interaction-analyzer';

/**
 * Advanced ML data export and transformation utility
 */
export class SpellInteractionMLExporter {
  /**
   * Convert training data to machine learning-friendly format
   * @param trainingData Raw training data points
   * @returns Processed ML-ready dataset
   */
  static convertToMLDataset(trainingData: MLTrainingDataPoint[]): MLDataset {
    return {
      features: trainingData.map(this.extractFeatures),
      labels: trainingData.map(this.extractLabels)
    };
  }

  /**
   * Extract numerical features from training data
   * @param dataPoint Individual training data point
   * @returns Numerical feature representation
   */
  private static extractFeatures(dataPoint: MLTrainingDataPoint): number[] {
    return [
      // Spell-related features
      dataPoint.primarySpell.level,
      dataPoint.secondarySpell.level,
      this.encodeSpellSchool(dataPoint.primarySpell.school),
      this.encodeSpellSchool(dataPoint.secondarySpell.school),
      
      // Character-related features
      dataPoint.character.level,
      this.encodeCharacterClass(dataPoint.character.class),
      
      // Context features
      this.encodeEnvironmentalTerrain(dataPoint.context.terrain),
      this.encodeCombatDifficulty(dataPoint.context.combatDifficulty),
      
      // Performance metrics
      dataPoint.performanceMetrics.damageDealt,
      dataPoint.performanceMetrics.resourceEfficiency,
      dataPoint.performanceMetrics.tacticalAdvantage
    ];
  }

  /**
   * Extract labels for machine learning
   * @param dataPoint Individual training data point
   * @returns Encoded outcome label
   */
  private static extractLabels(dataPoint: MLTrainingDataPoint): number {
    const outcomeMap = {
      'success': 2,
      'neutral': 1,
      'failure': 0
    };
    return outcomeMap[dataPoint.outcome];
  }

  /**
   * Encode spell school to numerical representation
   * @param school Spell school name
   * @returns Numerical encoding
   */
  private static encodeSpellSchool(school: string): number {
    const schoolEncoding = {
      'evocation': 0,
      'conjuration': 1,
      'illusion': 2,
      'necromancy': 3,
      'transmutation': 4,
      'abjuration': 5,
      'divination': 6,
      'enchantment': 7,
      'restoration': 8
    };
    return schoolEncoding[school.toLowerCase()] || -1;
  }

  /**
   * Encode character class to numerical representation
   * @param characterClass Character class name
   * @returns Numerical encoding
   */
  private static encodeCharacterClass(characterClass: string): number {
    const classEncoding = {
      'wizard': 0,
      'sorcerer': 1,
      'warlock': 2,
      'druid': 3,
      'cleric': 4,
      'paladin': 5,
      'ranger': 6,
      'bard': 7,
      'fighter': 8,
      'rogue': 9
    };
    return classEncoding[characterClass.toLowerCase()] || -1;
  }

  /**
   * Encode environmental terrain to numerical representation
   * @param terrain Terrain type
   * @returns Numerical encoding
   */
  private static encodeEnvironmentalTerrain(terrain: string): number {
    const terrainEncoding = {
      'forest': 0,
      'mountain': 1,
      'desert': 2,
      'urban': 3,
      'underwater': 4,
      'arctic': 5,
      'cave': 6
    };
    return terrainEncoding[terrain.toLowerCase()] || -1;
  }

  /**
   * Encode combat difficulty to numerical representation
   * @param difficulty Combat difficulty
   * @returns Numerical encoding
   */
  private static encodeCombatDifficulty(difficulty: string): number {
    const difficultyEncoding = {
      'easy': 0,
      'medium': 1,
      'hard': 2,
      'deadly': 3
    };
    return difficultyEncoding[difficulty.toLowerCase()] || -1;
  }

  /**
   * Export dataset to various ML framework formats
   * @param dataset Processed ML dataset
   * @param format Export format
   * @returns Exported dataset
   */
  static exportDataset(dataset: MLDataset, format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(dataset, null, 2);
    }

    // Basic CSV export
    const headers = [
      'primary_spell_level', 'secondary_spell_level',
      'primary_spell_school', 'secondary_spell_school',
      'character_level', 'character_class',
      'terrain', 'combat_difficulty',
      'damage_dealt', 'resource_efficiency', 'tactical_advantage',
      'outcome'
    ];

    const csvRows = dataset.features.map((features, index) => 
      [...features, dataset.labels[index]].join(',')
    );

    return [headers.join(','), ...csvRows].join('\n');
  }
}

// Type definitions for ML dataset
interface MLDataset {
  features: number[][];
  labels: number[];
}
