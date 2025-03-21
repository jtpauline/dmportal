import { Campaign } from './campaign-core';
import { Character } from '../character/character-core';

export interface CampaignProgressionInsights {
  partyDevelopmentTrajectory: {
    levelProgression: number[];
    skillImprovement: Record<string, number>;
  };
  narrativeComplexity: {
    storyArcDevelopment: number;
    characterInterconnectedness: number;
  };
  challengeAdaptation: {
    encounterDifficultyProgression: number[];
    tacticalEvolution: number;
  };
}

export class CampaignProgressionSystem {
  analyzeCampaignTrajectory(campaign: Campaign): CampaignProgressionInsights {
    return {
      partyDevelopmentTrajectory: this.calculatePartyDevelopment(campaign.characters),
      narrativeComplexity: this.assessNarrativeComplexity(campaign),
      challengeAdaptation: this.evaluateChallengeAdaptation(campaign)
    };
  }

  private calculatePartyDevelopment(characters: Character[]) {
    return {
      levelProgression: characters.map(c => c.level),
      skillImprovement: this.aggregateSkillProgression(characters)
    };
  }

  private aggregateSkillProgression(characters: Character[]) {
    // Placeholder for skill progression tracking
    return {};
  }

  private assessNarrativeComplexity(campaign: Campaign) {
    return {
      storyArcDevelopment: campaign.narrativeContext.majorPlotPoints.length,
      characterInterconnectedness: this.calculateCharacterInterconnectedness(campaign)
    };
  }

  private calculateCharacterInterconnectedness(campaign: Campaign) {
    // Complex logic to determine how characters' backstories and interactions interweave
    return 0.7; // Placeholder
  }

  private evaluateChallengeAdaptation(campaign: Campaign) {
    return {
      encounterDifficultyProgression: campaign.encounters.map(e => 
        this.mapDifficultyToNumericValue(e.difficulty)
      ),
      tacticalEvolution: 0.6 // Placeholder for tactical complexity
    };
  }

  private mapDifficultyToNumericValue(difficulty: string): number {
    const difficultyMap = {
      'Easy': 1,
      'Medium': 2,
      'Hard': 3,
      'Deadly': 4
    };
    return difficultyMap[difficulty] || 2;
  }
}
