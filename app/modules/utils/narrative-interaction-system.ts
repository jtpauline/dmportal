import { Campaign } from '../campaigns';
import { Character } from '../characters';
import { Encounter } from '../encounters';
import { NarrativeComplexityAnalyzer } from './narrative-complexity-analyzer';
import { CharacterNarrativeSystem } from './character-narrative-system';
import { WorldProgressionSystem } from './world-progression-system';

export interface NarrativeInteractionContext {
  campaign: Campaign;
  characters: Character[];
  currentEncounter?: Encounter;
}

export interface NarrativeInteractionResult {
  narrativeOutcome: string;
  characterImpacts: Array<{
    characterId: string;
    impact: number;
    description: string;
  }>;
  worldStateChanges: string[];
}

export class NarrativeInteractionSystem {
  /**
   * Generate Narrative Interaction Outcome
   */
  static generateNarrativeInteraction(
    context: NarrativeInteractionContext
  ): NarrativeInteractionResult {
    // Analyze narrative complexity
    const complexityMetrics = NarrativeComplexityAnalyzer.analyzeNarrativeComplexity(
      context.campaign, 
      context.characters
    );

    // Generate narrative interaction based on complexity
    const interactionOutcome = this.determineNarrativeInteractionOutcome(
      context, 
      complexityMetrics
    );

    // Apply character and world impacts
    const characterImpacts = this.processCharacterImpacts(
      context.characters, 
      interactionOutcome
    );

    const worldStateChanges = this.generateWorldStateChanges(
      context.campaign, 
      interactionOutcome
    );

    return {
      narrativeOutcome: interactionOutcome,
      characterImpacts,
      worldStateChanges
    };
  }

  /**
   * Determine Narrative Interaction Outcome
   */
  private static determineNarrativeInteractionOutcome(
    context: NarrativeInteractionContext,
    complexityMetrics: any
  ): string {
    const interactionTemplates = [
      // Low complexity scenarios
      {
        condition: complexityMetrics.narrativeDepth < 0.3,
        templates: [
          'A simple encounter reveals unexpected potential',
          'A minor conflict hints at larger underlying tensions',
          'A routine interaction takes an unexpected turn'
        ]
      },
      // Medium complexity scenarios
      {
        condition: complexityMetrics.narrativeDepth >= 0.3 && complexityMetrics.narrativeDepth < 0.7,
        templates: [
          'A complex interpersonal dynamic emerges',
          'Hidden motivations begin to surface',
          'Conflicting character goals create narrative tension'
        ]
      },
      // High complexity scenarios
      {
        condition: complexityMetrics.narrativeDepth >= 0.7,
        templates: [
          'A profound narrative revelation transforms the campaign',
          'Intricate plot threads converge in an unexpected manner',
          'Deep-seated conflicts reach a critical turning point'
        ]
      }
    ];

    // Select appropriate template based on narrative complexity
    const applicableTemplates = interactionTemplates
      .find(template => template.condition)?.templates || [];

    return applicableTemplates[
      Math.floor(Math.random() * applicableTemplates.length)
    ];
  }

  /**
   * Process Character Impacts
   */
  private static processCharacterImpacts(
    characters: Character[], 
    interactionOutcome: string
  ): Array<{
    characterId: string;
    impact: number;
    description: string;
  }> {
    return characters.map(character => {
      // Generate personal narrative event
      const narrativeEvent = CharacterNarrativeSystem.generatePersonalNarrativeEvent(
        character, 
        {} as Campaign  // Temporary placeholder
      );

      // Integrate narrative event
      CharacterNarrativeSystem.integrateNarrativeEvent(character, narrativeEvent);

      return {
        characterId: character.id,
        impact: narrativeEvent.impact,
        description: narrativeEvent.description
      };
    });
  }

  /**
   * Generate World State Changes
   */
  private static generateWorldStateChanges(
    campaign: Campaign, 
    interactionOutcome: string
  ): string[] {
    // Generate world progression event
    const worldProgressionEvent = WorldProgressionSystem.generateWorldProgressionEvent(
      campaign, 
      campaign.characters
    );

    // Integrate world progression event
    WorldProgressionSystem.integrateWorldProgressionEvent(campaign, worldProgressionEvent);

    return [
      worldProgressionEvent.description,
      `Global impact: ${worldProgressionEvent.globalImpact.toFixed(2)}`
    ];
  }

  /**
   * Advanced Narrative Interaction Prediction
   */
  static predictNarrativeInteractionOutcome(
    context: NarrativeInteractionContext
  ): {
    probabilityOfPositiveOutcome: number;
    potentialNarrativeTrajectories: string[];
  } {
    const complexityMetrics = NarrativeComplexityAnalyzer.analyzeNarrativeComplexity(
      context.campaign, 
      context.characters
    );

    const characterInterconnectedness = complexityMetrics.characterInterconnectedness;
    const plotDynamism = complexityMetrics.plotDynamism;

    // Calculate probability of positive outcome
    const probabilityOfPositiveOutcome = (
      characterInterconnectedness * 0.6 + 
      plotDynamism * 0.4
    );

    // Generate potential narrative trajectories
    const potentialNarrativeTrajectories = [
      'Collaborative Resolution',
      'Unexpected Conflict Escalation',
      'Subtle Narrative Shift',
      'Dramatic Revelation'
    ];

    return {
      probabilityOfPositiveOutcome,
      potentialNarrativeTrajectories: potentialNarrativeTrajectories.slice(
        0, 
        Math.floor(probabilityOfPositiveOutcome * potentialNarrativeTrajectories.length)
      )
    };
  }

  /**
   * Narrative Interaction Complexity Scoring
   */
  static calculateNarrativeInteractionComplexity(
    context: NarrativeInteractionContext
  ): number {
    const complexityMetrics = NarrativeComplexityAnalyzer.analyzeNarrativeComplexity(
      context.campaign, 
      context.characters
    );

    return (
      complexityMetrics.narrativeDepth * 0.3 +
      complexityMetrics.characterInterconnectedness * 0.3 +
      complexityMetrics.plotDynamism * 0.2 +
      complexityMetrics.thematicCoherence * 0.2
    );
  }
}
