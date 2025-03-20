import { Campaign } from '../campaigns';
import { Character } from '../characters';
import { Encounter } from '../encounters';
import { NarrativeMachineLearningPredictor } from './narrative-machine-learning-predictor';

export class NarrativeInteractionMLPredictor {
  /**
   * Predict Narrative Interaction Outcome
   */
  static predictNarrativeInteraction(
    campaign: Campaign,
    characters: Character[],
    currentEncounter?: Encounter
  ): {
    predictedOutcome: string;
    confidenceScore: number;
    recommendedActions: string[];
    potentialRisks: string[];
  } {
    // Utilize the narrative prediction model
    const predictionContext = {
      campaign,
      characters,
      currentEncounter,
      historicalEvents: campaign.worldHistory
    };

    const narrativePrediction = NarrativePredictionModelInstance.predictNarrativeTrajectory(
      predictionContext
    );

    return {
      predictedOutcome: narrativePrediction.mostLikelyTrajectory,
      confidenceScore: narrativePrediction.predictionConfidence,
      recommendedActions: narrativePrediction.recommendedCharacterActions,
      potentialRisks: this.identifyPotentialRisks(
        narrativePrediction.mostLikelyTrajectory
      )
    };
  }

  /**
   * Train Narrative Interaction Model
   */
  static trainNarrativeInteractionModel(trainingData: any[]): void {
    // Convert training data to appropriate format
    const formattedTrainingData = trainingData.map(data => ({
      campaignType: data.campaignType,
      characterTypes: data.characters.map(c => c.class),
      narrativeOutcome: data.outcome,
      complexityMetrics: {
        narrativeDepth: data.narrativeDepth,
        characterInterconnectedness: data.characterInterconnectedness,
        plotDynamism: data.plotDynamism,
        thematicCoherence: data.thematicCoherence
      }
    }));

    // Train the model
    NarrativePredictionModelInstance.trainModel(formattedTrainingData);
  }

  /**
   * Evaluate Narrative Interaction Model Performance
   */
  static evaluateModelPerformance(): {
    accuracyScore: number;
    predictionVariance: number;
    complexityAdaptability: number;
  } {
    return NarrativePredictionModelInstance.evaluateModelPerformance();
  }

  /**
   * Identify Potential Risks
   */
  private static identifyPotentialRisks(narrativeTrajectory: string): string[] {
    const riskMap = {
      'Heroic Resolution': [
        'Potential collateral damage',
        'Unintended consequences of heroic actions'
      ],
      'Tragic Downfall': [
        'Severe character setbacks',
        'Potential party-wide negative impacts'
      ],
      'Unexpected Twist': [
        'Narrative unpredictability',
        'Potential strategic disadvantages'
      ],
      'Gradual Transformation': [
        'Slow progression risks',
        'Potential loss of initial character identity'
      ],
      'Moral Compromise': [
        'Ethical integrity challenges',
        'Long-term character development complications'
      ]
    };

    return riskMap[narrativeTrajectory] || [];
  }

  /**
   * Generate Narrative Interaction Insights
   */
  static generateNarrativeInteractionInsights(
    campaign: Campaign,
    characters: Character[]
  ): {
    narrativeComplexityScore: number;
    potentialNarrativeTrajectories: string[];
    characterInteractionDynamics: string[];
  } {
    const predictionContext = {
      campaign,
      characters,
      historicalEvents: campaign.worldHistory
    };

    const narrativePrediction = NarrativePredictionModelInstance.predictNarrativeTrajectory(
      predictionContext
    );

    return {
      narrativeComplexityScore: narrativePrediction.predictionConfidence,
      potentialNarrativeTrajectories: [
        narrativePrediction.mostLikelyTrajectory,
        ...narrativePrediction.potentialAlternativeTrajectories
      ],
      characterInteractionDynamics: narrativePrediction.recommendedCharacterActions
    };
  }
}
