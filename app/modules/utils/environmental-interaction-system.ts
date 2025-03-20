import { Character } from '../characters';
import { Monster } from '../monsters';
import { RandomGenerator } from './random-generator';

export interface EnvironmentalInteractionContext {
  terrain: string;
  environmentalFactors: string[];
  characters: Character[];
  monsters: Monster[];
}

export interface EnvironmentalInteractionOutcome {
  description: string;
  mechanicalEffects: {
    characterAdvantages?: string[];
    monsterDisadvantages?: string[];
    terrainModifications?: string[];
  };
  potentialTactics: string[];
}

export class EnvironmentalInteractionSystem {
  /**
   * Generate comprehensive environmental interaction analysis
   * @param context Environmental interaction context
   * @returns Detailed environmental interaction outcome
   */
  static analyzeEnvironmentalInteractions(
    context: EnvironmentalInteractionContext
  ): EnvironmentalInteractionOutcome {
    const terrainType = context.terrain.toLowerCase();
    const environmentalFactors = context.environmentalFactors;

    // Terrain-specific interaction generation
    const terrainInteractions = this.generateTerrainInteractions(terrainType, context);
    
    // Environmental factor interactions
    const factorInteractions = this.generateEnvironmentalFactorInteractions(
      environmentalFactors, 
      context
    );

    // Combine and synthesize interactions
    return {
      description: this.generateEnvironmentalDescription(terrainType, environmentalFactors),
      mechanicalEffects: {
        characterAdvantages: terrainInteractions.characterAdvantages,
        monsterDisadvantages: terrainInteractions.monsterDisadvantages,
        terrainModifications: factorInteractions.terrainModifications
      },
      potentialTactics: this.generateEnvironmentalTactics(context)
    };
  }

  /**
   * Generate terrain-specific interaction effects
   * @param terrainType Terrain type
   * @param context Environmental interaction context
   * @returns Terrain interaction details
   */
  private static generateTerrainInteractions(
    terrainType: string, 
    context: EnvironmentalInteractionContext
  ): {
    characterAdvantages: string[];
    monsterDisadvantages: string[];
  } {
    const terrainInteractionMap = {
      'forest': {
        characterAdvantages: [
          'Natural cover provides stealth opportunities',
          'Terrain knowledge allows strategic positioning',
          'Ability to use trees for high ground advantage'
        ],
        monsterDisadvantages: [
          'Dense vegetation limits large monster movement',
          'Reduced visibility hinders coordinated attacks',
          'Natural obstacles impede direct charging'
        ]
      },
      'mountain': {
        characterAdvantages: [
          'High ground provides ranged attack benefits',
          'Rocky terrain offers natural defensive positions',
          'Ability to use elevation for tactical advantage'
        ],
        monsterDisadvantages: [
          'Steep terrain reduces mobility for large creatures',
          'Limited space for complex movement patterns',
          'Potential for environmental hazards like rockslides'
        ]
      },
      'underground': {
        characterAdvantages: [
          'Narrow passages allow strategic chokepoint creation',
          'Potential for surprise attacks from hidden locations',
          'Ability to use echo and sound for tactical information'
        ],
        monsterDisadvantages: [
          'Limited movement in confined spaces',
          'Reduced effectiveness of large-scale attacks',
          'Vulnerability to cave-in or structural collapse'
        ]
      },
      'urban': {
        characterAdvantages: [
          'Multiple paths for movement and escape',
          'Ability to use buildings for cover and positioning',
          'Potential for environmental object interactions'
        ],
        monsterDisadvantages: [
          'Structural limitations on monster movement',
          'Risk of collateral damage and structural collapse',
          'Complex navigation through urban terrain'
        ]
      }
    };

    // Randomly select subset of interactions
    const interactions = terrainInteractionMap[terrainType] || 
      terrainInteractionMap['forest'];

    return {
      characterAdvantages: RandomGenerator.selectUniqueFromArray(
        interactions.characterAdvantages, 
        2
      ),
      monsterDisadvantages: RandomGenerator.selectUniqueFromArray(
        interactions.monsterDisadvantages, 
        2
      )
    };
  }

  /**
   * Generate environmental factor interactions
   * @param environmentalFactors Environmental factors
   * @param context Environmental interaction context
   * @returns Environmental factor interaction details
   */
  private static generateEnvironmentalFactorInteractions(
    environmentalFactors: string[], 
    context: EnvironmentalInteractionContext
  ): {
    terrainModifications: string[];
  } {
    const factorInteractionMap = {
      'magical interference': [
        'Unpredictable magical energy distorts terrain',
        'Spell effects become more volatile and random',
        'Magical barriers or zone effects emerge spontaneously'
      ],
      'extreme weather': [
        'Reduced visibility and movement speed',
        'Periodic environmental damage or hindrance',
        'Dynamic terrain modification during encounter'
      ],
      'difficult terrain': [
        'Movement becomes more challenging and strategic',
        'Increased resource management requirements',
        'Tactical positioning becomes more critical'
      ]
    };

    // Combine and select unique terrain modifications
    const modifications = environmentalFactors.flatMap(factor => 
      factorInteractionMap[factor.toLowerCase()] || []
    );

    return {
      terrainModifications: RandomGenerator.selectUniqueFromArray(
        modifications, 
        Math.min(modifications.length, 3)
      )
    };
  }

  /**
   * Generate environmental description
   * @param terrainType Terrain type
   * @param environmentalFactors Environmental factors
   * @returns Descriptive environmental narrative
   */
  private static generateEnvironmentalDescription(
    terrainType: string, 
    environmentalFactors: string[]
  ): string {
    const baseDescriptions = {
      'forest': 'A dense, ancient forest with towering trees and thick undergrowth.',
      'mountain': 'A rugged mountain landscape with steep cliffs and rocky terrain.',
      'underground': 'A dark, echoing network of caverns and narrow tunnels.',
      'urban': 'A complex urban environment with intricate streets and buildings.'
    };

    const factorDescriptions = {
      'magical interference': 'Arcane energies crackle and distort the very fabric of reality.',
      'extreme weather': 'Harsh environmental conditions challenge survival.',
      'difficult terrain': 'The landscape itself becomes a formidable obstacle.'
    };

    const baseDescription = baseDescriptions[terrainType] || 
      baseDescriptions['forest'];

    const factorDescription = environmentalFactors
      .map(factor => factorDescriptions[factor.toLowerCase()] || '')
      .filter(Boolean)
      .join(' ');

    return `${baseDescription} ${factorDescription}`.trim();
  }

  /**
   * Generate potential environmental tactics
   * @param context Environmental interaction context
   * @returns Array of tactical approaches
   */
  private static generateEnvironmentalTactics(
    context: EnvironmentalInteractionContext
  ): string[] {
    const generalTactics = [
      'Utilize terrain for strategic positioning',
      'Exploit environmental factors to gain advantage',
      'Adapt movement and tactics to terrain constraints',
      'Use environmental elements as tactical resources'
    ];

    const terrainSpecificTactics = {
      'forest': [
        'Use dense vegetation for stealth and cover',
        'Leverage tree cover for ranged attack advantages'
      ],
      'mountain': [
        'Utilize high ground for tactical superiority',
        'Create chokepoints in narrow mountain passes'
      ],
      'underground': [
        'Exploit echo and sound for tactical information',
        'Use narrow passages for strategic positioning'
      ],
      'urban': [
        'Use buildings and structures for cover',
        'Create dynamic movement paths through urban terrain'
      ]
    };

    const specificTactics = terrainSpecificTactics[context.terrain.toLowerCase()] || [];

    return RandomGenerator.selectUniqueFromArray(
      [...generalTactics, ...specificTactics], 
      3
    );
  }
}
