import { Character } from '../characters';
import { Spell } from '../spells';

export interface SpellCastingAnalysis {
  spellVersatility: string;
  castingPotential: number;
  schoolDiversity: number;
  spellLevelRange: string;
  potentialCastingStrategies: string[];
}

export class SpellCastingSystem {
  /**
   * Analyze a character's spell casting capabilities
   * @param character Character to analyze
   * @returns Comprehensive spell casting analysis
   */
  static analyzeSpellCastingCapabilities(character: {
    name: string;
    class: string;
    level: number;
    spells: Spell[];
  }): SpellCastingAnalysis {
    const { spells } = character;

    // Analyze spell schools
    const spellSchools = spells.map(spell => spell.school);
    const uniqueSchools = new Set(spellSchools);

    // Calculate spell level distribution
    const spellLevels = spells.map(spell => spell.level);
    const minLevel = Math.min(...spellLevels);
    const maxLevel = Math.max(...spellLevels);

    // Determine spell versatility
    const versatilityScore = this.calculateVersatilityScore(spells);
    const spellVersatility = this.interpretVersatilityScore(versatilityScore);

    // Calculate casting potential
    const castingPotential = this.calculateCastingPotential(
      character.class, 
      spells
    );

    // Generate potential casting strategies
    const potentialCastingStrategies = this.generateCastingStrategies(spells);

    return {
      spellVersatility,
      castingPotential,
      schoolDiversity: uniqueSchools.size,
      spellLevelRange: `Level ${minLevel}-${maxLevel}`,
      potentialCastingStrategies
    };
  }

  /**
   * Calculate spell versatility score
   * @param spells Array of spells
   * @returns Numerical versatility score
   */
  private static calculateVersatilityScore(spells: Spell[]): number {
    // Analyze spell diversity
    const schoolDiversity = new Set(spells.map(spell => spell.school)).size;
    const levelRange = Math.max(...spells.map(spell => spell.level)) - 
                      Math.min(...spells.map(spell => spell.level));

    // Analyze spell tags for versatility
    const uniqueTags = new Set(
      spells.flatMap(spell => spell.tags || [])
    ).size;

    // Combine factors
    const baseScore = (
      schoolDiversity * 2 + 
      levelRange + 
      uniqueTags
    ) / (spells.length + 1);

    return Math.min(Math.max(baseScore * 3, 0), 10);
  }

  /**
   * Interpret versatility score
   * @param score Numerical versatility score
   * @returns Descriptive versatility level
   */
  private static interpretVersatilityScore(score: number): string {
    if (score < 3) return 'Limited';
    if (score < 5) return 'Basic';
    if (score < 7) return 'Moderate';
    if (score < 9) return 'Advanced';
    return 'Exceptional';
  }

  /**
   * Calculate overall casting potential
   * @param characterClass Character's class
   * @param spells Array of spells
   * @returns Numerical casting potential score
   */
  private static calculateCastingPotential(
    characterClass: string, 
    spells: Spell[]
  ): number {
    // Base potential by class
    const classPotentialMap = {
      'Wizard': 1.5,
      'Sorcerer': 1.4,
      'Warlock': 1.3,
      'Druid': 1.2,
      'Cleric': 1.1,
      'Bard': 1.0,
      'Paladin': 0.9,
      'Ranger': 0.8
    };

    const classMultiplier = classPotentialMap[characterClass] || 1.0;

    // Analyze spell levels
    const highLevelSpells = spells.filter(spell => spell.level >= 3).length;
    const uniqueSchools = new Set(spells.map(spell => spell.school)).size;

    // Calculate potential
    const baseScore = (
      highLevelSpells * 2 + 
      uniqueSchools * 1.5
    ) * classMultiplier;

    return Math.min(Math.max(baseScore, 0), 10);
  }

  /**
   * Generate potential casting strategies
   * @param spells Array of spells
   * @returns Array of casting strategy descriptions
   */
  private static generateCastingStrategies(spells: Spell[]): string[] {
    const strategies: string[] = [];

    // Analyze spell schools
    const schoolAnalysis = this.analyzeSpellSchools(spells);
    strategies.push(...schoolAnalysis);

    // Analyze spell levels
    const levelAnalysis = this.analyzeSpellLevels(spells);
    strategies.push(...levelAnalysis);

    // Analyze spell tags
    const tagAnalysis = this.analyzeSpellTags(spells);
    strategies.push(...tagAnalysis);

    return strategies;
  }

  /**
   * Analyze spell schools for casting strategies
   * @param spells Array of spells
   * @returns Array of school-based strategies
   */
  private static analyzeSpellSchools(spells: Spell[]): string[] {
    const schoolStrategies: string[] = [];
    const schools = new Set(spells.map(spell => spell.school));

    const schoolStrategyMap = {
      'Evocation': 'Direct damage and energy manipulation',
      'Abjuration': 'Defensive and protective casting',
      'Conjuration': 'Summoning and teleportation strategies',
      'Illusion': 'Deception and misdirection tactics',
      'Necromancy': 'Life and death energy manipulation',
      'Transmutation': 'Transformation and alteration approaches',
      'Divination': 'Predictive and information-gathering methods',
      'Enchantment': 'Mind control and emotional manipulation'
    };

    schools.forEach(school => {
      if (schoolStrategyMap[school]) {
        schoolStrategies.push(schoolStrategyMap[school]);
      }
    });

    return schoolStrategies;
  }

  /**
   * Analyze spell levels for casting strategies
   * @param spells Array of spells
   * @returns Array of level-based strategies
   */
  private static analyzeSpellLevels(spells: Spell[]): string[] {
    const levelStrategies: string[] = [];
    const levels = spells.map(spell => spell.level);

    const minLevel = Math.min(...levels);
    const maxLevel = Math.max(...levels);

    if (minLevel <= 2) {
      levelStrategies.push('Utilize low-level utility spells for efficiency');
    }

    if (maxLevel >= 3) {
      levelStrategies.push('Leverage high-level powerful spell combinations');
    }

    if (maxLevel >= 5) {
      levelStrategies.push('Employ advanced, game-changing spell tactics');
    }

    return levelStrategies;
  }

  /**
   * Analyze spell tags for casting strategies
   * @param spells Array of spells
   * @returns Array of tag-based strategies
   */
  private static analyzeSpellTags(spells: Spell[]): string[] {
    const tagStrategies: string[] = [];
    const allTags = spells.flatMap(spell => spell.tags || []);
    const uniqueTags = new Set(allTags);

    const tagStrategyMap = {
      'control': 'Focus on battlefield control and enemy limitation',
      'damage': 'Maximize offensive spell damage output',
      'healing': 'Prioritize party survival and recovery',
      'buff': 'Enhance ally capabilities through magical empowerment',
      'debuff': 'Weaken and hinder enemy effectiveness',
      'utility': 'Solve problems through versatile magical solutions'
    };

    uniqueTags.forEach(tag => {
      if (tagStrategyMap[tag]) {
        tagStrategies.push(tagStrategyMap[tag]);
      }
    });

    return tagStrategies;
  }
}
