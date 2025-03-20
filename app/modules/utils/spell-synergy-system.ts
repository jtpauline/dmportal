import { Spell } from '../spells';

export interface SpellSynergy {
  potentialSynergies: string[];
  recommendedCombinations: string[];
  synergyScore: number;
}

export class SpellSynergySystem {
  /**
   * Analyze spell synergies for a given set of spells
   * @param spells Array of spells to analyze
   * @returns Detailed spell synergy analysis
   */
  static analyzeSpellSynergies(spells: Spell[]): SpellSynergy {
    // Categorize spells by school and level
    const spellSchools = spells.map(spell => spell.school);
    const spellLevels = spells.map(spell => spell.level);

    // Generate potential synergies
    const potentialSynergies = this.generatePotentialSynergies(spells);

    // Generate recommended combinations
    const recommendedCombinations = this.generateRecommendedCombinations(spells);

    // Calculate synergy score
    const synergyScore = this.calculateSynergyScore(
      spells, 
      potentialSynergies.length
    );

    return {
      potentialSynergies,
      recommendedCombinations,
      synergyScore
    };
  }

  /**
   * Generate potential spell synergies
   * @param spells Array of spells to analyze
   * @returns Array of potential spell synergies
   */
  private static generatePotentialSynergies(spells: Spell[]): string[] {
    const synergies: string[] = [];

    // Analyze spell school combinations
    const schoolCombinations = this.findSchoolCombinations(spells);
    synergies.push(...schoolCombinations);

    // Analyze level-based synergies
    const levelSynergies = this.findLevelBasedSynergies(spells);
    synergies.push(...levelSynergies);

    // Analyze complementary spell effects
    const effectSynergies = this.findComplementaryEffects(spells);
    synergies.push(...effectSynergies);

    return synergies;
  }

  /**
   * Find interesting spell school combinations
   * @param spells Array of spells
   * @returns Array of school combination synergies
   */
  private static findSchoolCombinations(spells: Spell[]): string[] {
    const schoolMap = new Map<string, Spell[]>();
    
    // Group spells by school
    spells.forEach(spell => {
      if (!schoolMap.has(spell.school)) {
        schoolMap.set(spell.school, []);
      }
      schoolMap.get(spell.school).push(spell);
    });

    const synergies: string[] = [];

    // Analyze multi-school potential
    if (schoolMap.size > 1) {
      synergies.push('Multi-school spell casting potential detected');
      
      // Check for complementary schools
      const schoolCombos = [
        ['Evocation', 'Abjuration'],
        ['Conjuration', 'Illusion'],
        ['Necromancy', 'Transmutation']
      ];

      schoolCombos.forEach(([school1, school2]) => {
        if (schoolMap.has(school1) && schoolMap.has(school2)) {
          synergies.push(`Powerful ${school1} and ${school2} combination detected`);
        }
      });
    }

    return synergies;
  }

  /**
   * Find level-based spell synergies
   * @param spells Array of spells
   * @returns Array of level-based synergies
   */
  private static findLevelBasedSynergies(spells: Spell[]): string[] {
    const synergies: string[] = [];
    const levels = spells.map(spell => spell.level);

    // Check for diverse spell level range
    const minLevel = Math.min(...levels);
    const maxLevel = Math.max(...levels);

    if (maxLevel - minLevel >= 2) {
      synergies.push('Versatile spell level range detected');
    }

    // Look for complementary low and high-level spells
    const lowLevelSpells = spells.filter(spell => spell.level <= 2);
    const highLevelSpells = spells.filter(spell => spell.level >= 3);

    if (lowLevelSpells.length > 0 && highLevelSpells.length > 0) {
      synergies.push('Complementary low and high-level spell combination');
    }

    return synergies;
  }

  /**
   * Find complementary spell effects
   * @param spells Array of spells
   * @returns Array of effect-based synergies
   */
  private static findComplementaryEffects(spells: Spell[]): string[] {
    const synergies: string[] = [];

    // Look for control and damage spells
    const controlSpells = spells.filter(spell => 
      spell.tags?.includes('control') || spell.tags?.includes('debuff')
    );
    const damageSpells = spells.filter(spell => 
      spell.tags?.includes('damage') || spell.tags?.includes('offensive')
    );

    if (controlSpells.length > 0 && damageSpells.length > 0) {
      synergies.push('Powerful control and damage spell combination');
    }

    // Look for defensive and offensive spell mix
    const defensiveSpells = spells.filter(spell => 
      spell.tags?.includes('defense') || spell.tags?.includes('protection')
    );
    const offensiveSpells = spells.filter(spell => 
      spell.tags?.includes('offensive') || spell.tags?.includes('damage')
    );

    if (defensiveSpells.length > 0 && offensiveSpells.length > 0) {
      synergies.push('Balanced defensive and offensive spell repertoire');
    }

    return synergies;
  }

  /**
   * Generate recommended spell combinations
   * @param spells Array of spells
   * @returns Array of recommended spell combinations
   */
  private static generateRecommendedCombinations(spells: Spell[]): string[] {
    const combinations: string[] = [];

    // Basic combination strategies
    const schoolCombos = [
      ['Evocation', 'Abjuration'],
      ['Conjuration', 'Illusion'],
      ['Necromancy', 'Transmutation']
    ];

    schoolCombos.forEach(([school1, school2]) => {
      const matchingSpells = spells.filter(
        spell => spell.school === school1 || spell.school === school2
      );

      if (matchingSpells.length >= 2) {
        combinations.push(
          `Recommended ${school1}/${school2} spell combination`
        );
      }
    });

    // Level-based combinations
    const lowLevelSpells = spells.filter(spell => spell.level <= 2);
    const highLevelSpells = spells.filter(spell => spell.level >= 3);

    if (lowLevelSpells.length > 0 && highLevelSpells.length > 0) {
      combinations.push(
        'Recommended low-level utility with high-level power spells'
      );
    }

    return combinations;
  }

  /**
   * Calculate overall synergy score
   * @param spells Array of spells
   * @param synergyCount Number of detected synergies
   * @returns Numerical synergy score
   */
  private static calculateSynergyScore(
    spells: Spell[], 
    synergyCount: number
  ): number {
    // Base score calculation
    const schoolDiversity = new Set(spells.map(spell => spell.school)).size;
    const levelRange = Math.max(...spells.map(spell => spell.level)) - 
                      Math.min(...spells.map(spell => spell.level));

    // Combine factors
    const baseScore = (
      schoolDiversity * 2 + 
      levelRange + 
      synergyCount
    ) / (spells.length + 1);

    // Normalize to 0-10 scale
    return Math.min(Math.max(baseScore * 3, 0), 10);
  }
}
