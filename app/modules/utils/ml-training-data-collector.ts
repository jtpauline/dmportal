import { Spell } from '../spells';
import { Character } from '../characters';
import { EnvironmentalContext } from './spell-interaction-analyzer';

/**
 * Represents a single training data point for machine learning
 */
export interface MLTrainingDataPoint {
  primarySpell: Spell;
  secondarySpell: Spell;
  character: Character;
  context: EnvironmentalContext;
  performanceMetrics: {
    damageDealt: number;
    resourceEfficiency: number;
    tacticalAdvantage: number;
  };
  outcome: 'success' | 'neutral' | 'failure';
}

/**
 * Manages collection and analysis of machine learning training data
 */
export class MLTrainingDataCollector {
  // In-memory storage for training data
  private static trainingDataset: MLTrainingDataPoint[] = [];

  /**
   * Record a new training data point
   * @param dataPoint Training data point to record
   */
  static recordTrainingData(dataPoint: MLTrainingDataPoint): void {
    this.trainingDataset.push(dataPoint);
    this.validateAndCleanDataset();
  }

  /**
   * Validate and clean the training dataset
   * Removes duplicate or invalid entries
   */
  private static validateAndCleanDataset(): void {
    // Remove exact duplicates
    this.trainingDataset = Array.from(
      new Set(this.trainingDataset.map(JSON.stringify))
    ).map(JSON.parse);

    // Optional: Implement more advanced data cleaning
    // - Remove outliers
    // - Normalize performance metrics
    // - Validate data integrity
  }

  /**
   * Get comprehensive dataset statistics
   * @returns Detailed dataset statistics
   */
  static getDatasetStatistics() {
    return {
      totalDataPoints: this.trainingDataset.length,
      outcomeDistribution: this.computeOutcomeDistribution(),
      spellSchoolDistribution: this.computeSpellSchoolDistribution(),
      performanceMetricsSummary: this.computePerformanceMetricsSummary()
    };
  }

  /**
   * Compute outcome distribution
   * @returns Distribution of interaction outcomes
   */
  private static computeOutcomeDistribution() {
    return this.trainingDataset.reduce((dist, dataPoint) => {
      dist[dataPoint.outcome] = (dist[dataPoint.outcome] || 0) + 1;
      return dist;
    }, { success: 0, neutral: 0, failure: 0 });
  }

  /**
   * Compute spell school distribution
   * @returns Distribution of spell schools in interactions
   */
  private static computeSpellSchoolDistribution() {
    return this.trainingDataset.reduce((dist, dataPoint) => {
      const primarySchool = dataPoint.primarySpell.school;
      const secondarySchool = dataPoint.secondarySpell.school;
      
      dist[primarySchool] = (dist[primarySchool] || 0) + 1;
      dist[secondarySchool] = (dist[secondarySchool] || 0) + 1;
      
      return dist;
    }, {});
  }

  /**
   * Compute performance metrics summary
   * @returns Summary of performance metrics
   */
  private static computePerformanceMetricsSummary() {
    const summary = {
      damageDealt: { min: Infinity, max: -Infinity, avg: 0 },
      resourceEfficiency: { min: Infinity, max: -Infinity, avg: 0 },
      tacticalAdvantage: { min: Infinity, max: -Infinity, avg: 0 }
    };

    this.trainingDataset.forEach(dataPoint => {
      const metrics = dataPoint.performanceMetrics;
      
      ['damageDealt', 'resourceEfficiency', 'tacticalAdvantage'].forEach(metric => {
        const value = metrics[metric];
        summary[metric].min = Math.min(summary[metric].min, value);
        summary[metric].max = Math.max(summary[metric].max, value);
        summary[metric].avg += value;
      });
    });

    // Compute averages
    const datasetLength = this.trainingDataset.length;
    ['damageDealt', 'resourceEfficiency', 'tacticalAdvantage'].forEach(metric => {
      summary[metric].avg /= datasetLength;
    });

    return summary;
  }

  /**
   * Export training dataset
   * @param format Export format
   * @returns Exported dataset
   */
  static exportTrainingDataset(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.trainingDataset, null, 2);
    }

    // Basic CSV export
    const headers = [
      'primary_spell', 'secondary_spell', 
      'character', 'context', 
      'damage_dealt', 'resource_efficiency', 'tactical_advantage', 
      'outcome'
    ];

    const csvRows = this.trainingDataset.map(dataPoint => [
      dataPoint.primarySpell.name,
      dataPoint.secondarySpell.name,
      dataPoint.character.name,
      dataPoint.context.terrain,
      dataPoint.performanceMetrics.damageDealt,
      dataPoint.performanceMetrics.resourceEfficiency,
      dataPoint.performanceMetrics.tacticalAdvantage,
      dataPoint.outcome
    ].join(','));

    return [headers.join(','), ...csvRows].join('\n');
  }

  /**
   * Clear the entire training dataset
   */
  static clearTrainingDataset(): void {
    this.trainingDataset = [];
  }
}
