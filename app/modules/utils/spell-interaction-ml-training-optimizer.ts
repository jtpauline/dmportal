import { MLTrainingDataPoint } from './ml-training-data-collector';

export class SpellInteractionMLTrainingOptimizer {
  /**
   * Optimize training dataset for machine learning
   * @param trainingDataset Raw training dataset
   * @returns Optimized training dataset
   */
  static optimizeTrainingDataset(
    trainingDataset: MLTrainingDataPoint[]
  ): MLTrainingDataPoint[] {
    // Remove duplicate entries
    const uniqueDataset = this.removeDuplicates(trainingDataset);

    // Balance dataset across different interaction types
    const balancedDataset = this.balanceDataset(uniqueDataset);

    // Feature engineering
    const engineeredDataset = this.performFeatureEngineering(balancedDataset);

    // Normalize data
    const normalizedDataset = this.normalizeData(engineeredDataset);

    return normalizedDataset;
  }

  /**
   * Remove duplicate training data points
   * @param dataset Training dataset
   * @returns Dataset without duplicates
   */
  private static removeDuplicates(
    dataset: MLTrainingDataPoint[]
  ): MLTrainingDataPoint[] {
    const uniqueDataset: MLTrainingDataPoint[] = [];
    const seenDataPoints = new Set<string>();

    dataset.forEach(dataPoint => {
      const dataPointKey = JSON.stringify({
        primarySpell: dataPoint.primarySpell.name,
        secondarySpell: dataPoint.secondarySpell.name,
        characterClass: dataPoint.character.class,
        context: dataPoint.context
      });

      if (!seenDataPoints.has(dataPointKey)) {
        uniqueDataset.push(dataPoint);
        seenDataPoints.add(dataPointKey);
      }
    });

    return uniqueDataset;
  }

  /**
   * Balance dataset across interaction types
   * @param dataset Training dataset
   * @returns Balanced dataset
   */
  private static balanceDataset(
    dataset: MLTrainingDataPoint[]
  ): MLTrainingDataPoint[] {
    const interactionTypeCounts: Record<string, MLTrainingDataPoint[]> = {
      synergy: [],
      neutral: [],
      conflict: []
    };

    // Categorize data points
    dataset.forEach(dataPoint => {
      const interactionType = dataPoint.outcome.interactionType;
      interactionTypeCounts[interactionType].push(dataPoint);
    });

    // Find minimum count across interaction types
    const minCount = Math.min(
      ...Object.values(interactionTypeCounts).map(arr => arr.length)
    );

    // Balance dataset
    const balancedDataset: MLTrainingDataPoint[] = [];
    Object.values(interactionTypeCounts).forEach(typeDataset => {
      balancedDataset.push(
        ...typeDataset.slice(0, minCount)
      );
    });

    return balancedDataset;
  }

  /**
   * Perform feature engineering on dataset
   * @param dataset Training dataset
   * @returns Dataset with engineered features
   */
  private static performFeatureEngineering(
    dataset: MLTrainingDataPoint[]
  ): MLTrainingDataPoint[] {
    return dataset.map(dataPoint => {
      // Add derived features
      const derivedFeatures = {
        spellLevelDifference: Math.abs(
          dataPoint.primarySpell.level - dataPoint.secondarySpell.level
        ),
        characterLevelFactor: dataPoint.character.level / 20,
        schoolCompatibilityScore: this.calculateSchoolCompatibility(
          dataPoint.primarySpell.school, 
          dataPoint.secondarySpell.school
        )
      };

      return {
        ...dataPoint,
        engineeredFeatures: derivedFeatures
      };
    });
  }

  /**
   * Calculate spell school compatibility
   * @param school1 First spell school
   * @param school2 Second spell school
   * @returns Compatibility score
   */
  private static calculateSchoolCompatibility(
    school1: string, 
    school2: string
  ): number {
    const compatibilityMatrix: Record<string, Record<string, number>> = {
      'Evocation': { 
        'Abjuration': 0.7, 
        'Conjuration': 0.6 
      },
      'Illusion': {
        'Enchantment': 0.8,
        'Divination': 0.5
      }
      // Add more school compatibility mappings
    };

    const compatibilityScore = 
      compatibilityMatrix[school1]?.[school2] ?? 
      compatibilityMatrix[school2]?.[school1] ?? 
      0.5;

    return compatibilityScore;
  }

  /**
   * Normalize training data
   * @param dataset Training dataset
   * @returns Normalized dataset
   */
  private static normalizeData(
    dataset: MLTrainingDataPoint[]
  ): MLTrainingDataPoint[] {
    // Normalize numerical features
    const normalizedDataset = dataset.map(dataPoint => {
      const normalizedOutcome = {
        ...dataPoint.outcome,
        compatibilityScore: dataPoint.outcome.compatibilityScore / 10
      };

      return {
        ...dataPoint,
        outcome: normalizedOutcome
      };
    });

    return normalizedDataset;
  }

  /**
   * Generate training dataset quality report
   * @param dataset Training dataset
   * @returns Dataset quality report
   */
  static generateDatasetQualityReport(
    dataset: MLTrainingDataPoint[]
  ): {
    totalDataPoints: number;
    interactionTypeDistribution: Record<string, number>;
    uniqueSpellCombinations: number;
    uniqueCharacterClasses: number;
  } {
    const interactionTypeDistribution: Record<string, number> = {
      synergy: 0,
      neutral: 0,
      conflict: 0
    };

    const uniqueSpellCombinations = new Set(
      dataset.map(dp => 
        `${dp.primarySpell.name}-${dp.secondarySpell.name}`
      )
    );

    const uniqueCharacterClasses = new Set(
      dataset.map(dp => dp.character.class)
    );

    dataset.forEach(dataPoint => {
      interactionTypeDistribution[dataPoint.outcome.interactionType]++;
    });

    return {
      totalDataPoints: dataset.length,
      interactionTypeDistribution,
      uniqueSpellCombinations: uniqueSpellCombinations.size,
      uniqueCharacterClasses: uniqueCharacterClasses.size
    };
  }
}
