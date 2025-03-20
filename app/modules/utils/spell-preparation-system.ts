import { Character } from '../characters';
import { Spell, SpellComponent } from './spell-system';
import { AbilityScoreUtils } from './ability-score-utils';

export interface SpellSlot {
  level: number;
  total: number;
  used: number;
}

export interface PreparedSpellSlot {
  spell?: Spell;
  prepared: boolean;
}

export class SpellPreparationSystem {
  /**
   * Calculate maximum preparable spells based on character class and level
   * @param character Character preparing spells
   * @returns Number of spells that can be prepared
   */
  static calculateMaxPreparedSpells(character: Character): number {
    const spellcastingAbility = this.getSpellcastingAbility(character.class);
    const abilityModifier = AbilityScoreUtils.calculateAbilityModifier(
      character.abilityScores[spellcastingAbility]
    );
    
    // Base calculation: Spellcaster level + ability modifier
    return Math.max(1, character.level + abilityModifier);
  }

  /**
   * Calculate available spell slots for a character
   * @param character Character calculating spell slots
   * @returns Spell slot configuration
   */
  static calculateSpellSlots(character: Character): Record<number, number> {
    const spellSlots: Record<number, number> = {};
    const characterLevel = character.level;

    // Spell slot progression based on character level and class
    const slotProgression = this.getSpellSlotProgression(character.class);

    // Calculate spell slots for each spell level
    Object.keys(slotProgression).forEach(level => {
      const numSlots = this.calculateSlotsForLevel(
        characterLevel, 
        parseInt(level), 
        slotProgression[level]
      );
      
      if (numSlots > 0) {
        spellSlots[parseInt(level)] = numSlots;
      }
    });

    return spellSlots;
  }

  /**
   * Manage material components for spell casting
   * @param character Character casting spell
   * @param spell Spell being cast
   * @returns Material component management result
   */
  static manageMaterialComponents(
    character: Character, 
    spell: Spell
  ): {
    requiresMaterials: boolean;
    missingComponents: string[];
    consumedComponents: string[];
  } {
    // Check if spell requires material components
    const materialComponents = spell.components.filter(
      comp => comp === 'Material'
    );

    if (materialComponents.length === 0) {
      return {
        requiresMaterials: false,
        missingComponents: [],
        consumedComponents: []
      };
    }

    // Simulate inventory and component checking
    const inventory = character.inventory || [];
    const requiredMaterials = spell.requirements?.materialComponents;

    if (!requiredMaterials) {
      return {
        requiresMaterials: true,
        missingComponents: ['Unspecified Material Components'],
        consumedComponents: []
      };
    }

    // Check for specific material components
    const missingComponents: string[] = [];
    const consumedComponents: string[] = [];

    // Example material component check
    if (requiredMaterials.description) {
      const hasComponents = inventory.some(item => 
        item.name.includes(requiredMaterials.description)
      );

      if (!hasComponents) {
        missingComponents.push(requiredMaterials.description);
      } else if (requiredMaterials.consumed) {
        consumedComponents.push(requiredMaterials.description);
      }
    }

    return {
      requiresMaterials: true,
      missingComponents,
      consumedComponents
    };
  }

  /**
   * Prepare spells for a character
   * @param character Character preparing spells
   * @param selectedSpells Spells to prepare
   * @returns Updated character with prepared spells
   */
  static prepareSpells(
    character: Character, 
    selectedSpells: Spell[]
  ): Character {
    const maxPreparedSpells = this.calculateMaxPreparedSpells(character);

    // Validate spell preparation
    if (selectedSpells.length > maxPreparedSpells) {
      throw new Error(
        `Cannot prepare more than ${maxPreparedSpells} spells`
      );
    }

    // Create prepared spell slots
    const preparedSpellSlots: PreparedSpellSlot[] = selectedSpells.map(spell => ({
      spell,
      prepared: true
    }));

    // Update character with prepared spells
    return {
      ...character,
      preparedSpells: preparedSpellSlots
    };
  }

  /**
   * Get spell slot progression for a character class
   * @param characterClass Character's class
   * @returns Spell slot progression configuration
   */
  private static getSpellSlotProgression(characterClass: string): Record<number, number[]> {
    // Spell slot progression based on D&D 5e rules
    const spellSlotProgressions: Record<string, Record<number, number[]>> = {
      'Wizard': {
        1: [2, 2],   // Levels 1-2
        2: [3, 3],   // Levels 3-4
        3: [4, 4],   // Levels 5-6
        4: [5, 4],   // Levels 7-8
        5: [6, 4]    // Levels 9-10
      },
      'Cleric': {
        1: [2, 2],
        2: [3, 3],
        3: [4, 3],
        4: [5, 4],
        5: [6, 4]
      },
      'Druid': {
        1: [2, 2],
        2: [3, 3],
        3: [4, 3],
        4: [5, 4],
        5: [6, 4]
      },
      'Paladin': {
        2: [2, 2],   // Paladins start getting spell slots at level 2
        3: [3, 2],
        4: [3, 3],
        5: [4, 3]
      },
      'Ranger': {
        2: [2, 2],   // Rangers start getting spell slots at level 2
        3: [3, 2],
        4: [3, 3],
        5: [4, 3]
      }
    };

    // Default to a basic progression if class not found
    return spellSlotProgressions[characterClass] || {
      1: [2, 2],
      2: [3, 2],
      3: [4, 2],
      4: [5, 3],
      5: [6, 3]
    };
  }

  /**
   * Calculate spell slots for a specific level
   * @param characterLevel Character's current level
   * @param spellLevel Spell level being calculated
   * @param slotProgression Slot progression configuration
   * @returns Number of spell slots
   */
  private static calculateSlotsForLevel(
    characterLevel: number, 
    spellLevel: number, 
    slotProgression: number[]
  ): number {
    // Find the appropriate slot count based on character level
    const levelIndex = Math.min(
      Math.floor((characterLevel - 1) / 2), 
      slotProgression.length - 1
    );

    return slotProgression[levelIndex];
  }

  /**
   * Get spellcasting ability for a class
   * @param characterClass Character's class
   * @returns Spellcasting ability
   */
  private static getSpellcastingAbility(characterClass: string): string {
    const spellcastingAbilities: Record<string, string> = {
      'Wizard': 'intelligence',
      'Cleric': 'wisdom',
      'Druid': 'wisdom',
      'Paladin': 'charisma',
      'Ranger': 'wisdom',
      'Sorcerer': 'charisma',
      'Warlock': 'charisma',
      'Bard': 'charisma'
    };

    return spellcastingAbilities[characterClass] || 'intelligence';
  }
}
