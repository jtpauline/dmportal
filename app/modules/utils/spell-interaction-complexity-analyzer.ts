import { Spell } from '../spells';
import { Character } from '../characters';
import { EnvironmentalContext } from './spell-interaction-analyzer';
import { SpellInteractionAnalysis } from './spell-interaction-analyzer';

export interface SpellInteractionComplexityFactor {
  name: string;
  weight: number;
  description: string;
}

export class SpellInteractionComplexityAnalyzer {
  // Predefined complexity factors
  private static complexityFactors: SpellInteractionComplexityFactor[] = [
    {
      name: 'spell-level-difference',
      weight: 0.3,
      description: 'Difference in spell levels affects interaction complexity'
    },
    {
      name: 'school-compatibility',
      weight: 0.4,
      description: 'Magical school compatibility influences interaction complexity'
    },
    {
      name: 'environmental-context',
      weight: 0.2,
      description: 'Environmental conditions impact spell interaction complexity'
    },
    {
      name: 'character-proficiency',
      weight: 0.5,
      description: 'Character\'s magical proficiency affects interaction complexity'
    }
  ];

  /**
   * Analyze spell interaction complexity
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @param character Casting character
   * @param context Environmental context
   * @returns Complexity analysis result
   */
  static analyzeInteractionComplexity(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character,
    context: EnvironmentalContext
  ): number {
    let complexityScore = 0;

    // Spell level difference complexity
    const levelDifferenceComplexity = Math.abs(
      primarySpell.level - secondarySpell.level
    ) * 0.1;

    // School compatibility complexity
    const schoolCompatibilityMap: Record<string, Record<string, number>> = {
      'evocation': { 'conjuration': 0.3, 'transmutation': 0.2 },
      'necromancy': { 'illusion': 0.4, 'enchantment': 0.3 }
    };

    const schoolCompatibilityComplexity = 
      schoolCompatibilityMap[primarySpell.school]?.[secondarySpell.school] || 0;

    // Environmental context complexity
    const environmentalComplexityMap: Record<string, number> = {
      'forest': 0.2,
      'mountain': 0.3,
      'underground': 0.4
    };

    const environmentalComplexity = 
      environmentalComplexityMap[context.terrain.toLowerCase()] || 0.1;

    // Character proficiency complexity
    const proficiencyComplexityMap: Record<string, number> = {
      'high-intelligence': 0.3,
      'magical-affinity': 0.4,
      'arcane-scholar': 0.5
    };

    const characterProficiencyComplexity = 
      character.traits?.reduce((total, trait) => 
        total + (proficiencyComplexityMap[trait] || 0), 0) || 0;

    // Compute total complexity
    complexityScore = Math.min(
      levelDifferenceComplexity +
      schoolCompatibilityComplexity +
      environmentalComplexity +
      characterProficiencyComplexity,
      1
    );

    return complexityScore;
  }

  /**
   * Get complexity factors
   * @returns Array of complexity factors
   */
  static getComplexityFactors(): SpellInteractionComplexityFactor[] {
    return [...this.complexityFactors];
  }

  /**
   * Add custom complexity factor
   * @param factor New complexity factor
   */
  static addComplexityFactor(factor: SpellInteractionComplexityFactor): void {
    // Prevent duplicate factors
    if (!this.complexityFactors.some(f => f.name === factor.name)) {
      this.complexityFactors.push(factor);
    }
  }
}
