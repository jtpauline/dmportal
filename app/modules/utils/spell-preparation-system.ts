import { Character } from '../characters';
import { Spell } from '../spells';

export interface SpellPreparationAnalysis {
  preparationEfficiency: number;
  recommendedSpellList: Spell[];
  preparationStrategies: string[];
  potentialCombinations: string[];
}

export class SpellPreparationSystem {
  /**
   * Prepare and optimize spell list for a character
   * @param character Character preparing spells
   * @param availableSpells Full list of available spells
   * @returns Comprehensive spell preparation analysis
   */
  static prepareSpells(
    character: {
      name: string;
      class: string;
      level: number;
      spells: Spell[];
    },
    availableSpells: Spell[]
  ): SpellPreparationAnalysis {
    // Filter spells based on character's class and level
    const eligibleSpells = this.filterEligibleSpells(
      character, 
      availableSpells
    );

    // Recommend optimal spell list
    const recommendedSpellList = this.recommendSpells(
      character, 
      eligibleSpells
    );

    // Calculate preparation efficiency
    const preparationEfficiency = this.calculatePreparationEfficiency(
      character, 
      recommendedSpellList
    );

    // Generate preparation strategies
    const preparationStrategies = this.generatePreparationStrategies(
      character, 
      recommendedSpellList
    );

    // Find potential spell combinations
    const potentialCombinations = this.findPotentialCombinations(
      recommendedSpellList
    );

    return {
      preparationEfficiency,
      recommendedSpellList,
      preparationStrategies,
      potentialCombinations
    };
  }

  /**
   * Filter spells eligible for the character
   * @param character Character preparing spells
   * @param availableSpells Full list of available spells
   * @returns Filtered list of eligible spells
   */
  private static filterEligibleSpells(
    character: { class: string; level: number },
    availableSpells: Spell[]
  ): Spell[] {
    const classSpellLevelMap = {
      'Wizard': (level: number) => Math.floor(level / 2),
      'Sorcerer': (level: number) => Math.floor((level + 1) / 2),
      'Warlock': (level: number) => Math.min(Math.floor((level + 1) / 2), 5),
      'Druid': (level: number) => Math.floor(level / 2),
      'Cleric': (level: number) => Math.floor(level / 2),
      'Bard': (level: number) => Math.floor((level + 1) / 2),
      'Paladin': (level: number) => Math.floor(level / 2),
      'Ranger': (level: number) => Math.floor(level / 2)
    };

    const maxSpellLevel = classSpellLevelMap[character.class]?.(character.level) || 1;

    return availableSpells.filter(spell => 
      spell.level <= maxSpellLevel &&
      this.isSpellCompatibleWithClass(character.class, spell)
    );
  }

  /**
   * Check if a spell is compatible with a character's class
   * @param characterClass Character's class
   * @param spell Spell to check
   * @returns Boolean indicating spell compatibility
   */
  private static isSpellCompatibleWithClass(
    characterClass: string, 
    spell: Spell
  ): boolean {
    const classSpellCompatibility = {
      'Wizard': ['Arcane'],
      'Sorcerer': ['Arcane'],
      'Warlock': ['Arcane', 'Eldritch'],
      'Druid': ['Nature', 'Primal'],
      'Cleric': ['Divine', 'Holy'],
      'Bard': ['Arcane', 'Enchantment'],
      'Paladin': ['Divine', 'Holy'],
      'Ranger': ['Nature', 'Primal']
    };

    const compatibleTypes = classSpellCompatibility[characterClass] || [];
    return compatibleTypes.some(type => 
      spell.tags?.includes(type) || 
      spell.school.toLowerCase().includes(type.toLowerCase())
    );
  }

  /**
   * Recommend optimal spell list
   * @param character Character preparing spells
   * @param eligibleSpells List of eligible spells
   * @returns Recommended spell list
   */
  private static recommendSpells(
    character: { class: string; level: number },
    eligibleSpells: Spell[]
  ): Spell[] {
    // Strategy weights by class
    const classStrategyWeights = {
      'Wizard': {
        'utility': 0.3,
        'damage': 0.3,
        'control': 0.4
      },
      'Sorcerer': {
        'damage': 0.5,
        'control': 0.3,
        'utility': 0.2
      },
      'Warlock': {
        'damage': 0.4,
        'control': 0.3,
        'utility': 0.3
      }
    };

    const strategyWeights = classStrategyWeights[character.class] || {
      'utility': 0.3,
      'damage': 0.3,
      'control': 0.4
    };

    // Score and rank spells
    const scoredSpells = eligibleSpells.map(spell => {
      let score = 0;
      
      // Score based on strategy weights
      spell.tags?.forEach(tag => {
        if (strategyWeights[tag]) {
          score += strategyWeights[tag];
        }
      });

      // Bonus for versatile spells
      if (spell.tags?.length > 1) {
        score += 0.2;
      }

      return { spell, score };
    });

    // Sort and select top spells
    const maxSpellCount = Math.min(
      Math.floor(character.level / 2) + 2, 
      10
    );

    return scoredSpells
      .sort((a, b) => b.score - a.score)
      .slice(0, maxSpellCount)
      .map(item => item.spell);
  }

  /**
   * Calculate spell preparation efficiency
   * @param character Character preparing spells
   * @param recommendedSpells Recommended spell list
   * @returns Numerical preparation efficiency score
   */
  private static calculatePreparationEfficiency(
    character: { class: string; level: number },
    recommendedSpells: Spell[]
  ): number {
    // Analyze spell diversity
    const schools = new Set(recommendedSpells.map(spell => spell.school));
    const tags = new Set(
      recommendedSpells.flatMap(spell => spell.tags || [])
    );

    // Calculate efficiency factors
    const schoolDiversityFactor = schools.size / 8; // Max 8 spell schools
    const tagDiversityFactor = tags.size / 6; // Common tags
    const levelCoverageFactor = recommendedSpells.length / 10; // Max 10 spells

    // Combine factors
    const efficiency = (
      schoolDiversityFactor * 0.4 + 
      tagDiversityFactor * 0.3 + 
      levelCoverageFactor * 0.3
    ) * 10;

    return Math.min(Math.max(efficiency, 0), 10);
  }

  /**
   * Generate spell preparation strategies
   * @param character Character preparing spells
   * @param recommendedSpells Recommended spell list
   * @returns Array of preparation strategy descriptions
   */
  private static generatePreparationStrategies(
    character: { class: string; level: number },
    recommendedSpells: Spell[]
  ): string[] {
    const strategies: string[] = [];

    // Analyze spell schools
    const schools = new Set(recommendedSpells.map(spell => spell.school));
    
    if (schools.size > 2) {
      strategies.push('Maintain a diverse magical school approach');
    }

    // Analyze spell levels
    const levels = recommendedSpells.map(spell => spell.level);
    const minLevel = Math.min(...levels);
    const maxLevel = Math.max(...levels);

    if (maxLevel - minLevel >= 2) {
      strategies.push('Balance low and high-level spell selections');
    }

    // Class-specific strategies
    const classStrategies = {
      'Wizard': 'Prioritize versatility and spell utility',
      'Sorcerer': 'Focus on high-impact damage and control spells',
      'Warlock': 'Optimize spell slots with strategic spell selection',
      'Druid': 'Maintain a balance between nature and combat spells',
      'Cleric': 'Prepare spells that support both healing and combat',
      'Bard': 'Select spells that provide maximum party utility',
      'Paladin': 'Balance divine magic with combat effectiveness',
      'Ranger': 'Prepare spells that enhance survival and combat'
    };

    if (classStrategies[character.class]) {
      strategies.push(classStrategies[character.class]);
    }

    return strategies;
  }

  /**
   * Find potential spell combinations
   * @param recommendedSpells Recommended spell list
   * @returns Array of potential spell combination descriptions
   */
  private static findPotentialCombinations(
    recommendedSpells: Spell[]
  ): string[] {
    const combinations: string[] = [];

    // Analyze spell school combinations
    const schoolCombos = [
      ['Evocation', 'Abjuration'],
      ['Conjuration', 'Illusion'],
      ['Necromancy', 'Transmutation']
    ];

    schoolCombos.forEach(([school1, school2]) => {
      const matchingSpells = recommendedSpells.filter(
        spell => spell.school === school1 || spell.school === school2
      );

      if (matchingSpells.length >= 2) {
        combinations.push(
          `Powerful ${school1}/${school2} spell combination`
        );
      }
    });

    // Analyze complementary spell tags
    const tagCombos = [
      ['damage', 'control'],
      ['buff', 'healing'],
      ['utility', 'defense']
    ];

    tagCombos.forEach(([tag1, tag2]) => {
      const matchingSpells = recommendedSpells.filter(
        spell => spell.tags?.includes(tag1) || spell.tags?.includes(tag2)
      );

      if (matchingSpells.length >= 2) {
        combinations.push(
          `Synergistic ${tag1} and ${tag2} spell combination`
        );
      }
    });

    return combinations;
  }
}
