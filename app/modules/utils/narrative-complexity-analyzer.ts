import { Campaign } from '../campaigns';
import { Character } from '../characters';
import { Encounter } from '../encounters';

export interface NarrativeComplexityMetrics {
  narrativeDepth: number;
  characterInterconnectedness: number;
  plotDynamism: number;
  thematicCoherence: number;
}

export class NarrativeComplexityAnalyzer {
  /**
   * Analyze Narrative Complexity
   */
  static analyzeNarrativeComplexity(
    campaign: Campaign, 
    characters: Character[]
  ): NarrativeComplexityMetrics {
    const narrativeDepth = this.calculateNarrativeDepth(campaign);
    const characterInterconnectedness = this.assessCharacterInterconnections(characters);
    const plotDynamism = this.evaluatePlotDynamism(campaign);
    const thematicCoherence = this.measureThematicCoherence(campaign);

    return {
      narrativeDepth,
      characterInterconnectedness,
      plotDynamism,
      thematicCoherence
    };
  }

  /**
   * Calculate Narrative Depth
   */
  private static calculateNarrativeDepth(campaign: Campaign): number {
    const worldHistoryDepth = campaign.worldHistory.length;
    const majorEventCount = campaign.worldHistory.filter(
      event => event.includes('[MAJOR EVENT]')
    ).length;

    return (worldHistoryDepth + majorEventCount * 2) / 10;
  }

  /**
   * Assess Character Interconnections
   */
  private static assessCharacterInterconnections(characters: Character[]): number {
    const relationshipComplexity = characters.reduce((total, character) => {
      const relationshipScore = character.relationships.length * 0.5;
      const multiclassComplexity = character.classes.length > 1 ? 0.3 : 0;
      
      return total + relationshipScore + multiclassComplexity;
    }, 0);

    return relationshipComplexity / characters.length;
  }

  /**
   * Evaluate Plot Dynamism
   */
  private static evaluatePlotDynamism(campaign: Campaign): number {
    const plotTwistCount = campaign.worldHistory.filter(
      event => event.includes('[PLOT TWIST]')
    ).length;

    const narrativeShiftCount = campaign.worldHistory.filter(
      event => event.includes('[NARRATIVE SHIFT]')
    ).length;

    return (plotTwistCount + narrativeShiftCount * 1.5) / 10;
  }

  /**
   * Measure Thematic Coherence
   */
  private static measureThematicCoherence(campaign: Campaign): number {
    const thematicElements = [
      campaign.setting.primaryConflict,
      campaign.setting.type,
      ...campaign.worldHistory.slice(-5)
    ];

    const uniqueThemes = new Set(thematicElements);
    return 1 - (uniqueThemes.size / thematicElements.length);
  }

  /**
   * Generate Narrative Complexity Insights
   */
  static generateNarrativeInsights(
    campaign: Campaign, 
    characters: Character[]
  ): string[] {
    const complexityMetrics = this.analyzeNarrativeComplexity(campaign, characters);
    const insights: string[] = [];

    if (complexityMetrics.narrativeDepth > 0.7) {
      insights.push("The campaign narrative has reached a profound depth of storytelling.");
    }

    if (complexityMetrics.characterInterconnectedness > 0.6) {
      insights.push("Characters are deeply interconnected, creating a rich narrative tapestry.");
    }

    if (complexityMetrics.plotDynamism > 0.5) {
      insights.push("The plot demonstrates significant dynamism and unexpected turns.");
    }

    if (complexityMetrics.thematicCoherence > 0.8) {
      insights.push("The campaign maintains a strong thematic consistency.");
    }

    return insights;
  }

  /**
   * Suggest Narrative Progression Strategies
   */
  static suggestNarrativeProgressionStrategies(
    campaign: Campaign, 
    characters: Character[]
  ): string[] {
    const complexityMetrics = this.analyzeNarrativeComplexity(campaign, characters);
    const strategies: string[] = [];

    if (complexityMetrics.narrativeDepth < 0.3) {
      strategies.push("Introduce more significant world-building events");
      strategies.push("Develop deeper backstories for key NPCs");
    }

    if (complexityMetrics.characterInterconnectedness < 0.4) {
      strategies.push("Create more character interaction opportunities");
      strategies.push("Develop interconnected character backstories");
    }

    if (complexityMetrics.plotDynamism < 0.3) {
      strategies.push("Introduce unexpected plot twists");
      strategies.push("Create more dynamic encounter scenarios");
    }

    if (complexityMetrics.thematicCoherence < 0.5) {
      strategies.push("Refine the campaign's core thematic elements");
      strategies.push("Align character arcs with the campaign's central theme");
    }

    return strategies;
  }
}
