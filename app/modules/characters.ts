import { v4 as uuidv4 } from 'uuid';
import { CharacterBuilder } from './utils/character-builder';
import { CharacterSheetGenerator } from './utils/character-sheet-generator';
import { AbilityScoreUtils } from './utils/ability-score-utils';
import { InventoryManagement } from './utils/inventory-management';
import { SpellSystem } from './utils/spell-system';
import { Spell } from './utils/spell-system';

export enum CharacterStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  DECEASED = 'Deceased',
  RETIRED = 'Retired'
}

export interface MulticlassInfo {
  class: CharacterClass;
  level: number;
}

export interface CharacterExport {
  version: string;
  character: Character;
  metadata: {
    exportedAt: string;
    exportVersion: string;
  };
}

// Updated Character interface to support multiclassing and advanced features
export interface Character {
  id: string;
  name: string;
  race: CharacterRace;
  class: CharacterClass;
  level: number;
  experience: number;
  status: CharacterStatus;
  abilityScores: AbilityScores;
  hitPoints: number;
  armorClass: number;
  campaignId?: string;
  inventory: CharacterItem[];
  spells?: Spell[];
  preparedSpells?: Spell[];
  backstory?: string;
  traits?: {
    personality: string[];
    ideals: string[];
    bonds: string[];
    flaws: string[];
  };
  multiclasses?: MulticlassInfo[];
  savingThrows?: Record<string, number>;
  proficiencies?: string[];
}

export class CharacterManager {
  // ... [Previous implementation remains the same]

  /**
   * Advanced multiclass character creation
   */
  createMulticlassCharacter(
    baseClass: CharacterClass, 
    multiclassOptions: {
      race: CharacterRace;
      multiclassClass: CharacterClass;
    }
  ): Character {
    // Create base character
    const baseCharacter = this.createCharacter({
      class: baseClass,
      race: multiclassOptions.race
    });

    // Apply multiclass
    try {
      return MulticlassSystem.applyMulticlass(
        baseCharacter, 
        multiclassOptions.multiclassClass
      );
    } catch (error) {
      console.error('Multiclass creation failed:', error);
      return baseCharacter;
    }
  }

  /**
   * Learn a new spell for a character
   */
  learnSpell(characterId: string, spellId: string): Character {
    const character = this.getCharacterById(characterId);
    if (!character) {
      throw new Error('Character not found');
    }

    const updatedCharacter = SpellSystem.learnSpell(character, spellId);
    this.saveCharacter(updatedCharacter);
    return updatedCharacter;
  }

  /**
   * Prepare daily spells
   */
  prepareDailySpells(characterId: string, spellIds: string[]): Character {
    const character = this.getCharacterById(characterId);
    if (!character) {
      throw new Error('Character not found');
    }

    const updatedCharacter = SpellSystem.prepareDailySpells(character, spellIds);
    this.saveCharacter(updatedCharacter);
    return updatedCharacter;
  }
}
