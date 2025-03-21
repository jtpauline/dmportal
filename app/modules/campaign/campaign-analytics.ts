import { Campaign } from './campaign-core';
import { Character } from '../character/character-core';
import { Encounter } from '../encounter/encounter-generator';

export interface CampaignAnalyticsReport {
  overallCampaignHealth: {
    progressRate: number;
    engagementLevel: number;
  };
  characterPerformance: Array<{
    characterId: string;
    contributionScore: number;
    specialtyEffectiveness: Record<string, number>;
  }>;
  encounterAnalytics: {
    totalEncounters: number;
    encounterTypeDistribution: Record<string, number>;
    averageDifficulty: number;
  };
}

export class CampaignAnalytics {
  generateComprehensiveCampaignReport(campaign: Campaign): CampaignAnalyticsReport {
    return {
      overallCampaignHealth: this.calculateCampaignHealth(campaign),
      characterPerformance: this.analyzeCharacterPerformance(campaign.characters),
      encounterAnalytics: this.processEncounterStatistics(campaign.encounters)
    };
  }

  private calculateCampaignHealth(campaign: Campaign) {
    const progressRate = campaign.progressionData.completedEncounters / 
      (campaign.encounters.length || 1);
    
    const engagementLevel = this.calculateEngagementMetric(campaign);

    return {
      progressRate,
      engagementLevel
    };
  }

  private calculateEngagementMetric(campaign: Campaign): number {
    // Complex calculation considering narrative progression, character development, etc.
    return 0.75; // Placeholder
  }

  private analyzeCharacterPerformance(characters: Character[]) {
    return characters.map(character => ({
      characterId: character.id,
      contributionScore: this.calculateContributionScore(character),
      specialtyEffectiveness: this.assessSpecialtyEffectiveness(character)
    }));
  }

  private calculateContributionScore(character: Character): number {
    // Placeholder for complex contribution scoring
    return character.level * 0.5;
  }

  private assessSpecialtyEffectiveness(character: Character) {
    // Placeholder for analyzing character class and multiclass effectiveness
    return {
      primaryClass: 0.8,
      secondaryClasses: 0.4
    };
  }

  private processEncounterStatistics(encounters: Encounter[]) {
    const difficultyMap = {
      'Easy': 1,
      'Medium': 2,
      'Hard': 3,
      'Deadly': 4
    };

    const encounterTypeDistribution = encounters.reduce((acc, encounter) => {
      const type = this.determineEncounterType(encounter);
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const averageDifficulty = encounters.reduce((sum, encounter) => 
      sum + difficultyMap[encounter.difficulty], 0) / encounters.length;

    return {
      totalEncounters: encounters.length,
      encounterTypeDistribution,
      averageDifficulty
    };
  }

  private determineEncounterType(encounter: Encounter): string {
    // Logic to categorize encounters (combat, social, exploration, etc.)
    return encounter.monsters.length > 0 ? 'Combat' : 'Other';
  }
}
