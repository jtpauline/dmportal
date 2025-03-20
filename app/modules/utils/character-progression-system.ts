import { Character } from '../characters';
import { Campaign } from '../campaigns';

export interface ProgressionEvent {
  type: 'level_up' | 'skill_mastery' | 'ability_improvement' | 'feat_acquisition';
  description: string;
  xpGained: number;
  date: Date;
}

export class CharacterProgressionSystem {
  /**
   * Advanced Character Progression Tracking
   */
  static trackCharacterProgression(
    character: Character, 
    campaign: Campaign, 
    event: ProgressionEvent
  ): Character {
    // Handle XP Gain
    character.experience += event.xpGained;

    // Check for Level Up
    const nextLevelXP = this.calculateNextLevelXP(character.level);
    if (character.experience >= nextLevelXP) {
      this.handleLevelUp(character, campaign);
    }

    // Track Progression Events
    this.recordProgressionEvent(character, event);

    // Potential Skill or Ability Improvements
    this.potentialSkillImprovement(character);

    return character;
  }

  /**
   * Calculate XP Required for Next Level
   */
  private static calculateNextLevelXP(currentLevel: number): number {
    // D&D 3.5 XP Progression Table
    const xpTable = {
      1: 0,
      2: 1000,
      3: 3000,
      4: 6000,
      5: 10000,
      6: 15000,
      7: 21000,
      8: 28000,
      9: 36000,
      10: 45000,
      11: 55000,
      12: 66000,
      13: 78000,
      14: 91000,
      15: 105000,
      16: 120000,
      17: 136000,
      18: 153000,
      19: 171000,
      20: 190000
    };

    return xpTable[currentLevel + 1] || Infinity;
  }

  /**
   * Handle Character Level Up
   */
  private static handleLevelUp(character: Character, campaign: Campaign): void {
    // Increment Level
    character.level++;

    // Potential Class-Specific Progression
    this.applyClassSpecificLevelUpBonuses(character);

    // Update Campaign Metadata
    campaign.metadata.averagePartyLevel = this.recalculateAveragePartyLevel(campaign);

    // Trigger Level Up Events
    this.triggerLevelUpEvents(character, campaign);
  }

  /**
   * Apply Class-Specific Level Up Bonuses
   */
  private static applyClassSpecificLevelUpBonuses(character: Character): void {
    const classSpecificBonuses = {
      'Fighter': () => {
        character.feats.push(this.selectFighterFeat());
        character.baseAttackBonus += 1;
      },
      'Wizard': () => {
        character.spellsKnown += 2;
        character.intelligenceScore += this.calculateIntelligenceImprovement();
      },
      'Rogue': () => {
        character.skillPoints += 8;
        character.specialAbilities.push(this.selectRogueAbility());
      }
      // Add more class-specific level up logic
    };

    character.classes.forEach(characterClass => {
      const bonusMethod = classSpecificBonuses[characterClass.name];
      if (bonusMethod) bonusMethod();
    });
  }

  /**
   * Select Fighter-Specific Feat
   */
  private static selectFighterFeat(): string {
    const fighterFeats = [
      'Weapon Specialization',
      'Improved Critical',
      'Greater Weapon Focus',
      'Combat Reflexes',
      'Weapon Mastery'
    ];
    return fighterFeats[Math.floor(Math.random() * fighterFeats.length)];
  }

  /**
   * Calculate Intelligence Improvement
   */
  private static calculateIntelligenceImprovement(): number {
    return Math.random() > 0.7 ? 1 : 0;
  }

  /**
   * Select Rogue-Specific Ability
   */
  private static selectRogueAbility(): string {
    const rogueAbilities = [
      'Improved Sneak Attack',
      'Skill Mastery',
      'Advanced Trapfinding',
      'Enhanced Evasion',
      'Improved Disable Device'
    ];
    return rogueAbilities[Math.floor(Math.random() * rogueAbilities.length)];
  }

  /**
   * Recalculate Average Party Level
   */
  private static recalculateAveragePartyLevel(campaign: Campaign): number {
    if (campaign.characters.length === 0) return 1;
    
    const totalLevels = campaign.characters.reduce((sum, char) => sum + char.level, 0);
    return Math.round(totalLevels / campaign.characters.length);
  }

  /**
   * Record Progression Event
   */
  private static recordProgressionEvent(character: Character, event: ProgressionEvent): void {
    character.progressionHistory.push({
      ...event,
      timestamp: new Date()
    });
  }

  /**
   * Potential Skill Improvement
   */
  private static potentialSkillImprovement(character: Character): void {
    const skillImprovementChance = Math.random();
    
    if (skillImprovementChance > 0.8) {
      const improvableSkills = [
        'Concentration', 'Diplomacy', 'Perception', 
        'Stealth', 'Survival', 'Spellcraft'
      ];
      
      const skillToImprove = improvableSkills[
        Math.floor(Math.random() * improvableSkills.length)
      ];
      
      character.skills[skillToImprove] = (character.skills[skillToImprove] || 0) + 1;
    }
  }

  /**
   * Trigger Level Up Events
   */
  private static triggerLevelUpEvents(character: Character, campaign: Campaign): void {
    // Potential narrative or mechanical events on level up
    const levelUpEvents = [
      () => this.generateLevelUpNarrative(character, campaign),
      () => this.unlockSpecialAbility(character),
      () => this.adjustCharacterTraits(character)
    ];

    const selectedEvent = levelUpEvents[
      Math.floor(Math.random() * levelUpEvents.length)
    ];

    selectedEvent();
  }

  /**
   * Generate Level Up Narrative
   */
  private static generateLevelUpNarrative(character: Character, campaign: Campaign): void {
    const narrativeTemplates = [
      `${character.name} reflects on their journey and newfound strength`,
      `A pivotal moment of growth transforms ${character.name}'s understanding`,
      `${character.name} experiences a profound personal breakthrough`
    ];

    const selectedNarrative = narrativeTemplates[
      Math.floor(Math.random() * narrativeTemplates.length)
    ];

    campaign.worldHistory.push(`[CHARACTER PROGRESSION] ${selectedNarrative}`);
  }

  /**
   * Unlock Special Ability
   */
  private static unlockSpecialAbility(character: Character): void {
    const specialAbilities = [
      'Enhanced Combat Prowess',
      'Magical Insight',
      'Survival Instinct',
      'Leadership Potential',
      'Arcane Resonance'
    ];

    if (Math.random() > 0.7) {
      const newAbility = specialAbilities[
        Math.floor(Math.random() * specialAbilities.length)
      ];
      character.specialAbilities.push(newAbility);
    }
  }

  /**
   * Adjust Character Traits
   */
  private static adjustCharacterTraits(character: Character): void {
    const traitAdjustments = [
      () => character.charismaScore += Math.random() > 0.8 ? 1 : 0,
      () => character.wisdomScore += Math.random() > 0.8 ? 1 : 0,
      () => character.constitutionScore += Math.random() > 0.8 ? 1 : 0
    ];

    traitAdjustments[
      Math.floor(Math.random() * traitAdjustments.length)
    ]();
  }
}
