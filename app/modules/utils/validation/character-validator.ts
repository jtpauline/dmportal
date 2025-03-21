import { InputValidator } from './input-validator';
import { ValidationRule } from './validation-types';
import { Character, CharacterClass, CharacterRace } from '../../characters';
import { configManager } from '../config/config-manager';
import { logger } from '../logging/logger';

export class CharacterValidator {
  private static validateCharacterRules: ValidationRule<Character> = {
    required: true,
    type: 'object',
    custom: (character: unknown) => {
      if (typeof character !== 'object' || character === null) return false;

      const config = configManager.getConfig().validationRules.character;
      const char = character as Character;

      // Null/undefined checks
      if (!char) return false;

      // Name validation
      if (
        !char.name || 
        char.name.length < config.nameMinLength || 
        char.name.length > config.nameMaxLength
      ) {
        logger.warn('Invalid character name', { name: char.name });
        return false;
      }

      // Level validation
      if (
        char.level < config.levelMin || 
        char.level > config.levelMax
      ) {
        logger.warn('Invalid character level', { level: char.level });
        return false;
      }

      // Race validation
      const validRaces: CharacterRace[] = [
        'Human', 'Elf', 'Dwarf', 'Halfling', 'Gnome', 
        'Tiefling', 'Dragonborn', 'Half-Elf', 'Half-Orc'
      ];
      if (!validRaces.includes(char.race)) {
        logger.warn('Invalid character race', { race: char.race });
        return false;
      }

      // Class validation
      const validClasses: CharacterClass[] = [
        'Fighter', 'Wizard', 'Rogue', 'Cleric', 
        'Barbarian', 'Ranger', 'Paladin', 'Druid', 
        'Monk', 'Warlock', 'Sorcerer', 'Bard'
      ];
      if (!validClasses.includes(char.class)) {
        logger.warn('Invalid character class', { class: char.class });
        return false;
      }

      return true;
    }
  };

  public static validate(character: unknown) {
    const validator = new InputValidator(this.validateCharacterRules);
    return validator.validate(character);
  }
}
