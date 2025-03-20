import { Character } from '../characters';
import { Monster } from '../monsters';
import { Encounter } from '../encounters';

export interface EncounterComplexityMetrics {
  challengeRating: number;
  difficultyLevel: 'Easy' | 'Medium' | 'Hard' | 'Deadly';
  tacticalComplexity: number;
  environmentalImpact: number;
}

export class EncounterComplexityAnalyzer {
  /**
   * Analyze Encounter Complexity
   */
  static analyzeEncounterComplexity(
    encounter: Encounter, 
    characters: Character[]
  ): EncounterComplexityMetrics {
    const challengeRating = this.calculateChallengeRating(encounter.monsters, characters);
    const difficultyLevel = this.determineDifficultyLevel(challengeRating, characters);
    const tacticalComplexity = this.calculateTacticalComplexity(encounter);
    const environmentalImpact = this.assessEnvironmentalImpact(encounter);

    return {
      challengeRating,
      difficultyLevel,
      tacticalComplexity,
      environmentalImpact
    };
  }

  /**
   * Calculate Challenge Rating
   */
  private static calculateChallengeRating(
    monsters: Monster[], 
    characters: Character[]
  ): number {
    const averageCharacterLevel = characters.reduce((sum, char) => sum + char.level, 0) / characters.length;
    const monsterThreatLevels = monsters.map(monster => 
      monster.challengeRating || this.estimateMonsterThreat(monster)
    );

    const totalMonsterThreat = monsterThreatLevels.reduce((sum, threat) => sum + threat, 0);
    const adjustedChallengeRating = totalMonsterThreat / monsterThreatLevels.length;

    return Math.max(
      adjustedChallengeRating, 
      averageCharacterLevel * 0.8
    );
  }

  /**
   * Estimate Monster Threat Level
   */
  private static estimateMonsterThreat(monster: Monster): number {
    const threatFactors = [
      monster.hitPoints / 10,
      monster.armorClass / 2,
      monster.attackBonus / 3
    ];

    return threatFactors.reduce((sum, factor) => sum + factor, 0) / 3;
  }

  /**
   * Determine Difficulty Level
   */
  private static determineDifficultyLevel(
    challengeRating: number, 
    characters: Character[]
  ): 'Easy' | 'Medium' | 'Hard' | 'Deadly' {
    const averageCharacterLevel = characters.reduce((sum, char) => sum + char.level, 0) / characters.length;
    const difficultyRatio = challengeRating / averageCharacterLevel;

    if (difficultyRatio < 0.5) return 'Easy';
    if (difficultyRatio < 1) return 'Medium';
    if (difficultyRatio < 1.5) return 'Hard';
    return 'Deadly';
  }

  /**
   * Calculate Tactical Complexity
   */
  private static calculateTacticalComplexity(encounter: Encounter): number {
    const complexityFactors = [
      this.assessMonsterAbilities(encounter.monsters),
      this.evaluateTerrainTactics(encounter),
      this.analyzeMonsterCoordination(encounter.monsters)
    ];

    return complexityFactors.reduce((sum, factor) => sum + factor, 0) / complexityFactors.length;
  }

  /**
   * Assess Monster Special Abilities
   */
  private static assessMonsterAbilities(monsters: Monster[]): number {
    const abilityComplexity = monsters.map(monster => 
      monster.specialAbilities ? monster.specialAbilities.length * 0.5 : 0
    );

    return abilityComplexity.reduce((sum, complexity) => sum + complexity, 0) / monsters.length;
  }

  /**
   * Evaluate Terrain Tactical Opportunities
   */
  private static evaluateTerrainTactics(encounter: Encounter): number {
    const terrainTacticalFactors = {
      'forest': 0.7,
      'mountain': 0.6,
      'underground': 0.8,
      'urban': 0.9
    };

    return terrainTacticalFactors[encounter.terrain] || 0.5;
  }

  /**
   * Analyze Monster Coordination
   */
  private static analyzeMonsterCoordination(monsters: Monster[]): number {
    if (monsters.length <= 1) return 0;

    const coordinationFactors = [
      this.checkMonsterTypeCoordination(monsters),
      this.assessGroupTactics(monsters)
    ];

    return coordinationFactors.reduce((sum, factor) => sum + factor, 0) / coordinationFactors.length;
  }

  /**
   * Check Monster Type Coordination
   */
  private static checkMonsterTypeCoordination(monsters: Monster[]): number {
    const uniqueMonsterTypes = new Set(monsters.map(m => m.type));
    return uniqueMonsterTypes.size === 1 ? 0.8 : 0.3;
  }

  /**
   * Assess Group Tactics
   */
  private static assessGroupTactics(monsters: Monster[]): number {
    const tacticalFormations = [
      'Flanking Strategy',
      'Defensive Formation',
      'Ranged Support',
      'Ambush Tactics'
    ];

    return Math.random() > 0.5 ? 0.7 : 0.2;
  }

  /**
   * Assess Environmental Impact
   */
  private static assessEnvironmentalImpact(encounter: Encounter): number {
    const environmentalFactors = [
      this.evaluateTerrainDifficulty(encounter.terrain),
      this.checkEnvironmentalHazards(encounter),
      this.assessLightingConditions(encounter)
    ];

    return environmentalFactors.reduce((sum, factor) => sum + factor, 0) / environmentalFactors.length;
  }

  /**
   * Evaluate Terrain Difficulty
   */
  private static evaluateTerrainDifficulty(terrain: string): number {
    const terrainDifficulty = {
      'forest': 0.6,
      'mountain': 0.7,
      'underground': 0.8,
      'urban': 0.5
    };

    return terrainDifficulty[terrain] || 0.4;
  }

  /**
   * Check Environmental Hazards
   */
  private static checkEnvironmentalHazards(encounter: Encounter): number {
    const hazardTypes = [
      'Difficult Terrain',
      'Falling Rocks',
      'Unstable Ground',
      'Magical Interference'
    ];

    return Math.random() > 0.7 ? 0.6 : 0.2;
  }

  /**
   * Assess Lighting Conditions
   */
  private static assessLightingConditions(encounter: Encounter): number {
    const lightingFactors = {
      'bright': 0.2,
      'dim': 0.5,
      'darkness': 0.8
    };

    return lightingFactors[encounter.lightingConditions] || 0.4;
  }
}
