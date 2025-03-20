import { Character } from '../characters';
import { Monster } from '../monsters';
import { RandomGenerator } from './random-generator';

export interface DynamicEnvironmentalContext {
  terrain: string;
  weatherConditions: string[];
  timeOfDay: 'day' | 'night' | 'twilight';
  magicalAnomalies: string[];
  terrainFeatures: string[];
  environmentalInteractions: {
    magical: string[];
    physical: string[];
    tactical: string[];
  };
}

export class AdvancedDynamicEnvironmentalContextAnalyzer {
  // Enhanced terrain-specific generation tables
  private static terrainContextGenerators = {
    'forest': {
      weatherConditions: [
        'light rain', 'misty', 'dense foliage', 'filtered sunlight', 
        'wind-swept canopy', 'sudden forest mist'
      ],
      magicalAnomalies: [
        'nature spirit presence', 'druidic energy flow', 'ancient tree resonance',
        'fey realm intersection', 'primordial magic convergence'
      ],
      terrainFeatures: [
        'dense undergrowth', 'fallen logs', 'natural clearings', 'moss-covered stones',
        'ancient tree roots', 'hidden forest glades', 'magical mushroom circles'
      ],
      environmentalInteractions: {
        magical: ['nature magic amplification', 'spirit realm proximity'],
        physical: ['difficult terrain', 'natural cover'],
        tactical: ['concealment opportunities', 'terrain-based movement advantages']
      }
    },
    'mountain': {
      weatherConditions: [
        'high winds', 'thin air', 'rocky terrain', 'sudden temperature changes',
        'alpine storm', 'mountain mist', 'rock avalanche potential'
      ],
      magicalAnomalies: [
        'elemental convergence', 'mountain spirit interference', 
        'altitude-based magical distortion', 'elemental plane bleeding',
        'geological magical resonance'
      ],
      terrainFeatures: [
        'steep cliffs', 'narrow passes', 'rocky outcroppings', 'hidden caves',
        'mountain peaks', 'unstable terrain', 'natural rock formations'
      ],
      environmentalInteractions: {
        magical: ['elemental magic enhancement', 'altitude magic distortion'],
        physical: ['vertical terrain challenges', 'limited movement'],
        tactical: ['high ground advantage', 'natural choke points']
      }
    }
  };

  /**
   * Generate advanced dynamic environmental context
   * @param baseTerrain Base terrain type
   * @param characters Characters in the environment
   * @param monsters Monsters in the environment
   * @returns Dynamically generated advanced environmental context
   */
  static generateAdvancedDynamicContext(
    baseTerrain: string,
    characters: Character[],
    monsters: Monster[]
  ): DynamicEnvironmentalContext {
    const terrainGenerator = 
      this.terrainContextGenerators[baseTerrain.toLowerCase()] || 
      this.terrainContextGenerators['forest'];

    // Advanced time of day determination
    const timeOfDay = this.determineAdvancedTimeOfDay(characters, monsters);

    return {
      terrain: baseTerrain,
      weatherConditions: this.generateEnhancedWeatherConditions(terrainGenerator),
      timeOfDay,
      magicalAnomalies: this.generateAdvancedMagicalAnomalies(
        terrainGenerator, 
        characters, 
        monsters
      ),
      terrainFeatures: this.generateDetailedTerrainFeatures(terrainGenerator),
      environmentalInteractions: this.generateEnvironmentalInteractions(
        terrainGenerator,
        characters,
        monsters
      )
    };
  }

  /**
   * Advanced time of day determination
   * @param characters Characters in the environment
   * @param monsters Monsters in the environment
   * @returns Advanced time of day
   */
  private static determineAdvancedTimeOfDay(
    characters: Character[], 
    monsters: Monster[]
  ): DynamicEnvironmentalContext['timeOfDay'] {
    const nightCreatures = monsters.filter(monster => 
      monster.traits?.includes('nocturnal')
    );

    const characterNightPreference = characters.some(character => 
      character.traits?.includes('night-vision')
    );

    const magicalCharacters = characters.filter(character => 
      ['Wizard', 'Warlock', 'Sorcerer'].includes(character.class)
    );

    if (nightCreatures.length > characters.length / 2) return 'night';
    if (characterNightPreference && magicalCharacters.length > 0) return 'twilight';
    return 'day';
  }

  /**
   * Generate enhanced weather conditions
   * @param terrainGenerator Terrain-specific context generator
   * @returns Array of enhanced weather conditions
   */
  private static generateEnhancedWeatherConditions(
    terrainGenerator: any
  ): string[] {
    return RandomGenerator.selectUniqueFromArray(
      terrainGenerator.weatherConditions, 
      3
    );
  }

  /**
   * Generate advanced magical anomalies
   * @param terrainGenerator Terrain-specific context generator
   * @param characters Characters in the environment
   * @param monsters Monsters in the environment
   * @returns Array of advanced magical anomalies
   */
  private static generateAdvancedMagicalAnomalies(
    terrainGenerator: any,
    characters: Character[],
    monsters: Monster[]
  ): string[] {
    const magicalCharacters = characters.filter(character => 
      ['Wizard', 'Sorcerer', 'Warlock'].includes(character.class)
    );

    const magicalMonsters = monsters.filter(monster => 
      monster.traits?.includes('magical-origin')
    );

    const baseAnomalies = RandomGenerator.selectUniqueFromArray(
      terrainGenerator.magicalAnomalies, 
      2
    );

    if (magicalCharacters.length > 1 || magicalMonsters.length > 0) {
      baseAnomalies.push('heightened magical interference');
      baseAnomalies.push('dimensional instability');
    }

    return baseAnomalies;
  }

  /**
   * Generate detailed terrain features
   * @param terrainGenerator Terrain-specific context generator
   * @returns Array of detailed terrain features
   */
  private static generateDetailedTerrainFeatures(
    terrainGenerator: any
  ): string[] {
    return RandomGenerator.selectUniqueFromArray(
      terrainGenerator.terrainFeatures, 
      4
    );
  }

  /**
   * Generate environmental interactions
   * @param terrainGenerator Terrain-specific context generator
   * @param characters Characters in the environment
   * @param monsters Monsters in the environment
   * @returns Environmental interactions
   */
  private static generateEnvironmentalInteractions(
    terrainGenerator: any,
    characters: Character[],
    monsters: Monster[]
  ): DynamicEnvironmentalContext['environmentalInteractions'] {
    const baseInteractions = terrainGenerator.environmentalInteractions;
    
    // Additional interactions based on characters and monsters
    const magicalCharacters = characters.filter(character => 
      ['Wizard', 'Sorcerer', 'Warlock'].includes(character.class)
    );

    const additionalMagicalInteractions = magicalCharacters.length > 0 
      ? ['magical energy resonance', 'arcane field manipulation'] 
      : [];

    return {
      magical: [
        ...baseInteractions.magical,
        ...additionalMagicalInteractions
      ],
      physical: baseInteractions.physical,
      tactical: baseInteractions.tactical
    };
  }
}
