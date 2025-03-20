import { Character } from '../characters';
import { Spell, SpellEffect } from './spell-system';
import { AbilityScoreUtils } from './ability-score-utils';

export interface SavingThrowContext {
  character: Character;
  targetCharacter: Character;
  spell: Spell;
  spellLevel: number;
}

export interface SavingThrowResult {
  success: boolean;
  partialEffect: boolean;
  damage?: number;
  effects: SpellEffect[];
  savingThrowDetails: {
    dc: number;
    rollResult: number;
    ability: string;
  };
}

export class SavingThrowSystem {
  /**
   * Comprehensive saving throw mechanism
   * @param context Saving throw context
   * @returns Detailed saving throw result
   */
  static performSavingThrow(context: SavingThrowContext): SavingThrowResult {
    const { character, targetCharacter, spell, spellLevel } = context;

    // Calculate saving throw details
    const savingThrowDetails = this.calculateSavingThrow(character, spell);

    // Determine saving throw ability and DC
    const { ability, dc } = savingThrowDetails;

    // Simulate saving throw roll (replace with actual dice roll mechanism)
    const rollResult = this.simulateDiceRoll(20);

    // Calculate ability modifier for saving throw
    const abilityModifier = AbilityScoreUtils.calculateAbilityModifier(
      targetCharacter.abilityScores[ability]
    );

    // Determine saving throw success
    const totalRoll = rollResult + abilityModifier;
    const saveSuccess = totalRoll >= dc;

    // Process spell effects based on saving throw result
    const processedEffects = this.processSpellEffects(
      spell.effects, 
      spellLevel, 
      saveSuccess
    );

    return {
      success: saveSuccess,
      partialEffect: saveSuccess && spell.effects.some(e => e.savingThrow?.partialOnSuccess),
      effects: processedEffects,
      damage: this.calculateEffectDamage(processedEffects),
      savingThrowDetails: {
        dc,
        rollResult,
        ability
      }
    };
  }

  /**
   * Calculate saving throw parameters
   * @param character Casting character
   * @param spell Spell being cast
   * @returns Saving throw details
   */
  private static calculateSavingThrow(
    character: Character, 
    spell: Spell
  ): { 
    ability: string; 
    dc: number 
  } {
    // Determine spellcasting ability
    const spellcastingAbility = this.getSpellcastingAbility(character.class);
    
    // Calculate spell save DC
    const abilityScore = character.abilityScores[spellcastingAbility];
    const spellSaveDC = 8 + 
      AbilityScoreUtils.calculateAbilityModifier(abilityScore) + 
      character.proficiencyBonus;

    // Use spell-specific saving throw if defined, otherwise use default
    const savingThrowAbility = spell.effects.find(e => e.savingThrow)
      ?.savingThrow?.ability || 'dexterity';

    return {
      ability: savingThrowAbility,
      dc: spellSaveDC
    };
  }

  /**
   * Process spell effects based on saving throw result
   * @param effects Spell effects
   * @param spellLevel Spell level
   * @param saveSuccess Whether saving throw was successful
   * @returns Processed spell effects
   */
  private static processSpellEffects(
    effects: SpellEffect[], 
    spellLevel: number,
    saveSuccess: boolean
  ): SpellEffect[] {
    return effects.map(effect => {
      // Handle saving throw-based effect modification
      if (effect.savingThrow) {
        if (saveSuccess && !effect.savingThrow.partialOnSuccess) {
          // Completely negate effect on successful save
          return {
            ...effect,
            value: '0'
          };
        }

        // Reduce effect on successful save if partial effect is allowed
        if (saveSuccess && effect.savingThrow.partialOnSuccess) {
          return this.reduceEffectOnPartialSave(effect, spellLevel);
        }
      }

      return effect;
    });
  }

  /**
   * Reduce spell effect on partial save
   * @param effect Original spell effect
   * @param spellLevel Spell level
   * @returns Reduced spell effect
   */
  private static reduceEffectOnPartialSave(
    effect: SpellEffect, 
    spellLevel: number
  ): SpellEffect {
    // Implement effect reduction logic
    switch (effect.type) {
      case 'damage':
        return {
          ...effect,
          value: this.reduceNumericValue(effect.value, 0.5)
        };
      case 'control':
        return {
          ...effect,
          value: 'Reduced duration or intensity'
        };
      default:
        return effect;
    }
  }

  /**
   * Reduce numeric value by a factor
   * @param value Original value string
   * @param factor Reduction factor
   * @returns Reduced value string
   */
  private static reduceNumericValue(value: string, factor: number): string {
    const numericMatch = value.match(/(\d+)(?:d(\d+))?(\s*[+-]\s*\d+)?/);
    if (numericMatch) {
      const [, diceCount, diceType, modifier] = numericMatch;
      const reducedDiceCount = Math.floor(parseInt(diceCount) * factor);
      
      return `${reducedDiceCount}d${diceType}${modifier || ''}`;
    }
    return value;
  }

  /**
   * Calculate total damage from effects
   * @param effects Processed spell effects
   * @returns Total damage
   */
  private static calculateEffectDamage(effects: SpellEffect[]): number {
    return effects
      .filter(e => e.type === 'damage')
      .reduce((total, effect) => {
        const damageMatch = effect.value.match(/(\d+)(?:d(\d+))?(\s*[+-]\s*\d+)?/);
        if (damageMatch) {
          const [, diceCount, diceType, modifier] = damageMatch;
          const baseDamage = parseInt(diceCount) * (parseInt(diceType) / 2);
          const additionalModifier = modifier 
            ? parseInt(modifier.replace(/[+-]\s*/, '')) 
            : 0;
          return total + baseDamage + additionalModifier;
        }
        return total;
      }, 0);
  }

  /**
   * Simulate dice roll (to be replaced with actual dice rolling mechanism)
   * @param sides Number of sides on the die
   * @returns Simulated roll result
   */
  private static simulateDiceRoll(sides: number): number {
    return Math.floor(Math.random() * sides) + 1;
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
