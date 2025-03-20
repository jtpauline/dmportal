import { Campaign } from '../campaigns';
import { Character } from '../characters';
import { Encounter } from '../encounters';
import { NarrativeComplexityAnalyzer } from './narrative-complexity-analyzer';
import { CharacterNarrativeSystem } from './character-narrative-system';
import { WorldProgressionSystem } from './world-progression-system';

export interface NarrativePredictionModel {
  predictNarrativeTrajectory: (context: NarrativePredictionContext) => NarrativePrediction;
  trainModel: (trainingData: NarrativeTrainingData[]) => void;
  evaluateModelPerformance: () => ModelPerformanceMetrics;
}

export interface NarrativePredictionContext {
  campaign: Campaign;
  characters: Character[];
  currentEncounter?: Encounter;
  historicalEvents: string[];
}

export interface NarrativePrediction {
  mostLikelyTrajectory: string;
  predictionConfidence: number;
  potentialAlternativeTrajectories: string[];
  recommendedCharacterActions: string[];
}

export interface NarrativeTrainingData {
  campaignType: string;
  characterTypes: string[];
  narrativeOutcome: string;
  complexityMetrics: {
    narrativeDepth: number;
    characterInterconnectedness: number;
    plotDynamism: number;
    thematicCoherence: number;
  };
}

export interface ModelPerformanceMetrics {
  accuracyScore: number;
  predictionVariance: number;
  complexityAdaptability: number;
}

export class NarrativeMachineLearningPredictor implements NarrativePredictionModel {
  private trainingDataset: NarrativeTrainingData[] = [];
  private modelWeights: Record<string, number> = {};

  /**
   * Predict Narrative Trajectory
   */
  predictNarrativeTrajectory(context: NarrativePredictionContext): NarrativePrediction {
    const complexityMetrics = NarrativeComplexityAnalyzer.analyzeNarrativeComplexity(
      context.campaign, 
      context.characters
    );

    // Advanced trajectory prediction
    const trajectoryProbabilities = this.calculateTrajectoryProbabilities(
      context, 
      complexityMetrics
    );

    // Select most likely trajectory
    const mostLikelyTrajectory = this.selectMostLikelyTrajectory(trajectoryProbabilities);

    return {
      mostLikelyTrajectory,
      predictionConfidence: this.calculatePredictionConfidence(trajectoryProbabilities),
      potentialAlternativeTrajectories: this.generateAlternativeTrajectories(
        context, 
        trajectoryProbabilities
      ),
      recommendedCharacterActions: this.generateCharacterActionRecommendations(
        context, 
        mostLikelyTrajectory
      )
    };
  }

  /**
   * Train Narrative Prediction Model
   */
  trainModel(trainingData: NarrativeTrainingData[]): void {
    // Accumulate training data
    this.trainingDataset.push(...trainingData);

    // Advanced model training with weighted feature importance
    this.modelWeights = this.calculateModelWeights(trainingData);
  }

  /**
   * Evaluate Model Performance
   */
  evaluateModelPerformance(): ModelPerformanceMetrics {
    const accuracyScore = this.calculateAccuracyScore();
    const predictionVariance = this.calculatePredictionVariance();
    const complexityAdaptability = this.assessComplexityAdaptability();

    return {
      accuracyScore,
      predictionVariance,
      complexityAdaptability
    };
  }

  /**
   * Calculate Trajectory Probabilities
   */
  private calculateTrajectoryProbabilities(
    context: NarrativePredictionContext,
    complexityMetrics: any
  ): Record<string, number> {
    const trajectoryTemplates = [
      'Heroic Resolution',
      'Tragic Downfall',
      'Unexpected Twist',
      'Gradual Transformation',
      'Moral Compromise'
    ];

    // Probability calculation based on complexity metrics and historical context
    return trajectoryTemplates.reduce((probabilities, trajectory) => {
      probabilities[trajectory] = this.calculateTrajectoryProbability(
        trajectory, 
        context, 
        complexityMetrics
      );
      return probabilities;
    }, {});
  }

  /**
   * Calculate Individual Trajectory Probability
   */
  private calculateTrajectoryProbability(
    trajectory: string,
    context: NarrativePredictionContext,
    complexityMetrics: any
  ): number {
    // Complex probability calculation
    const baseWeight = this.modelWeights[trajectory] || 0.2;
    const complexityFactor = (
      complexityMetrics.narrativeDepth * 0.3 +
      complexityMetrics.characterInterconnectedness * 0.3 +
      complexityMetrics.plotDynamism * 0.2 +
      complexityMetrics.thematicCoherence * 0.2
    );

    // Historical context influence
    const historicalContextFactor = this.calculateHistoricalContextInfluence(
      context.historicalEvents, 
      trajectory
    );

    return baseWeight * complexityFactor * historicalContextFactor;
  }

  /**
   * Select Most Likely Trajectory
   */
  private selectMostLikelyTrajectory(
    trajectoryProbabilities: Record<string, number>
  ): string {
    return Object.entries(trajectoryProbabilities)
      .reduce((max, [trajectory, probability]) => 
        probability > max.probability ? { trajectory, probability } : max, 
        { trajectory: '', probability: -1 }
      ).trajectory;
  }

  /**
   * Calculate Prediction Confidence
   */
  private calculatePredictionConfidence(
    trajectoryProbabilities: Record<string, number>
  ): number {
    const probabilities = Object.values(trajectoryProbabilities);
    const maxProbability = Math.max(...probabilities);
    const averageProbability = probabilities.reduce((a, b) => a + b, 0) / probabilities.length;

    return maxProbability / (averageProbability || 1);
  }

  /**
   * Generate Alternative Trajectories
   */
  private generateAlternativeTrajectories(
    context: NarrativePredictionContext,
    trajectoryProbabilities: Record<string, number>
  ): string[] {
    // Sort trajectories by probability and select top alternatives
    return Object.entries(trajectoryProbabilities)
      .sort(([, a], [, b]) => b - a)
      .slice(1, 3)
      .map(([trajectory]) => trajectory);
  }

  /**
   * Generate Character Action Recommendations
   */
  private generateCharacterActionRecommendations(
    context: NarrativePredictionContext,
    mostLikelyTrajectory: string
  ): string[] {
    const actionRecommendations = {
      'Heroic Resolution': [
        'Collaborate with allies',
        'Leverage unique character strengths',
        'Maintain moral integrity'
      ],
      'Tragic Downfall': [
        'Mitigate potential risks',
        'Seek alternative solutions',
        'Prepare for potential setbacks'
      ],
      'Unexpected Twist': [
        'Remain adaptable',
        'Gather additional information',
        'Be prepared for rapid changes'
      ],
      'Gradual Transformation': [
        'Embrace personal growth',
        'Reflect on current capabilities',
        'Develop new skills'
      ],
      'Moral Compromise': [
        'Carefully evaluate ethical implications',
        'Seek balanced solutions',
        'Maintain personal principles'
      ]
    };

    return actionRecommendations[mostLikelyTrajectory] || [];
  }

  /**
   * Calculate Model Weights
   */
  private calculateModelWeights(trainingData: NarrativeTrainingData[]): Record<string, number> {
    // Advanced weight calculation based on training data
    const weightMap: Record<string, number> = {};
    
    trainingData.forEach(data => {
      const trajectoryWeight = this.calculateTrainingDataWeight(data);
      weightMap[data.narrativeOutcome] = (weightMap[data.narrativeOutcome] || 0) + trajectoryWeight;
    });

    return weightMap;
  }

  /**
   * Calculate Training Data Weight
   */
  private calculateTrainingDataWeight(data: NarrativeTrainingData): number {
    return (
      data.complexityMetrics.narrativeDepth * 0.3 +
      data.complexityMetrics.characterInterconnectedness * 0.3 +
      data.complexityMetrics.plotDynamism * 0.2 +
      data.complexityMetrics.thematicCoherence * 0.2
    );
  }

  /**
   * Calculate Historical Context Influence
   */
  private calculateHistoricalContextInfluence(
    historicalEvents: string[], 
    trajectory: string
  ): number {
    // Analyze historical events for trajectory-related patterns
    const relevantEventCount = historicalEvents.filter(event => 
      event.toLowerCase().includes(trajectory.toLowerCase())
    ).length;

    return 1 + (relevantEventCount * 0.1);
  }

  /**
   * Calculate Accuracy Score
   */
  private calculateAccuracyScore(): number {
    // Simulate accuracy calculation based on training data
    const accuracySimulation = this.trainingDataset.reduce((accuracy, data) => {
      // Simplified accuracy calculation
      return accuracy + Math.random() * 0.2;
    }, 0) / this.trainingDataset.length;

    return Math.min(accuracySimulation, 1);
  }

  /**
   * Calculate Prediction Variance
   */
  private calculatePredictionVariance(): number {
    // Calculate variance in prediction probabilities
    const probabilities = this.trainingDataset.map(data => 
      this.calculateTrainingDataWeight(data)
    );

    const mean = probabilities.reduce((a, b) => a + b, 0) / probabilities.length;
    const variance = probabilities.reduce((sum, prob) => sum + Math.pow(prob - mean, 2), 0) / probabilities.length;

    return variance;
  }

  /**
   * Assess Complexity Adaptability
   */
  private assessComplexityAdaptability(): number {
    // Evaluate model's ability to handle different complexity levels
    const complexityLevels = this.trainingDataset.map(data => 
      Object.values(data.complexityMetrics).reduce((a, b) => a + b, 0) / 4
    );

    const adaptabilityScore = complexityLevels.reduce((score, level) => {
      // Reward models that perform well across different complexity levels
      return score + (1 / (1 + Math.abs(0.5 - level)));
    }, 0) / complexityLevels.length;

    return adaptabilityScore;
  }
}

// Singleton instance for global use
export const NarrativePredictionModelInstance = new NarrativeMachineLearningPredictor();
