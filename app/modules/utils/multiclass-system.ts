import { Character, CharacterClass } from '../characters';
import { AbilityScoreUtils } from './ability-score-utils';
import { SpellSystem } from './spell-system';

export interface MulticlassRequirements {
  minimumScores: Record<string, number>;
  allowedCombinations: [CharacterClass, CharacterClass][];
}

export class MulticlassSystem {
  /**
   * Comprehensive multiclass requirements and validation
   */
  private static MULTICLASS_REQUIREMENTS: MulticlassRequirements = {
    minimumScores: {
      'Paladin': { strength: 13, charisma: 13 },
      'Ranger': { dexterity: 13, wisdom: 13 },
      'Fighter': { strength: 13, dexterity: 13 },
      'Wizard': { intelligence: 13 },
      'Warlock': { charisma: 13 },
      'Sorcerer': { charisma: 13 },
      'Cleric': { wisdom: 13 },
      'Druid': { wisdom: 13 },
      'Monk': { dexterity: 13, wisdom: 13 }
    },
    allowedCombinations: [
      ['Fighter', 'Wizard'],
      ['Rogue', 'Wizard'],
      ['Paladin', 'Warlock'],
      ['Ranger', 'Druid'],
      ['Cleric', 'Paladin']
    ]
  };

  /**
   * Validate multiclass eligibility
   * @param character Character to validate
   * @param newClass Class to multiclass into
   * @returns Validation result
   */
  static validateMulticlassing(
    character: Character, 
    newClass: CharacterClass
  ): {
    isEligible: boolean;
    errors: string[];
  } {
    const result = {
      isEligible: true,
      errors: []
    };

    // Check if already at max multiclass levels
    if (this.isAtMaxMulticlassLevels(character)) {
      result.isEligible = false;
      result.errors.push('Maximum multiclass levels reached');
      return result;
    }

    // Check ability score requirements
    const classRequirements = this.MULTICLASS_REQUIREMENTS.minimumScores[newClass];
    if (classRequirements) {
      Object.entries(classRequirements).forEach(([ability, minScore]) => {
        const currentScore = character.abilityScores[ability];
        if (currentScore < minScore) {
          result.isEligible = false;
          result.errors.push(`${ability.charAt(0).toUpperCase() + ability.slice(1)} must be at least ${minScore} to multiclass into ${newClass}`);
        }
      });
    }

    // Check allowed class combinations
    const currentClass = character.class;
    const isAllowedCombination = this.MULTICLASS_REQUIREMENTS.allowedCombinations.some(
      combo => combo.includes(currentClass) && combo.includes(newClass)
    );

    if (!isAllowedCombination) {
      result.isEligible = false;
      result.errors.push(`Multiclassing between ${currentClass} and ${newClass} is not recommended`);
    }

    return result;
  }

  /**
   * Apply multiclass level
   * @param character Character to multiclass
   * @param newClass Class to add
   * @returns Updated character
   */
  static applyMulticlass(
    character: Character, 
    newClass: CharacterClass
  ): Character {
    // Validate multiclassing first
    const validationResult = this.validateMulticlassing(character, newClass);
    
    if (!validationResult.isEligible) {
      throw new Error(validationResult.errors.join(', '));
    }

    // Update character's classes
    const updatedCharacter = { ...character };
    
    if (!updatedCharacter.multiclasses) {
      updatedCharacter.multiclasses = [];
    }

    // Add new multiclass if not already present
    if (!updatedCharacter.multiclasses.some(mc => mc.class === newClass)) {
      updatedCharacter.multiclasses.push({
        class: newClass,
        level: 1
      });
    }

    // Recalculate character capabilities
    this.recalculateCharacterCapabilities(updatedCharacter);

    return updatedCharacter;
  }

  /**
   * Recalculate character capabilities after multiclassing
   * @param character Multiclassed character
   */
  private static recalculateCharacterCapabilities(character: Character): void {
    // Recalculate hit points
    character.hitPoints = this.calculateMulticlassHitPoints(character);

    // Update spell capabilities
    if (character.multiclasses) {
      character.spells = this.mergeMulticlassSpells(character);
    }

    // Recalculate saving throws
    character.savingThrows = this.calculateMulticlassSavingThrows(character);

    // Update proficiencies
    character.proficiencies = this.mergeMulticlassProficiencies(character);
  }

  /**
   * Calculate multiclass hit points
   * @param character Multiclassed character
   * @returns Calculated hit points
   */
  private static calculateMulticlassHitPoints(character: Character): number {
    const baseHitDice = {
      'Fighter': 10,
      'Wizard': 6,
      'Cleric': 8,
      'Rogue': 8,
      'Barbarian': 12
    };

    let totalHitPoints = character.hitPoints;
    
    if (character.multiclasses) {
      character.multiclasses.forEach(mc => {
        const hitDice = baseHitDice[mc.class] || 8;
        const constitutionModifier = AbilityScoreUtils.calculateAbilityModifier(
          character.abilityScores.constitution
        );
        
        totalHitPoints += Math.max(1, Math.floor(hitDice / 2) + constitutionModifier);
      });
    }

    return totalHitPoints;
  }

  /**
   * Merge spells from multiple classes
   * @param character Multiclassed character
   * @returns Merged spell list
   */
  private static mergeMulticlassSpells(character: Character): any[] {
    if (!character.multiclasses) return character.spells || [];

    const spellLists = [character.spells || []];

    character.multiclasses.forEach(mc => {
      if (SpellSystem.isSpellcaster(mc.class)) {
        const classSpells = SpellSystem.getAvailableSpells({ 
          ...character, 
          class: mc.class 
        });
        spellLists.push(classSpells);
      }
    });

    // Deduplicate and merge spells
    return Array.from(new Set([
      ...spellLists.flat()
    ]));
  }

  /**
   * Check if character is at max multiclass levels
   * @param character Character to check
   * @returns Boolean indicating max levels
   */
  private static isAtMaxMulticlassLevels(character: Character): boolean {
    const MAX_MULTICLASS_LEVELS = 5;
    
    if (!character.multiclasses) return false;

    const totalMulticlassLevels = character.multiclasses.reduce(
      (sum, mc) => sum + mc.level, 
      0
    );

    return totalMulticlassLevels >= MAX_MULTICLASS_LEVELS;
  }

  /**
   * Calculate multiclass saving throws
   * @param character Multiclassed character
   * @returns Merged saving throws
   */
  private static calculateMulticlassSavingThrows(character: Character): Record<string, number> {
    const savingThrows = { ...character.savingThrows };

    if (character.multiclasses) {
      character.multiclasses.forEach(mc => {
        const classSavingThrows = this.getClassSavingThrows(mc.class);
        Object.entries(classSavingThrows).forEach(([ability, bonus]) => {
          savingThrows[ability] = Math.max(
            savingThrows[ability] || 0, 
            bonus
          );
        });
      });
    }

    return savingThrows;
  }

  /**
   * Get class-specific saving throw proficiencies
   * @param characterClass Character's class
   * @returns Saving throw bonuses
   */
  private static getClassSavingThrows(characterClass: CharacterClass): Record<string, number> {
    const classSavingThrows = {
      'Fighter': { strength: 2, constitution: 2 },
      'Wizard': { intelligence: 2, wisdom: 2 },
      'Rogue': { dexterity: 2, intelligence: 2 },
      'Cleric': { wisdom: 2, charisma: 2 }
    };

    return classSavingThrows[characterClass] || {};
  }

  /**
   * Merge proficiencies from multiple classes
   * @param character Multiclassed character
   * @returns Merged proficiencies
   */
  private static mergeMulticlassProficiencies(character: Character): string[] {
    const proficiencies = new Set(character.proficiencies || []);

    if (character.multiclasses) {
      character.multiclasses.forEach(mc => {
        const classProficiencies = this.getClassProficiencies(mc.class);
        classProficiencies.forEach(prof => proficiencies.add(prof));
      });
    }

    return Array.from(proficiencies);
  }

  /**
   * Get class-specific proficiencies
   * @param characterClass Character's class
   * @returns Proficiency list
   */
  private static getClassProficiencies(characterClass: CharacterClass): string[] {
    const classProficiencies = {
      'Fighter': ['Martial Weapons', 'Heavy Armor'],
      'Wizard': ['Arcane Implement', 'Spell Focus'],
      'Rogue': ['Thieves Tools', 'Stealth'],
      'Cleric': ['Divine Implement', 'Religious Artifacts']
    };

    return classProficiencies[characterClass] || [];
  }
}
