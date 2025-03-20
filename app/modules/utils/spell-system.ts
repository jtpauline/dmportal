import { Character, CharacterClass } from '../characters';
import { AbilityScoreUtils } from './ability-score-utils';
import { SavingThrowSystem, SavingThrowResult } from './saving-throw-system';

export interface SpellRequirements {
  minimumAbilityScore?: {
    ability: string;
    score: number;
  };
  prerequisiteSpells?: string[];
  materialComponents?: {
    description: string;
    cost?: number;
    consumed?: boolean;
  };
}

export interface SpellEffect {
  type: 'damage' | 'healing' | 'buff' | 'debuff' | 'control';
  value: string;
  savingThrow?: {
    ability: string;
    difficulty: number;
    partialOnSuccess?: boolean;
  };
}

export interface Spell {
  id: string;
  name: string;
  level: number;
  school: SpellSchool;
  castingTime: string;
  range: string;
  components: SpellComponent[];
  duration: string;
  description: string;
  classes: CharacterClass[];
  requirements?: SpellRequirements;
  effects: SpellEffect[];
  damageType?: DamageType;
  concentration?: boolean;
  ritual?: boolean;
  upcastEffects?: Record<number, SpellEffect[]>;
}

export type SpellSchool = 
  | 'Abjuration' 
  | 'Conjuration' 
  | 'Divination' 
  | 'Enchantment' 
  | 'Evocation' 
  | 'Illusion' 
  | 'Necromancy' 
  | 'Transmutation';

export type SpellComponent = 'Verbal' | 'Somatic' | 'Material';

export type DamageType = 
  | 'Fire' 
  | 'Cold' 
  | 'Lightning' 
  | 'Necrotic' 
  | 'Radiant' 
  | 'Psychic' 
  | 'Acid' 
  | 'Poison';

export class SpellSystem {
  /**
   * Advanced spell interaction and validation
   * @param character Casting character
   * @param spell Spell to validate
   * @param targetCharacter Optional target character
   * @returns Comprehensive spell interaction result
   */
  static analyzeSpellInteraction(
    character: Character, 
    spell: Spell,
    targetCharacter?: Character
  ): {
    isValid: boolean;
    errors: string[];
    potentialEffects?: SpellEffect[];
    savingThrowResult?: SavingThrowResult;
  } {
    const validationResult = this.validateSpellRequirements(character, spell);

    // If spell is not valid, return validation errors
    if (!validationResult.isEligible) {
      return {
        isValid: false,
        errors: validationResult.errors
      };
    }

    // If target character exists, perform saving throw analysis
    let savingThrowResult: SavingThrowResult | undefined;
    if (targetCharacter) {
      savingThrowResult = SavingThrowSystem.performSavingThrow({
        character,
        targetCharacter,
        spell,
        spellLevel: spell.level
      });
    }

    return {
      isValid: true,
      errors: [],
      potentialEffects: spell.effects,
      savingThrowResult
    };
  }

  /**
   * Advanced spell requirement validation
   * @param character Character checking spell
   * @param spell Spell to validate
   * @returns Validation result with detailed feedback
   */
  static validateSpellRequirements(
    character: Character, 
    spell: Spell
  ): {
    isEligible: boolean;
    errors: string[];
  } {
    const result = {
      isEligible: true,
      errors: []
    };

    // Check class compatibility
    if (!spell.classes.includes(character.class)) {
      result.isEligible = false;
      result.errors.push(`Spell not available for ${character.class}`);
    }

    // Check ability score requirements
    if (spell.requirements?.minimumAbilityScore) {
      const { ability, score } = spell.requirements.minimumAbilityScore;
      const currentScore = character.abilityScores[ability];
      
      if (currentScore < score) {
        result.isEligible = false;
        result.errors.push(`Requires ${ability} score of at least ${score}`);
      }
    }

    // Check prerequisite spells
    if (spell.requirements?.prerequisiteSpells) {
      const knownSpells = character.spells || [];
      const missingPrerequisites = spell.requirements.prerequisiteSpells.filter(
        prereq => !knownSpells.some(s => s.id === prereq)
      );

      if (missingPrerequisites.length > 0) {
        result.isEligible = false;
        result.errors.push(`Missing prerequisite spells: ${missingPrerequisites.join(', ')}`);
      }
    }

    // Check material components
    if (spell.requirements?.materialComponents) {
      const { description, cost, consumed } = spell.requirements.materialComponents;
      // Additional logic for material component validation can be added here
      // For example, checking character's inventory or gold
    }

    return result;
  }

  /**
   * Calculate spell damage or healing
   * @param spell Spell to calculate effect for
   * @param character Casting character
   * @param spellLevel Spell level used
   * @returns Calculated effect value
   */
  static calculateSpellEffect(
    spell: Spell, 
    character: Character, 
    spellLevel: number
  ): string {
    // Determine base effect
    let effects = spell.effects;
    
    // Check for upcasting
    if (spellLevel > spell.level && spell.upcastEffects) {
      const upcastEffect = spell.upcastEffects[spellLevel];
      if (upcastEffect) {
        effects = upcastEffect;
      }
    }

    // Calculate spellcasting ability modifier
    const abilityModifier = AbilityScoreUtils.calculateAbilityModifier(
      character.abilityScores[this.getSpellcastingAbility(character.class)]
    );

    // Process effects
    return effects.map(effect => {
      // Replace modifier placeholder
      let effectValue = effect.value.replace(
        'spellcasting modifier', 
        abilityModifier.toString()
      );
      return effectValue;
    }).join(', ');
  }

  /**
   * Get spellcasting ability for a class
   * @param characterClass Character's class
   * @returns Spellcasting ability
   */
  private static getSpellcastingAbility(characterClass: CharacterClass): string {
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
