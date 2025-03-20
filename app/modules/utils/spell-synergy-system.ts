import { Character } from '../characters';
import { Spell, SpellEffect, SpellSystem } from './spell-system';
import { SpellCastingSystem } from './spell-casting-system';
import { AbilityScoreUtils } from './ability-score-utils';

// Enhanced Synergy Interfaces
export interface AdvancedSpellSynergy extends SpellSynergy {
  compatibilityScore: number;
  potentialRisks: string[];
  generationMethod: 'predefined' | 'dynamic';
}

export interface SpellSynergyPotential {
  spellSchoolCompatibility: number;
  characterLevelCompatibility: number;
  abilityScoreCompatibility: number;
  overallCompatibility: number;
}

export class SpellSynergySystem {
  // Existing predefined synergies with enhanced type
  private static predefinedSynergies: AdvancedSpellSynergy[] = [
    {
      ...SpellSynergySystem.createBaseSynergy('elemental-resonance'),
      compatibilityScore: 0.8,
      potentialRisks: ['High elemental instability'],
      generationMethod: 'predefined'
    },
    {
      ...SpellSynergySystem.createBaseSynergy('arcane-shield-weaving'),
      compatibilityScore: 0.7,
      potentialRisks: ['Concentration interference'],
      generationMethod: 'predefined'
    }
  ];

  /**
   * Create a base synergy template
   * @param id Unique synergy identifier
   * @returns Base synergy structure
   */
  private static createBaseSynergy(id: string): SpellSynergy {
    return {
      id,
      name: this.generateSynergyName(id),
      description: this.generateSynergyDescription(id),
      type: this.determineSynergyTypeFromId(id),
      compatibleSpellSchools: this.getCompatibleSpellSchools(id),
      synergyEffects: this.generateSynergyEffects(id),
      complexity: this.calculateSynergyComplexity(id)
    };
  }

  /**
   * Advanced spell synergy discovery with enhanced compatibility assessment
   * @param character Character exploring spell synergies
   * @returns Array of advanced spell synergies
   */
  static discoverAdvancedSpellSynergies(character: Character): AdvancedSpellSynergy[] {
    return this.predefinedSynergies.filter(synergy => 
      this.calculateSynergyPotential(character, synergy).overallCompatibility > 0.7
    ).map(synergy => ({
      ...synergy,
      compatibilityScore: this.calculateSynergyPotential(character, synergy).overallCompatibility
    }));
  }

  /**
   * Calculate comprehensive synergy potential
   * @param character Character assessing synergy
   * @param synergy Spell synergy to evaluate
   * @returns Detailed synergy potential assessment
   */
  static calculateSynergyPotential(
    character: Character, 
    synergy: SpellSynergy
  ): SpellSynergyPotential {
    const spellSchoolCompatibility = this.checkSpellSchoolCompatibility(character, synergy);
    const characterLevelCompatibility = this.checkCharacterLevelCompatibility(character, synergy);
    const abilityScoreCompatibility = this.checkAbilityScoreCompatibility(character, synergy);

    const overallCompatibility = (
      spellSchoolCompatibility * 0.4 + 
      characterLevelCompatibility * 0.3 + 
      abilityScoreCompatibility * 0.3
    );

    return {
      spellSchoolCompatibility,
      characterLevelCompatibility,
      abilityScoreCompatibility,
      overallCompatibility
    };
  }

  /**
   * Check spell school compatibility
   * @param character Character to check
   * @param synergy Spell synergy to evaluate
   * @returns Compatibility score (0-1)
   */
  private static checkSpellSchoolCompatibility(
    character: Character, 
    synergy: SpellSynergy
  ): number {
    const characterSpells = character.spells || [];
    const compatibleSpells = characterSpells.filter(spell => 
      synergy.compatibleSpellSchools.includes(spell.school)
    );

    return Math.min(1, compatibleSpells.length / synergy.compatibleSpellSchools.length);
  }

  /**
   * Check character level compatibility
   * @param character Character to check
   * @param synergy Spell synergy to evaluate
   * @returns Compatibility score (0-1)
   */
  private static checkCharacterLevelCompatibility(
    character: Character, 
    synergy: SpellSynergy
  ): number {
    const minRequiredLevel = synergy.complexity * 2;
    return Math.min(1, character.level / minRequiredLevel);
  }

  /**
   * Check ability score compatibility
   * @param character Character to check
   * @param synergy Spell synergy to evaluate
   * @returns Compatibility score (0-1)
   */
  private static checkAbilityScoreCompatibility(
    character: Character, 
    synergy: SpellSynergy
  ): number {
    const spellcastingAbility = SpellCastingSystem.getSpellcastingAbility(character.class);
    const abilityScore = character.abilityScores[spellcastingAbility];
    const abilityModifier = AbilityScoreUtils.calculateAbilityModifier(abilityScore);

    // Higher modifier increases compatibility
    return Math.min(1, (abilityModifier + 5) / 10);
  }

  /**
   * Generate advanced dynamic synergy
   * @param character Character generating synergy
   * @param spells Spells to combine
   * @returns Advanced dynamic spell synergy
   */
  static generateAdvancedDynamicSynergy(
    character: Character, 
    spells: Spell[]
  ): AdvancedSpellSynergy {
    if (spells.length < 2) {
      throw new Error('At least two spells required for dynamic synergy');
    }

    const dynamicSynergy: AdvancedSpellSynergy = {
      id: `dynamic-synergy-${Date.now()}`,
      name: this.generateDynamicSynergyName(spells),
      description: this.generateDynamicSynergyDescription(spells),
      type: this.determineDynamicSynergyType(spells),
      compatibleSpellSchools: [...new Set(spells.map(spell => spell.school))],
      synergyEffects: this.generateDynamicSynergyEffects(spells),
      complexity: this.calculateDynamicSynergyComplexity(spells),
      compatibilityScore: this.calculateDynamicSynergyCompatibility(character, spells),
      potentialRisks: this.assessDynamicSynergyRisks(spells),
      generationMethod: 'dynamic'
    };

    return dynamicSynergy;
  }

  /**
   * Generate dynamic synergy name
   * @param spells Spells involved in synergy
   * @returns Generated synergy name
   */
  private static generateDynamicSynergyName(spells: Spell[]): string {
    const spellNames = spells.map(spell => spell.name);
    const combinedName = spellNames.join('-');
    const prefixes = ['Emergent', 'Arcane', 'Mystical', 'Resonant'];
    const suffix = ['Confluence', 'Synthesis', 'Interaction'];

    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${combinedName} ${suffix[Math.floor(Math.random() * suffix.length)]}`;
  }

  /**
   * Generate dynamic synergy description
   * @param spells Spells involved in synergy
   * @returns Generated synergy description
   */
  private static generateDynamicSynergyDescription(spells: Spell[]): string {
    const spellDescriptions = spells.map(spell => spell.description).join(' + ');
    return `A unique magical interaction emerging from the combination of ${spells.map(s => s.name).join(', ')}. ${spellDescriptions}`;
  }

  /**
   * Determine dynamic synergy type
   * @param spells Spells involved in synergy
   * @returns Synergy type
   */
  private static determineDynamicSynergyType(spells: Spell[]): SpellSynergy['type'] {
    const effectTypes = spells.flatMap(spell => 
      spell.effects.map(effect => effect.type)
    );

    const typeMapping: Record<string, SpellSynergy['type']> = {
      'damage': 'offensive',
      'healing': 'utility',
      'buff': 'defensive',
      'debuff': 'control'
    };

    const primaryType = effectTypes.find(type => typeMapping[type]);
    return primaryType ? typeMapping[primaryType] : 'utility';
  }

  /**
   * Generate dynamic synergy effects
   * @param spells Spells involved in synergy
   * @returns Combined synergy effects
   */
  private static generateDynamicSynergyEffects(spells: Spell[]): SpellSynergyEffect[] {
    return spells.flatMap(spell => 
      spell.effects.map(effect => ({
        type: 'transform',
        baseEffect: effect,
        conditions: {
          spellSchool: spell.school
        }
      }))
    );
  }

  /**
   * Calculate dynamic synergy complexity
   * @param spells Spells involved in synergy
   * @returns Synergy complexity score
   */
  private static calculateDynamicSynergyComplexity(spells: Spell[]): number {
    return Math.min(5, spells.reduce((total, spell) => 
      total + spell.level * (spell.effects.length * 0.5), 0
    ));
  }

  /**
   * Calculate dynamic synergy compatibility
   * @param character Character generating synergy
   * @param spells Spells involved in synergy
   * @returns Compatibility score
   */
  private static calculateDynamicSynergyCompatibility(
    character: Character, 
    spells: Spell[]
  ): number {
    const compatibilityScores = spells.map(spell => 
      this.checkSpellSchoolCompatibility(character, {
        compatibleSpellSchools: [spell.school],
        complexity: spell.level
      })
    );

    return compatibilityScores.reduce((a, b) => a * b, 1);
  }

  /**
   * Assess risks in dynamic synergy
   * @param spells Spells involved in synergy
   * @returns Array of potential risks
   */
  private static assessDynamicSynergyRisks(spells: Spell[]): string[] {
    const risks: string[] = [];

    // Check concentration conflicts
    const concentrationSpells = spells.filter(spell => spell.concentration);
    if (concentrationSpells.length > 1) {
      risks.push('Multiple concentration spells may interfere');
    }

    // Check extreme spell level differences
    const spellLevels = spells.map(spell => spell.level);
    const levelSpread = Math.max(...spellLevels) - Math.min(...spellLevels);
    if (levelSpread > 3) {
      risks.push('Significant spell level disparity');
    }

    // Check conflicting effect types
    const effectTypes = spells.flatMap(spell => 
      spell.effects.map(effect => effect.type)
    );
    const uniqueEffectTypes = new Set(effectTypes);
    if (uniqueEffectTypes.size > 3) {
      risks.push('Highly complex and unpredictable effect interactions');
    }

    return risks;
  }

  // Placeholder methods for additional generation logic
  private static generateSynergyName(id: string): string { /* ... */ }
  private static generateSynergyDescription(id: string): string { /* ... */ }
  private static determineSynergyTypeFromId(id: string): SpellSynergy['type'] { /* ... */ }
  private static getCompatibleSpellSchools(id: string): string[] { /* ... */ }
  private static generateSynergyEffects(id: string): SpellSynergyEffect[] { /* ... */ }
  private static calculateSynergyComplexity(id: string): number { /* ... */ }
}
