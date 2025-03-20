import { Spell } from '../spells';
import { Character } from '../characters';
import { EnvironmentalContext } from './spell-interaction-analyzer';
import { SpellInteractionAnalysis } from './spell-interaction-analyzer';
import { MLTrainingDataPoint } from './ml-training-data-collector';
import * as tf from '@tensorflow/tfjs';
import * as brain from 'brain.js';

export class SpellInteractionMLPredictor {
  private static tfModel: tf.Sequential | null = null;
  private static brainModel: brain.NeuralNetwork | null = null;

  /**
   * Prepare TensorFlow.js model for spell interaction prediction
   * @param trainingData ML training dataset
   */
  static async prepareTensorFlowModel(trainingData: MLTrainingDataPoint[]): Promise<void> {
    // Preprocess training data
    const { features, labels } = this.preprocessTrainingData(trainingData);

    // Create TensorFlow model
    const model = tf.sequential();
    
    // Input layer
    model.add(tf.layers.dense({
      inputShape: [features[0].length],
      units: 64,
      activation: 'relu'
    }));

    // Hidden layers
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu'
    }));
    model.add(tf.layers.dense({
      units: 16,
      activation: 'relu'
    }));

    // Output layer for compatibility score prediction
    model.add(tf.layers.dense({
      units: 1,
      activation: 'sigmoid'
    }));

    // Compile model
    model.compile({
      optimizer: 'adam',
      loss: 'meanSquaredError',
      metrics: ['accuracy']
    });

    // Train model
    const xs = tf.tensor2d(features);
    const ys = tf.tensor2d(labels.map(l => [l]));

    await model.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs?.loss}`);
        }
      }
    });

    this.tfModel = model;
  }

  /**
   * Prepare Brain.js neural network for spell interaction prediction
   * @param trainingData ML training dataset
   */
  static prepareBrainModel(trainingData: MLTrainingDataPoint[]): void {
    const { features, labels } = this.preprocessTrainingData(trainingData);

    // Normalize data
    const normalizedData = features.map((feature, index) => ({
      input: feature,
      output: [labels[index]]
    }));

    // Create and train Brain.js neural network
    const net = new brain.NeuralNetwork({
      hiddenLayers: [64, 32, 16],
      activation: 'sigmoid'
    });

    net.train(normalizedData, {
      iterations: 20000,
      log: true,
      logPeriod: 100
    });

    this.brainModel = net;
  }

  /**
   * Preprocess training data for ML models
   * @param trainingData Raw ML training data
   * @returns Processed features and labels
   */
  private static preprocessTrainingData(trainingData: MLTrainingDataPoint[]): {
    features: number[][];
    labels: number[];
  } {
    return {
      features: trainingData.map(dataPoint => [
        // Spell features
        dataPoint.primarySpell.level,
        dataPoint.secondarySpell.level,
        this.encodeSpellSchool(dataPoint.primarySpell.school),
        this.encodeSpellSchool(dataPoint.secondarySpell.school),
        
        // Character features
        dataPoint.character.level,
        this.encodeCharacterClass(dataPoint.character.class),
        
        // Context features
        this.encodeEnvironmentalTerrain(dataPoint.context.terrain),
        this.encodeCombatDifficulty(dataPoint.context.combatDifficulty)
      ]),
      labels: trainingData.map(dataPoint => 
        dataPoint.outcome.compatibilityScore / 10 // Normalize to 0-1 range
      )
    };
  }

  /**
   * Predict spell interaction compatibility using ML models
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @param character Casting character
   * @param context Environmental context
   * @returns Predicted compatibility score
   */
  static predictSpellInteraction(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character,
    context: EnvironmentalContext
  ): { 
    tfPrediction: number | null, 
    brainPrediction: number | null 
  } {
    if (!this.tfModel || !this.brainModel) {
      console.warn('ML models not initialized');
      return { tfPrediction: null, brainPrediction: null };
    }

    const inputFeatures = [
      primarySpell.level,
      secondarySpell.level,
      this.encodeSpellSchool(primarySpell.school),
      this.encodeSpellSchool(secondarySpell.school),
      character.level,
      this.encodeCharacterClass(character.class),
      this.encodeEnvironmentalTerrain(context.terrain),
      this.encodeCombatDifficulty(context.combatDifficulty)
    ];

    // TensorFlow.js prediction
    let tfPrediction = null;
    if (this.tfModel) {
      const inputTensor = tf.tensor2d([inputFeatures]);
      const prediction = this.tfModel.predict(inputTensor) as tf.Tensor;
      tfPrediction = prediction.dataSync()[0] * 10; // Denormalize back to 0-10 scale
    }

    // Brain.js prediction
    let brainPrediction = null;
    if (this.brainModel) {
      const prediction = this.brainModel.run(inputFeatures);
      brainPrediction = prediction[0] * 10; // Denormalize back to 0-10 scale
    }

    return { tfPrediction, brainPrediction };
  }

  /**
   * Encode spell school to numerical representation
   * @param school Spell school name
   * @returns Numerical encoding
   */
  private static encodeSpellSchool(school: string): number {
    const schoolEncoding: Record<string, number> = {
      'evocation': 0,
      'abjuration': 1,
      'illusion': 2,
      'necromancy': 3,
      'conjuration': 4,
      'transmutation': 5,
      'divination': 6,
      'enchantment': 7
    };
    return schoolEncoding[school.toLowerCase()] || -1;
  }

  /**
   * Encode character class to numerical representation
   * @param characterClass Character class name
   * @returns Numerical encoding
   */
  private static encodeCharacterClass(characterClass: string): number {
    const classEncoding: Record<string, number> = {
      'wizard': 0,
      'sorcerer': 1,
      'warlock': 2,
      'druid': 3,
      'cleric': 4,
      'paladin': 5,
      'ranger': 6,
      'bard': 7
    };
    return classEncoding[characterClass.toLowerCase()] || -1;
  }

  /**
   * Encode environmental terrain to numerical representation
   * @param terrain Terrain type
   * @returns Numerical encoding
   */
  private static encodeEnvironmentalTerrain(terrain: string): number {
    const terrainEncoding: Record<string, number> = {
      'urban': 0,
      'wilderness': 1,
      'dungeon': 2,
      'forest': 3,
      'mountain': 4,
      'desert': 5
    };
    return terrainEncoding[terrain.toLowerCase()] || -1;
  }

  /**
   * Encode combat difficulty to numerical representation
   * @param difficulty Combat difficulty
   * @returns Numerical encoding
   */
  private static encodeCombatDifficulty(difficulty: string): number {
    const difficultyEncoding: Record<string, number> = {
      'easy': 0,
      'moderate': 1,
      'challenging': 2,
      'extreme': 3
    };
    return difficultyEncoding[difficulty.toLowerCase()] || -1;
  }

  /**
   * Get model performance metrics
   * @returns Model performance statistics
   */
  static getModelPerformance(): {
    tfModelSummary?: string;
    brainModelLayers?: number[];
  } {
    const result: {
      tfModelSummary?: string;
      brainModelLayers?: number[];
    } = {};

    if (this.tfModel) {
      const modelSummary: string[] = [];
      this.tfModel.summary((line) => modelSummary.push(line));
      result.tfModelSummary = modelSummary.join('\n');
    }

    if (this.brainModel) {
      result.brainModelLayers = [
        this.brainModel.inputLayer.size,
        ...this.brainModel.hiddenLayers.map(layer => layer.size),
        this.brainModel.outputLayer.size
      ];
    }

    return result;
  }
}
