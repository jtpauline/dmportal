import { Spell } from '../spells';
import { Character } from '../characters';
import { EnvironmentalContext } from './spell-interaction-analyzer';
import { MLTrainingDataPoint } from './ml-training-data-collector';
import * as tf from '@tensorflow/tfjs';

export interface AdvancedSpellInteractionFeatures {
  spellSynergyScore: number;
  elementalAlignment: number;
  magicalComplexity: number;
  riskscore: number;
}

export class AdvancedSpellInteractionPredictor {
  private static advancedModel: tf.Sequential | null = null;

  /**
   * Extract advanced features for spell interaction
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @param character Casting character
   * @param context Environmental context
   * @returns Advanced interaction features
   */
  static extractAdvancedFeatures(
    primarySpell: Spell, 
    secondarySpell: Spell, 
    character: Character, 
    context: EnvironmentalContext
  ): AdvancedSpellInteractionFeatures {
    return {
      spellSynergyScore: this.calculateSpellSynergy(primarySpell, secondarySpell),
      elementalAlignment: this.calculateElementalAlignment(primarySpell, secondarySpell),
      magicalComplexity: this.calculateMagicalComplexity(primarySpell, secondarySpell, character),
      riskscore: this.calculateRiskScore(primarySpell, secondarySpell, context)
    };
  }

  /**
   * Calculate spell synergy based on school and tags
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @returns Synergy score (0-10)
   */
  private static calculateSpellSynergy(
    primarySpell: Spell, 
    secondarySpell: Spell
  ): number {
    const synergyMatrix: Record<string, Record<string, number>> = {
      'evocation': { 'evocation': 8, 'abjuration': 6, 'illusion': 5 },
      'abjuration': { 'evocation': 7, 'abjuration': 9, 'necromancy': 4 },
      'illusion': { 'enchantment': 8, 'divination': 7, 'evocation': 5 }
    };

    const baseScore = synergyMatrix[primarySpell.school.toLowerCase()]?.[secondarySpell.school.toLowerCase()] || 5;
    
    // Bonus for matching tags
    const tagOverlap = primarySpell.tags?.filter(tag => 
      secondarySpell.tags?.includes(tag)
    ).length || 0;

    return Math.min(baseScore + (tagOverlap * 1.5), 10);
  }

  /**
   * Calculate elemental alignment between spells
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @returns Elemental alignment score (0-10)
   */
  private static calculateElementalAlignment(
    primarySpell: Spell, 
    secondarySpell: Spell
  ): number {
    const elementalRelationships: Record<string, Record<string, number>> = {
      'fire': { 'water': 2, 'earth': 7, 'air': 6 },
      'water': { 'fire': 8, 'earth': 5, 'air': 7 },
      'earth': { 'fire': 6, 'water': 5, 'air': 4 },
      'air': { 'fire': 7, 'water': 6, 'earth': 5 }
    };

    const primaryElement = primarySpell.tags?.find(tag => 
      ['fire', 'water', 'earth', 'air'].includes(tag)
    );
    const secondaryElement = secondarySpell.tags?.find(tag => 
      ['fire', 'water', 'earth', 'air'].includes(tag)
    );

    if (!primaryElement || !secondaryElement) return 5;

    return elementalRelationships[primaryElement]?.[secondaryElement] || 5;
  }

  /**
   * Calculate magical complexity of spell interaction
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @param character Casting character
   * @returns Complexity score (0-10)
   */
  private static calculateMagicalComplexity(
    primarySpell: Spell, 
    secondarySpell: Spell, 
    character: Character
  ): number {
    const levelDifference = Math.abs(primarySpell.level - secondarySpell.level);
    const characterIntelligence = character.abilityScores?.intelligence || 10;

    // Base complexity calculation
    let complexity = (
      levelDifference * 2 + 
      (10 - characterIntelligence) * 0.5
    );

    // Bonus for different spell schools
    if (primarySpell.school !== secondarySpell.school) {
      complexity += 2;
    }

    return Math.min(Math.max(complexity, 0), 10);
  }

  /**
   * Calculate risk score for spell interaction
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @param context Environmental context
   * @returns Risk score (0-10)
   */
  private static calculateRiskScore(
    primarySpell: Spell, 
    secondarySpell: Spell, 
    context: EnvironmentalContext
  ): number {
    const terrainRiskModifiers: Record<string, number> = {
      'dungeon': 7,
      'urban': 5,
      'wilderness': 6,
      'mountain': 8,
      'desert': 4
    };

    const difficultyRiskModifiers: Record<string, number> = {
      'extreme': 9,
      'challenging': 7,
      'moderate': 5,
      'easy': 3
    };

    const terrainRisk = terrainRiskModifiers[context.terrain.toLowerCase()] || 5;
    const difficultyRisk = difficultyRiskModifiers[context.combatDifficulty.toLowerCase()] || 5;

    // Calculate risk based on spell levels and environmental factors
    const baseRisk = Math.abs(primarySpell.level - secondarySpell.level) * 2;
    
    return Math.min(
      baseRisk + (terrainRisk * 0.3) + (difficultyRisk * 0.4), 
      10
    );
  }

  /**
   * Prepare advanced TensorFlow model for spell interaction prediction
   * @param trainingData Advanced ML training dataset
   */
  static async prepareAdvancedModel(trainingData: MLTrainingDataPoint[]): Promise<void> {
    // Preprocess training data with advanced features
    const { features, labels } = this.preprocessAdvancedTrainingData(trainingData);

    // Create advanced TensorFlow model
    const model = tf.sequential();
    
    // Input layer with advanced features
    model.add(tf.layers.dense({
      inputShape: [features[0].length],
      units: 128,
      activation: 'relu'
    }));

    // Advanced hidden layers with dropout for regularization
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu'
    }));

    model.add(tf.layers.dropout({ rate: 0.1 }));
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu'
    }));

    // Output layer for advanced prediction
    model.add(tf.layers.dense({
      units: 1,
      activation: 'sigmoid'
    }));

    // Compile with advanced optimizer
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['accuracy']
    });

    // Train model
    const xs = tf.tensor2d(features);
    const ys = tf.tensor2d(labels.map(l => [l]));

    await model.fit(xs, ys, {
      epochs: 100,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs?.loss}, accuracy = ${logs?.acc}`);
        }
      }
    });

    this.advancedModel = model;
  }

  /**
   * Preprocess advanced training data
   * @param trainingData Raw ML training data
   * @returns Processed advanced features and labels
   */
  private static preprocessAdvancedTrainingData(trainingData: MLTrainingDataPoint[]): {
    features: number[][];
    labels: number[];
  } {
    return {
      features: trainingData.map(dataPoint => [
        // Advanced feature extraction
        this.calculateSpellSynergy(
          {
            name: dataPoint.primarySpell.name,
            school: dataPoint.primarySpell.school,
            level: dataPoint.primarySpell.level,
            tags: dataPoint.primarySpell.tags
          },
          {
            name: dataPoint.secondarySpell.name,
            school: dataPoint.secondarySpell.school,
            level: dataPoint.secondarySpell.level,
            tags: dataPoint.secondarySpell.tags
          }
        ),
        this.calculateElementalAlignment(
          {
            name: dataPoint.primarySpell.name,
            school: dataPoint.primarySpell.school,
            level: dataPoint.primarySpell.level,
            tags: dataPoint.primarySpell.tags
          },
          {
            name: dataPoint.secondarySpell.name,
            school: dataPoint.secondarySpell.school,
            level: dataPoint.secondarySpell.level,
            tags: dataPoint.secondarySpell.tags
          }
        ),
        this.calculateMagicalComplexity(
          {
            name: dataPoint.primarySpell.name,
            school: dataPoint.primarySpell.school,
            level: dataPoint.primarySpell.level,
            tags: dataPoint.primarySpell.tags
          },
          {
            name: dataPoint.secondarySpell.name,
            school: dataPoint.secondarySpell.school,
            level: dataPoint.secondarySpell.level,
            tags: dataPoint.secondarySpell.tags
          },
          {
            id: '',
            class: dataPoint.character.class,
            level: dataPoint.character.level,
            abilityScores: dataPoint.character.abilityScores
          }
        ),
        this.calculateRiskScore(
          {
            name: dataPoint.primarySpell.name,
            school: dataPoint.primarySpell.school,
            level: dataPoint.primarySpell.level,
            tags: dataPoint.primarySpell.tags
          },
          {
            name: dataPoint.secondarySpell.name,
            school: dataPoint.secondarySpell.school,
            level: dataPoint.secondarySpell.level,
            tags: dataPoint.secondarySpell.tags
          },
          {
            terrain: dataPoint.context.terrain,
            combatDifficulty: dataPoint.context.combatDifficulty,
            partyComposition: dataPoint.context.partyComposition
          }
        )
      ]),
      labels: trainingData.map(dataPoint => 
        dataPoint.outcome.compatibilityScore / 10 // Normalize to 0-1 range
      )
    };
  }

  /**
   * Predict advanced spell interaction
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @param character Casting character
   * @param context Environmental context
   * @returns Advanced prediction result
   */
  static predictAdvancedSpellInteraction(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character,
    context: EnvironmentalContext
  ): { 
    advancedPrediction: number | null;
    advancedFeatures: AdvancedSpellInteractionFeatures;
  } {
    if (!this.advancedModel) {
      console.warn('Advanced ML model not initialized');
      return { 
        advancedPrediction: null, 
        advancedFeatures: this.extractAdvancedFeatures(
          primarySpell, 
          secondarySpell, 
          character, 
          context
        )
      };
    }

    // Extract advanced features
    const advancedFeatures = this.extractAdvancedFeatures(
      primarySpell, 
      secondarySpell, 
      character, 
      context
    );

    // Prepare input tensor
    const inputTensor = tf.tensor2d([
      advancedFeatures.spellSynergyScore,
      advancedFeatures.elementalAlignment,
      advancedFeatures.magicalComplexity,
      advancedFeatures.riskscore
    ]);

    // Make prediction
    const prediction = this.advancedModel.predict(inputTensor) as tf.Tensor;
    const advancedPrediction = prediction.dataSync()[0] * 10; // Denormalize back to 0-10 scale

    return { 
      advancedPrediction, 
      advancedFeatures 
    };
  }
}
