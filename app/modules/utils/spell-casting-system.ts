import { Character } from '../characters';
import { Spell, SpellEffect } from './spell-system';
import { SpellPreparationSystem } from './spell-preparation-system';
import { AbilityScoreUtils } from './ability-score-utils';

export interface SpellCastingContext {
  character: Character;
  spell: Spell;
  spellLevel: number;
  additionalModifiers?: Record<string, number>;
}

export interface SpellCastResult {
  success: boolean;
  damage?: number;
  healing?: number;
  effects: SpellEffect[];
  concentrationRequired: boolean;
  spellSlotUsed: boolean;
  errors?: string[];
}

export class SpellCastingSystem {
  /**
   * Comprehensive spell casting mechanism
   * @param context Spell casting context
   * @returns Detailed spell casting result
   */
  static castSpell(context: SpellCastingContext): SpellCastResult {
    const { character, spell, spellLevel } = context;

    // Validate spell casting prerequisites
    const validationErrors = this.validateSpellCasting(context);
    if (validationErrors.length > 0) {
      return {
        success: false,
        effects: [],
        concentrationRequired: spell.concentration || false,
        spellSlotUsed: false,
        errors: validationErrors
      };
    }

    // Calculate spell attack and damage
    const spellAttackResult = this.calculateSpellAttack(context);

    // Manage spell slots
    const spellSlotManagement = this.manageSpellSlots(character, spell, spellLevel);

    // Handle concentration
    const concentrationCheck = this.handleConcentration(character, spell);

    return {
      success: true,
      ...spellAttackResult,
      concentrationRequired: spell.concentration || false,
      spellSlotUsed: spellSlotManagement.slotUsed,
      errors: []
    };
  }

  /**
   * Validate spell casting prerequisites
   * @param context Spell casting context
   * @returns Array of validation errors
   */
  private static validateSpellCasting(context: SpellCastingContext): string[] {
    const { character, spell } = context;
    const errors: string[] = [];

    // Check spell preparation
    const preparedSpells = character.preparedSpells || [];
    const isPrepared = preparedSpells.some(
      slot => slot.spell?.id === spell.id && slot.prepared
    );

    if (!isPrepared) {
      errors.push('Spell is not prepared');
    }

    // Check material components
    const materialComponentCheck = SpellPreparationSystem.manageMaterialComponents(
      character, 
      spell
    );

    if (materialComponentCheck.requiresMaterials && 
        materialComponentCheck.missingComponents.length > 0) {
      errors.push(
        `Missing material components: ${materialComponentCheck.missingComponents.join(', ')}`
      );
    }

    // Check spell requirements
    const abilityScore = character.abilityScores[
      this.getSpellcastingAbility(character.class)
    ];
    const spellSaveDC = 8 + 
      AbilityScoreUtils.calculateAbilityModifier(abilityScore) + 
      character.proficiencyBonus;

    return errors;
  }

  /**
   * Calculate spell attack and damage
   * @param context Spell casting context
   * @returns Spell attack and damage results
   */
  private static calculateSpellAttack(context: SpellCastingContext) {
    const { character, spell, spellLevel } = context;
    
    // Calculate spellcasting ability modifier
    const spellcastingAbility = this.getSpellcastingAbility(character.class);
    const abilityModifier = AbilityScoreUtils.calculateAbilityModifier(
      character.abilityScores[spellcastingAbility]
    );

    // Process spell effects
    const processedEffects = spell.effects.map(effect => {
      switch (effect.type) {
        case 'damage':
          return this.calculateDamageEffect(effect, spellLevel, abilityModifier);
        case 'healing':
          return this.calculateHealingEffect(effect, spellLevel, abilityModifier);
        default:
          return effect;
      }
    });

    return {
      effects: processedEffects,
      damage: processedEffects
        .filter(e => e.type === 'damage')
        .reduce((total, effect) => total + this.parseDamageValue(effect.value), 0),
      healing: processedEffects
        .filter(e => e.type === 'healing')
        .reduce((total, effect) => total + this.parseHealingValue(effect.value), 0)
    };
  }

  /**
   * Manage spell slot usage
   * @param character Character casting spell
   * @param spell Spell being cast
   * @param spellLevel Spell level used
   * @returns Spell slot management result
   */
  private static manageSpellSlots(
    character: Character, 
    spell: Spell, 
    spellLevel: number
  ) {
    const spellSlots = SpellPreparationSystem.calculateSpellSlots(character);
    
    // Check available spell slots
    const availableSlots = spellSlots[spellLevel] || 0;

    if (availableSlots > 0) {
      // Reduce available spell slots
      spellSlots[spellLevel]--;

      return {
        slotUsed: true,
        remainingSlots: spellSlots[spellLevel]
      };
    }

    return {
      slotUsed: false,
      remainingSlots: availableSlots
    };
  }

  /**
   * Handle concentration spell mechanics
   * @param character Character casting spell
   * @param spell Spell being cast
   * @returns Concentration check result
   */
  private static handleConcentration(
    character: Character, 
    spell: Spell
  ) {
    if (!spell.concentration) {
      return {
        requiresConcentration: false,
        concentrationCheck: null
      };
    }

    // Concentration check mechanics
    const spellcastingAbility = this.getSpellcastingAbility(character.class);
    const concentrationDC = 10;  // Base DC, can be modified by damage or other factors

    // Simulate concentration check
    const abilityModifier = AbilityScoreUtils.calculateAbilityModifier(
      character.abilityScores[spellcastingAbility]
    );

    return {
      requiresConcentration: true,
      concentrationCheck: {
        dc: concentrationDC,
        modifier: abilityModifier
      }
    };
  }

  /**
   * Calculate damage effect for a spell
   * @param effect Spell effect
   * @param spellLevel Spell level
   * @param abilityModifier Spellcasting ability modifier
   * @returns Processed damage effect
   */
  private static calculateDamageEffect(
    effect: SpellEffect, 
    spellLevel: number, 
    abilityModifier: number
  ): SpellEffect {
    // Implement damage scaling for higher spell levels
    const baseDamage = this.parseDamageValue(effect.value);
    const scaledDamage = baseDamage + (spellLevel > effect.level ? 
      (spellLevel - effect.level) * 1 : 0);

    return {
      ...effect,
      value: `${scaledDamage + abilityModifier} damage`
    };
  }

  /**
   * Calculate healing effect for a spell
   * @param effect Spell effect
   * @param spellLevel Spell level
   * @param abilityModifier Spellcasting ability modifier
   * @returns Processed healing effect
   */
  private static calculateHealingEffect(
    effect: SpellEffect, 
    spellLevel: number, 
    abilityModifier: number
  ): SpellEffect {
    // Implement healing scaling for higher spell levels
    const baseHealing = this.parseHealingValue(effect.value);
    const scaledHealing = baseHealing + (spellLevel > effect.level ? 
      (spellLevel - effect.level) * 1 : 0);

    return {
      ...effect,
      value: `${scaledHealing + abilityModifier} healing`
    };
  }

  /**
   * Parse damage value from spell effect
   * @param damageValue Damage value string
   * @returns Parsed damage number
   */
  private static parseDamageValue(damageValue: string): number {
    // Simple parsing, can be expanded for more complex dice notation
    const match = damageValue.match(/(\d+)d(\d+)\s*(\+\s*\d+)?/);
    if (match) {
      const [, diceCount, diceType, modifier] = match;
      const baseDamage = parseInt(diceCount) * (parseInt(diceType) / 2);
      const additionalModifier = modifier ? parseInt(modifier.replace(/\+\s*/, '')) : 0;
      return baseDamage + additionalModifier;
    }
    return 0;
  }

  /**
   * Parse healing value from spell effect
   * @param healingValue Healing value string
   * @returns Parsed healing number
   */
  private static parseHealingValue(healingValue: string): number {
    // Similar to damage parsing
    const match = healingValue.match(/(\d+)d(\d+)\s*(\+\s*\d+)?/);
    if (match) {
      const [, diceCount, diceType, modifier] = match;
      const baseHealing = parseInt(diceCount) * (parseInt(diceType) / 2);
      const additionalModifier = modifier ? parseInt(modifier.replace(/\+\s*/, '')) : 0;
      return baseHealing + additionalModifier;
    }
    return 0;
  }

  /**
   * Get spellcasting ability for a class
   * @param characterClass Character's class
   * @returns Spellcasting ability
   */
  private static getSpellcastingAbility(characterClass: string): string {
    const spellcastingAbilities = {
      'Wizard': 'intelligence',
      'Cleric': 'wisdom',
      'Warlock': 'charisma',
      'Druid': 'wisdom',
      'Sorcerer': 'charisma',
      'Paladin': 'charisma',
      'Ranger': 'wisdom',
      'Bard': 'charisma'
    };

    return spellcastingAbilities[characterClass] || 'intelligence';
  }
}
