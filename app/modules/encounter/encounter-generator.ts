import { Character } from '../character/character-core';
import { Monster } from '../monsters';
import { EncounterComplexityAnalyzer, EncounterComplexityMetrics } from '../utils/encounter-complexity-analyzer';
import { NarrativeGenerator } from '../utils/narrative-generator';
import { PredictiveEncounterDesigner } from '../utils/predictive-encounter-design';

export interface EncounterEnvironment {
  terrain: 'forest' | 'mountain' | 'urban' | 'dungeon' | 'plains';
  lightingConditions: 'bright' | 'dim' | 'darkness';
  weatherConditions?: 'clear' | 'rain' | 'snow' | 'storm';
}

export interface Encounter {
  id: string;
  name: string;
  monsters: Monster[];
  characters: Character[];
  environment: EncounterEnvironment;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Deadly';
  narrative: {
    setup: string;
    potentialOutcomes: string[];
  };
  complexityMetrics?: EncounterComplexityMetrics;
  tacticalOpportunities: string[];
}

export class EncounterGenerator {
  /**
   * Generate a comprehensive encounter
   * @param characters Player characters
   * @param options Encounter generation options
   * @returns Fully generated encounter
   */
  static generateEncounter(
    characters: Character[], 
    options: Partial<Encounter> = {}
  ): Encounter {
    const baseEnvironment = this.generateEnvironment();
    const monsters = this.generateMonsters(characters);
    const difficulty = this.determineDifficulty(characters, monsters);

    const encounter: Encounter = {
      id: crypto.randomUUID(),
      name: this.generateEncounterName(baseEnvironment),
      monsters,
      characters,
      environment: baseEnvironment,
      difficulty,
      narrative: this.generateEncounterNarrative(characters, monsters, baseEnvironment),
      ...options
    };

    // Analyze encounter complexity
    encounter.complexityMetrics = EncounterComplexityAnalyzer.analyzeEncounterComplexity(
      encounter, 
      characters
    );

    // Generate tactical opportunities
    encounter.tacticalOpportunities = this.identifyTacticalOpportunities(encounter);

    return encounter;
  }

  /**
   * Generate a random encounter environment
   * @returns Generated environment
   */
  private static generateEnvironment(): EncounterEnvironment {
    const terrainTypes: EncounterEnvironment['terrain'][] = [
      'forest', 'mountain', 'urban', 'dungeon', 'plains'
    ];

    const lightingConditions: EncounterEnvironment['lightingConditions'][] = [
      'bright', 'dim', 'darkness'
    ];

    const weatherConditions: EncounterEnvironment['weatherConditions'][] = [
      'clear', 'rain', 'snow', 'storm'
    ];

    return {
      terrain: terrainTypes[Math.floor(Math.random() * terrainTypes.length)],
      lightingConditions: lightingConditions[Math.floor(Math.random() * lightingConditions.length)],
      weatherConditions: weatherConditions[Math.floor(Math.random() * weatherConditions.length)]
    };
  }

  /**
   * Generate monsters appropriate for character party
   * @param characters Player characters
   * @returns Generated monsters
   */
  private static generateMonsters(characters: Character[]): Monster[] {
    // Use Predictive Encounter Designer to generate appropriate monsters
    return PredictiveEncounterDesigner.generateMonsters({
      partyLevel: this.calculateAveragePartyLevel(characters),
      partySize: characters.length
    });
  }

  /**
   * Calculate average party level
   * @param characters Player characters
   * @returns Average party level
   */
  private static calculateAveragePartyLevel(characters: Character[]): number {
    return characters.reduce((sum, char) => sum + char.progression.level, 0) / characters.length;
  }

  /**
   * Determine encounter difficulty
   * @param characters Player characters
   * @param monsters Encounter monsters
   * @returns Encounter difficulty
   */
  private static determineDifficulty(
    characters: Character[], 
    monsters: Monster[]
  ): Encounter['difficulty'] {
    const partyLevel = this.calculateAveragePartyLevel(characters);
    const totalMonsterCR = monsters.reduce((sum, monster) => sum + monster.challengeRating, 0);
    
    const difficultyRatio = totalMonsterCR / (partyLevel * characters.length);

    if (difficultyRatio < 0.5) return 'Easy';
    if (difficultyRatio < 1) return 'Medium';
    if (difficultyRatio < 1.5) return 'Hard';
    return 'Deadly';
  }

  /**
   * Generate encounter name based on environment
   * @param environment Encounter environment
   * @returns Generated encounter name
   */
  private static generateEncounterName(environment: EncounterEnvironment): string {
    const encounterNameTemplates = [
      `${environment.terrain.charAt(0).toUpperCase() + environment.terrain.slice(1)} Ambush`,
      `${environment.lightingConditions.charAt(0).toUpperCase() + environment.lightingConditions.slice(1)} Confrontation`,
      `Unexpected Encounter in the ${environment.terrain}`
    ];

    return encounterNameTemplates[Math.floor(Math.random() * encounterNameTemplates.length)];
  }

  /**
   * Generate encounter narrative
   * @param characters Player characters
   * @param monsters Encounter monsters
   * @param environment Encounter environment
   * @returns Generated narrative
   */
  private static generateEncounterNarrative(
    characters: Character[], 
    monsters: Monster[], 
    environment: EncounterEnvironment
  ): Encounter['narrative'] {
    const narrative = NarrativeGenerator.generateNarrative({
      characters,
      monsters,
      terrain: environment.terrain,
      lightingConditions: environment.lightingConditions
    });

    return {
      setup: narrative.setup,
      potentialOutcomes: narrative.potentialOutcomes
    };
  }

  /**
   * Identify tactical opportunities in the encounter
   * @param encounter Generated encounter
   * @returns Array of tactical opportunities
   */
  private static identifyTacticalOpportunities(encounter: Encounter): string[] {
    const environmentTactics = {
      'forest': [
        'Use trees for cover',
        'Utilize difficult terrain',
        'Potential for stealth approaches'
      ],
      'mountain': [
        'High ground advantage',
        'Rock-based terrain obstacles',
        'Potential for ranged combat superiority'
      ],
      'urban': [
        'Use buildings for cover',
        'Narrow street tactical positioning',
        'Potential civilian interaction'
      ]
    };

    const environmentSpecificTactics = environmentTactics[encounter.environment.terrain] || [];
    
    const generalTactics = [
      'Flank enemy positions',
      'Utilize choke points',
      'Coordinate spell and melee attacks'
    ];

    return [
      ...environmentSpecificTactics,
      ...generalTactics
    ];
  }
}
