import { Campaign } from '../campaigns';
import { Character } from '../characters';
import { Encounter } from '../encounters';
import { EncounterComplexityAnalyzer } from './encounter-complexity-analyzer';

export interface DifficultyAdjustmentParameters {
  campaign: Campaign;
  characters: Character[];
  currentEncounter: Encounter;
}

export class AdaptiveDifficultySystem {
  /**
   * Dynamically Adjust Encounter Difficulty
   */
  static adjustEncounterDifficulty(
    params: DifficultyAdjustmentParameters
  ): Encounter {
    const complexityMetrics = EncounterComplexityAnalyzer.analyzeEncounterComplexity(
      params.currentEncounter, 
      params.characters
    );

    // Adjust based on campaign progression and player performance
    const campaignMomentum = this.calculateCampaignMomentum(params.campaign);
    const playerPerformance = this.assessPlayerPerformance(params.characters);

    // Difficulty Scaling Mechanism
    const difficultyScalingFactors = [
      this.scaleMonsterAttributes(params.currentEncounter, complexityMetrics),
      this.modifyEncounterEnvironment(params.currentEncounter, campaignMomentum),
      this.adjustMonsterTactics(params.currentEncounter, playerPerformance)
    ];

    return params.currentEncounter;
  }

  /**
   * Calculate Campaign Momentum
   */
  private static calculateCampaignMomentum(campaign: Campaign): number {
    const xpProgressFactor = campaign.xpTracker.totalXP / 
      (campaign.xpTracker.xpThresholds[campaign.metadata.averagePartyLevel + 1] || 1);
    
    const sessionsProgressFactor = campaign.metadata.sessionsPlayed / 10;
    const characterProgressFactor = campaign.characters.reduce(
      (sum, char) => sum + (char.level / 20), 
      0
    ) / campaign.characters.length;

    return (xpProgressFactor + sessionsProgressFactor + characterProgressFactor) / 3;
  }

  /**
   * Assess Player Performance
   */
  private static assessPlayerPerformance(characters: Character[]): number {
    const performanceMetrics = characters.map(character => {
      const skillPerformance = Object.values(character.skills)
        .reduce((sum, skillLevel) => sum + skillLevel, 0) / 10;
      
      const combatEffectiveness = (character.baseAttackBonus + character.level) / 20;
      
      return (skillPerformance + combatEffectiveness) / 2;
    });

    return performanceMetrics.reduce((sum, metric) => sum + metric, 0) / performanceMetrics.length;
  }

  /**
   * Scale Monster Attributes
   */
  private static scaleMonsterAttributes(
    encounter: Encounter, 
    complexityMetrics: ReturnType<typeof EncounterComplexityAnalyzer.analyzeEncounterComplexity>
  ): Encounter {
    encounter.monsters = encounter.monsters.map(monster => {
      const scaleFactor = this.calculateScaleFactor(complexityMetrics.difficultyLevel);
      
      return {
        ...monster,
        hitPoints: Math.round(monster.hitPoints * scaleFactor),
        armorClass: Math.round(monster.armorClass * scaleFactor),
        attackBonus: Math.round(monster.attackBonus * scaleFactor)
      };
    });

    return encounter;
  }

  /**
   * Calculate Scale Factor
   */
  private static calculateScaleFactor(difficultyLevel: string): number {
    const scaleFactors = {
      'Easy': 0.8,
      'Medium': 1,
      'Hard': 1.2,
      'Deadly': 1.5
    };

    return scaleFactors[difficultyLevel] || 1;
  }

  /**
   * Modify Encounter Environment
   */
  private static modifyEncounterEnvironment(
    encounter: Encounter, 
    campaignMomentum: number
  ): Encounter {
    const environmentModifiers = [
      () => this.adjustTerrainComplexity(encounter, campaignMomentum),
      () => this.introduceDynamicEnvironmentalElements(encounter),
      () => this.modifyLightingConditions(encounter)
    ];

    const selectedModifier = environmentModifiers[
      Math.floor(Math.random() * environmentModifiers.length)
    ];

    return selectedModifier();
  }

  /**
   * Adjust Terrain Complexity
   */
  private static adjustTerrainComplexity(
    encounter: Encounter, 
    campaignMomentum: number
  ): Encounter {
    const terrainComplexityMap = {
      'forest': ['dense undergrowth', 'fallen trees', 'uneven ground'],
      'mountain': ['steep cliffs', 'loose rocks', 'narrow paths'],
      'underground': ['narrow passages', 'unstable cavern', 'multiple levels'],
      'urban': ['complex architecture', 'multiple elevation levels', 'narrow streets']
    };

    if (campaignMomentum > 0.7) {
      const complexityOptions = terrainComplexityMap[encounter.terrain] || [];
      encounter.terrainComplexity = complexityOptions[
        Math.floor(Math.random() * complexityOptions.length)
      ];
    }

    return encounter;
  }

  /**
   * Introduce Dynamic Environmental Elements
   */
  private static introduceDynamicEnvironmentalElements(encounter: Encounter): Encounter {
    const dynamicElements = [
      'Falling debris',
      'Magical energy fluctuations',
      'Sudden weather changes',
      'Collapsing structures'
    ];

    if (Math.random() > 0.6) {
      encounter.dynamicEnvironmentalElements = dynamicElements[
        Math.floor(Math.random() * dynamicElements.length)
      ];
    }

    return encounter;
  }

  /**
   * Modify Lighting Conditions
   */
  private static modifyLightingConditions(encounter: Encounter): Encounter {
    const lightingOptions = ['bright', 'dim', 'darkness'];
    encounter.lightingConditions = lightingOptions[
      Math.floor(Math.random() * lightingOptions.length)
    ];

    return encounter;
  }

  /**
   * Adjust Monster Tactics
   */
  private static adjustMonsterTactics(
    encounter: Encounter, 
    playerPerformance: number
  ): Encounter {
    if (playerPerformance > 0.7) {
      encounter.monsters = encounter.monsters.map(monster => ({
        ...monster,
        tacticalApproach: this.selectAdvancedTactics()
      }));
    }

    return encounter;
  }

  /**
   * Select Advanced Tactical Approaches
   */
  private static selectAdvancedTactics(): string {
    const tacticalApproaches = [
      'Coordinated Assault',
      'Defensive Positioning',
      'Targeted Elimination',
      'Adaptive Strategy'
    ];

    return tacticalApproaches[
      Math.floor(Math.random() * tacticalApproaches.length)
    ];
  }
}
