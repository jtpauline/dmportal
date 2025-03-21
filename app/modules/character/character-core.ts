import { v4 as uuidv4 } from 'uuid';
import { CharacterClass, CharacterRace, AbilityScores } from '../types';
import { Spell } from '../spell/spell-system';
import { Equipment } from '../equipment/equipment-management';

export interface CharacterBackground {
  origin: string;
  personalityTraits: string[];
  ideals: string[];
  bonds: string[];
  flaws: string[];
  backstory: string;
}

export interface CharacterSkills {
  [skillName: string]: {
    rank: number;
    modifier: number;
    isClassSkill: boolean;
  };
}

export interface CharacterProgression {
  level: number;
  experience: number;
  hitPoints: {
    current: number;
    max: number;
  };
  feats: string[];
  specialAbilities: string[];
}

export interface Character {
  id: string;
  name: string;
  race: CharacterRace;
  classes: Array<{
    name: CharacterClass;
    level: number;
    hitDie: number;
  }>;
  abilityScores: AbilityScores;
  background: CharacterBackground;
  skills: CharacterSkills;
  progression: CharacterProgression;
  inventory: Equipment[];
  spells: Spell[];
  alignment: 'Lawful Good' | 'Neutral Good' | 'Chaotic Good' | 
             'Lawful Neutral' | 'True Neutral' | 'Chaotic Neutral' | 
             'Lawful Evil' | 'Neutral Evil' | 'Chaotic Evil';
  status: 'Active' | 'Inactive' | 'Deceased';
}

export class CharacterManager {
  /**
   * Create a new character with comprehensive details
   * @param characterData Initial character creation data
   * @returns Fully initialized character
   */
  static createCharacter(characterData: Partial<Character>): Character {
    const baseCharacter: Character = {
      id: uuidv4(),
      name: characterData.name || 'Unnamed Character',
      race: characterData.race || 'Human',
      classes: characterData.classes || [],
      abilityScores: characterData.abilityScores || this.generateAbilityScores(),
      background: characterData.background || this.generateBackground(),
      skills: characterData.skills || this.initializeSkills(),
      progression: {
        level: 1,
        experience: 0,
        hitPoints: { current: 10, max: 10 },
        feats: [],
        specialAbilities: []
      },
      inventory: characterData.inventory || [],
      spells: characterData.spells || [],
      alignment: characterData.alignment || 'True Neutral',
      status: 'Active'
    };

    return this.validateCharacter(baseCharacter);
  }

  /**
   * Generate initial ability scores using 4d6 drop lowest method
   * @returns Generated ability scores
   */
  private static generateAbilityScores(): AbilityScores {
    const rollAbilityScore = () => {
      const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
      return rolls.sort((a, b) => b - a).slice(0, 3).reduce((a, b) => a + b, 0);
    };

    return {
      strength: rollAbilityScore(),
      dexterity: rollAbilityScore(),
      constitution: rollAbilityScore(),
      intelligence: rollAbilityScore(),
      wisdom: rollAbilityScore(),
      charisma: rollAbilityScore()
    };
  }

  /**
   * Generate a random character background
   * @returns Generated background
   */
  private static generateBackground(): CharacterBackground {
    const backgroundTemplates = [
      'Raised in a small village',
      'Orphaned at a young age',
      'Trained by a master craftsman',
      'Descended from noble lineage'
    ];

    const personalityTraits = [
      'Brave', 'Cautious', 'Curious', 'Loyal', 'Ambitious'
    ];

    const ideals = [
      'Justice', 'Knowledge', 'Freedom', 'Power', 'Tradition'
    ];

    const bonds = [
      'Protect my family', 'Seek revenge', 'Prove my worth', 'Explore the world'
    ];

    const flaws = [
      'Overconfident', 'Stubborn', 'Impulsive', 'Greedy', 'Secretive'
    ];

    return {
      origin: backgroundTemplates[Math.floor(Math.random() * backgroundTemplates.length)],
      personalityTraits: [personalityTraits[Math.floor(Math.random() * personalityTraits.length)]],
      ideals: [ideals[Math.floor(Math.random() * ideals.length)]],
      bonds: [bonds[Math.floor(Math.random() * bonds.length)]],
      flaws: [flaws[Math.floor(Math.random() * flaws.length)]],
      backstory: this.generateBackstoryNarrative()
    };
  }

  /**
   * Generate a narrative backstory
   * @returns Generated backstory text
   */
  private static generateBackstoryNarrative(): string {
    const backstoryTemplates = [
      '{name} was born in {origin}, dreaming of adventure.',
      'Driven by {ideal}, {name} left home to pursue {bond}.',
      'A mysterious prophecy shaped {name}'s destiny from childhood.',
      '{name} carries the weight of {flaw}, seeking redemption.'
    ];

    const template = backstoryTemplates[Math.floor(Math.random() * backstoryTemplates.length)];
    return template
      .replace('{name}', 'Adventurer')
      .replace('{origin}', 'a small village')
      .replace('{ideal}', 'justice')
      .replace('{bond}', 'a greater purpose')
      .replace('{flaw}', 'past mistakes');
  }

  /**
   * Initialize character skills
   * @returns Initial skill set
   */
  private static initializeSkills(): CharacterSkills {
    const baseSkills = [
      'Concentration', 'Diplomacy', 'Hide', 'Listen', 
      'Move Silently', 'Search', 'Spot', 'Survival'
    ];

    return baseSkills.reduce((skills, skillName) => {
      skills[skillName] = {
        rank: 0,
        modifier: 0,
        isClassSkill: false
      };
      return skills;
    }, {});
  }

  /**
   * Validate character creation
   * @param character Character to validate
   * @returns Validated character
   */
  private static validateCharacter(character: Character): Character {
    // Add comprehensive validation logic
    if (character.classes.length === 0) {
      throw new Error('Character must have at least one class');
    }

    // Additional validation checks can be added here

    return character;
  }
}
