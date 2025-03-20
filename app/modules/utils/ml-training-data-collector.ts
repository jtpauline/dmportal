import { Spell } from '../spells';
import { Character } from '../characters';
import { SpellInteractionAnalysis } from './spell-interaction-analyzer';
import { EnvironmentalContext } from './spell-interaction-analyzer';

export interface MLTrainingDataPoint {
  primarySpell: Spell;
  secondarySpell: Spell;
  character: Character;
  context: EnvironmentalContext;
  outcome: SpellInteractionAnalysis;
  timestamp: number;
  campaignId?: string;
}

export class MLTrainingDataCollector {
  private static trainingDataset: MLTrainingDataPoint[] = [];
  private static maxDatasetSize = 10000;

  /**
   * Collect spell interaction data for machine learning
   * @param dataPoint Spell interaction training data point
   */
  static collectTrainingData(dataPoint: MLTrainingDataPoint): void {
    // Ensure unique data points
    const existingDataPointIndex = this.trainingDataset.findIndex(
      existing => 
        existing.primarySpell.name === dataPoint.primarySpell.name &&
        existing.secondarySpell.name === dataPoint.secondarySpell.name &&
        existing.character.id === dataPoint.character.id
    );

    if (existingDataPointIndex !== -1) {
      // Replace existing data point if it exists
      this.trainingDataset[existingDataPointIndex] = dataPoint;
    } else {
      // Add new data point
      this.trainingDataset.push(dataPoint);
    }

    // Manage dataset size
    if (this.trainingDataset.length > this.maxDatasetSize) {
      this.pruneOldestDataPoints();
    }
  }

  /**
   * Prune oldest data points to maintain dataset size
   */
  private static pruneOldestDataPoints(): void {
    // Sort by timestamp and remove oldest entries
    this.trainingDataset.sort((a, b) => a.timestamp - b.timestamp);
    this.trainingDataset = this.trainingDataset.slice(-this.maxDatasetSize);
  }

  /**
   * Get current training dataset
   * @returns Current ML training dataset
   */
  static getTrainingDataset(): MLTrainingDataPoint[] {
    return [...this.trainingDataset];
  }

  /**
   * Filter training data based on specific criteria
   * @param filters Filtering criteria
   * @returns Filtered training dataset
   */
  static filterTrainingData(filters: Partial<MLTrainingDataPoint>): MLTrainingDataPoint[] {
    return this.trainingDataset.filter(dataPoint => {
      return Object.entries(filters).every(([key, value]) => {
        // Deep comparison for nested objects
        if (typeof value === 'object' && value !== null) {
          return Object.entries(value).every(([nestedKey, nestedValue]) => 
            dataPoint[key as keyof MLTrainingDataPoint]?.[nestedKey as keyof object] === nestedValue
          );
        }
        return dataPoint[key as keyof MLTrainingDataPoint] === value;
      });
    });
  }

  /**
   * Generate synthetic training data for initial model training
   * @returns Synthetic ML training dataset
   */
  static generateSyntheticTrainingData(): MLTrainingDataPoint[] {
    const syntheticSpells: Spell[] = [
      { 
        name: 'Fireball', 
        school: 'Evocation', 
        level: 3, 
        type: 'Damage',
        tags: ['offensive', 'area-of-effect']
      },
      { 
        name: 'Shield', 
        school: 'Abjuration', 
        level: 1, 
        type: 'Protection',
        tags: ['defensive', 'self-buff']
      },
      { 
        name: 'Haste', 
        school: 'Transmutation', 
        level: 3, 
        type: 'Buff',
        tags: ['enhancement', 'movement']
      },
      { 
        name: 'Healing Word', 
        school: 'Conjuration', 
        level: 1, 
        type: 'Healing',
        tags: ['restoration', 'support']
      }
    ];

    const syntheticCharacters: Character[] = [
      {
        id: 'wizard-1',
        name: 'Arcane Researcher',
        class: 'Wizard',
        level: 10,
        intelligence: 18,
        wisdom: 16
      },
      {
        id: 'cleric-1',
        name: 'Divine Healer',
        class: 'Cleric',
        level: 8,
        wisdom: 17,
        intelligence: 14
      }
    ];

    const syntheticDataset: MLTrainingDataPoint[] = [];

    // Generate combinations
    syntheticSpells.forEach((primarySpell, primaryIndex) => {
      syntheticSpells.forEach((secondarySpell, secondaryIndex) => {
        if (primaryIndex !== secondaryIndex) {
          syntheticCharacters.forEach(character => {
            const dataPoint: MLTrainingDataPoint = {
              primarySpell,
              secondarySpell,
              character,
              context: {
                terrain: 'dungeon',
                combatDifficulty: 'moderate',
                partyComposition: ['Wizard', 'Cleric']
              },
              outcome: {
                compatibilityScore: Math.random() * 10,
                interactionType: 
                  primarySpell.school === secondarySpell.school ? 'synergy' : 
                  primarySpell.type !== secondarySpell.type ? 'neutral' : 'conflict',
                contextualEffectiveness: {
                  terrain: Math.random(),
                  combatDifficulty: Math.random()
                },
                potentialOutcomes: [
                  `Combination of ${primarySpell.name} and ${secondarySpell.name}`
                ],
                riskFactors: ['Standard magical interaction']
              },
              timestamp: Date.now()
            };

            syntheticDataset.push(dataPoint);
          });
        }
      });
    });

    return syntheticDataset;
  }

  /**
   * Export training dataset for external use
   * @returns Exported training dataset
   */
  static exportTrainingDataset(): {
    datasetSize: number;
    uniqueSpells: string[];
    uniqueCharacterClasses: string[];
    dateRange: { start: number; end: number };
  } {
    return {
      datasetSize: this.trainingDataset.length,
      uniqueSpells: [
        ...new Set(this.trainingDataset.flatMap(
          data => [data.primarySpell.name, data.secondarySpell.name]
        ))
      ],
      uniqueCharacterClasses: [
        ...new Set(this.trainingDataset.map(data => data.character.class))
      ],
      dateRange: {
        start: Math.min(...this.trainingDataset.map(data => data.timestamp)),
        end: Math.max(...this.trainingDataset.map(data => data.timestamp))
      }
    };
  }
}
