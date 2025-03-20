import { Character, CharacterClass, CharacterRace } from '../characters';
import { AbilityScoreUtils } from './ability-score-utils';
import { MulticlassSystem } from './multiclass-system';
import { CharacterArchetypeSystem } from './character-archetype-system';
import { AlignmentSystem } from './alignment-system';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  severity: 'low' | 'medium' | 'high';
}

export class CharacterValidationSystem {
  /**
   * Advanced character validation with comprehensive checks
   * @param character Character to validate
   * @param strictMode Enable more rigorous validation
   * @returns Detailed validation result
   */
  static validateCharacter(
    character: Character, 
    strictMode: boolean = false
  ): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      severity: 'low'
    };

    // Enhanced validation pipeline with configurable strictness
    this.validateBasicInfo(character, result, strictMode);
    this.validateAbilityScores(character, result, strictMode);
    this.validateClassRequirements(character, result, strictMode);
    this.validateMulticlassing(character, result, strictMode);
    this.validateArchetype(character, result, strictMode);
    this.validateAlignment(character, result, strictMode);
    this.validateSkills(character, result, strictMode);
    this.validateInventory(character, result, strictMode);
    this.validateBackstory(character, result, strictMode);

    // Determine overall validation severity
    this.calculateValidationSeverity(result);

    return result;
  }

  /**
   * Calculate validation severity based on errors and warnings
   */
  private static calculateValidationSeverity(result: ValidationResult): void {
    if (result.errors.length > 3) {
      result.severity = 'high';
    } else if (result.errors.length > 0 || result.warnings.length > 3) {
      result.severity = 'medium';
    }
    
    result.isValid = result.errors.length === 0;
  }

  /**
   * Enhanced basic information validation with optional strict mode
   */
  private static validateBasicInfo(
    character: Character, 
    result: ValidationResult, 
    strictMode: boolean
  ): void {
    // Name validation with more nuanced checks
    if (!character.name || character.name.trim().length < 2) {
      result.errors.push('Character name must be at least 2 characters long');
    }

    if (strictMode) {
      const forbiddenNames = ['Admin', 'Test', 'Unknown'];
      if (forbiddenNames.includes(character.name)) {
        result.errors.push('Invalid character name');
      }

      if (character.name.length > 50) {
        result.warnings.push('Character name is unusually long');
      }
    }

    // Comprehensive race and class validation
    const validRaces: CharacterRace[] = [
      'Human', 'Elf', 'Dwarf', 'Halfling', 'Gnome', 
      'Tiefling', 'Dragonborn', 'Half-Elf', 'Half-Orc'
    ];
    const validClasses: CharacterClass[] = [
      'Fighter', 'Wizard', 'Rogue', 'Cleric', 
      'Barbarian', 'Ranger', 'Paladin', 'Druid', 
      'Monk', 'Warlock', 'Sorcerer', 'Bard'
    ];

    if (!validRaces.includes(character.race)) {
      result.errors.push(`Invalid race. Must be one of: ${validRaces.join(', ')}`);
    }
    if (!validClasses.includes(character.class)) {
      result.errors.push(`Invalid class. Must be one of: ${validClasses.join(', ')}`);
    }

    // Level validation with more granular checks
    if (character.level < 1) {
      result.errors.push('Character level must be at least 1');
    }
    if (character.level > 20) {
      result.errors.push('Character level cannot exceed 20');
    }
    if (strictMode) {
      if (character.level > 10) {
        result.warnings.push('High-level character detected');
      }
    }
  }

  /**
   * Advanced ability score validation with race-specific and strict mode checks
   */
  private static validateAbilityScores(
    character: Character, 
    result: ValidationResult, 
    strictMode: boolean
  ): void {
    const minScore = strictMode ? 6 : 3;
    const maxScore = strictMode ? 18 : 20;

    // Comprehensive ability score validation
    Object.entries(character.abilityScores).forEach(([ability, score]) => {
      if (score < minScore || score > maxScore) {
        result.errors.push(`${ability.charAt(0).toUpperCase() + ability.slice(1)} score must be between ${minScore} and ${maxScore}`);
      }
    });

    // Advanced racial ability score restrictions
    const racialAbilityRestrictions = {
      'Human': { 
        minTotalScore: strictMode ? 65 : 60, 
        maxTotalScore: strictMode ? 75 : 80,
        balancedScores: strictMode
      },
      'Elf': { 
        minDexterity: strictMode ? 14 : 12,
        maxIntelligence: strictMode ? 16 : 18
      },
      'Dwarf': {
        minConstitution: strictMode ? 14 : 12,
        maxStrength: strictMode ? 16 : 18
      }
    };

    const raceRestrictions = racialAbilityRestrictions[character.race];
    if (raceRestrictions) {
      const totalScore = Object.values(character.abilityScores).reduce((a, b) => a + b, 0);

      if (raceRestrictions.minTotalScore && totalScore < raceRestrictions.minTotalScore) {
        result.warnings.push(`Total ability scores are low for ${character.race}`);
      }

      if (raceRestrictions.maxTotalScore && totalScore > raceRestrictions.maxTotalScore) {
        result.warnings.push(`Total ability scores are high for ${character.race}`);
      }

      // Specific ability score checks
      if (raceRestrictions.minDexterity && character.abilityScores.dexterity < raceRestrictions.minDexterity) {
        result.errors.push(`Dexterity must be at least ${raceRestrictions.minDexterity} for ${character.race}`);
      }
    }
  }

  // ... [Rest of the existing validation methods remain the same]

  /**
   * Advanced skill validation with point allocation tracking
   */
  private static validateSkills(
    character: Character, 
    result: ValidationResult, 
    strictMode: boolean
  ): void {
    if (character.skills) {
      // Skill level validation
      Object.entries(character.skills).forEach(([skill, level]) => {
        const maxSkillLevel = strictMode ? 15 : 20;
        if (level < 0 || level > maxSkillLevel) {
          result.errors.push(`Skill ${skill} level must be between 0 and ${maxSkillLevel}`);
        }
      });

      // Skill point limitation with more detailed tracking
      const maxSkillPoints = character.level * (strictMode ? 1.5 : 2);
      const totalSkillPoints = Object.values(character.skills)
        .reduce((sum, level) => sum + level, 0);

      if (totalSkillPoints > maxSkillPoints) {
        result.errors.push(`Total skill points (${totalSkillPoints}) cannot exceed ${maxSkillPoints}`);
      }
      
      if (strictMode) {
        if (totalSkillPoints > maxSkillPoints * 0.7) {
          result.warnings.push('Skill points are near maximum allocation');
        }
      }
    }
  }

  /**
   * Comprehensive inventory validation with weight and uniqueness checks
   */
  private static validateInventory(
    character: Character, 
    result: ValidationResult, 
    strictMode: boolean
  ): void {
    if (character.inventory) {
      // Weight limit validation with more nuanced reporting
      const maxCarryWeight = 15 * character.abilityScores.strength * (strictMode ? 0.8 : 1);
      const totalWeight = character.inventory.reduce((sum, item) => sum + (item.weight || 0), 0);

      if (totalWeight > maxCarryWeight) {
        result.errors.push(`Inventory weight (${totalWeight}) exceeds carrying capacity of ${maxCarryWeight}`);
      }
      
      if (strictMode) {
        if (totalWeight > maxCarryWeight * 0.7) {
          result.warnings.push('Inventory is near maximum carrying capacity');
        }
      }

      // Unique item validation with more comprehensive checks
      const uniqueItemIds = new Set();
      const duplicateItems: string[] = [];
      
      character.inventory.forEach(item => {
        if (uniqueItemIds.has(item.id)) {
          duplicateItems.push(item.name);
        }
        uniqueItemIds.add(item.id);
      });

      if (duplicateItems.length > 0) {
        result.warnings.push(`Duplicate items found: ${duplicateItems.join(', ')}`);
      }
    }
  }
}
