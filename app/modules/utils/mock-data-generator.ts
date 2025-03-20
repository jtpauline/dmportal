import { Character } from '../characters';
import { Spell } from './spell-system';
import { v4 as uuidv4 } from 'uuid';

export class MockDataGenerator {
  static generateMockSpell(overrides: Partial<Spell> = {}): Spell {
    const spellSchools = ['Evocation', 'Abjuration', 'Conjuration', 'Illusion', 'Necromancy'];
    const spellNames = [
      'Fireball', 'Shield', 'Magic Missile', 'Invisibility', 
      'Healing Word', 'Detect Magic', 'Lightning Bolt', 'Mage Armor'
    ];

    return {
      id: overrides.id || uuidv4(),
      name: overrides.name || spellNames[Math.floor(Math.random() * spellNames.length)],
      level: overrides.level || Math.floor(Math.random() * 5) + 1,
      school: overrides.school || spellSchools[Math.floor(Math.random() * spellSchools.length)],
      description: overrides.description || 'A powerful magical spell with unique effects.',
      concentration: overrides.concentration || Math.random() > 0.5,
      effects: overrides.effects || [
        { 
          type: 'damage', 
          value: Math.floor(Math.random() * 20) + 1 
        }
      ]
    };
  }

  static generateMockCharacter(overrides: Partial<Character> = {}): Character {
    const classes = ['Wizard', 'Cleric', 'Druid', 'Sorcerer', 'Warlock'];
    const races = ['Human', 'Elf', 'Dwarf'];

    const baseCharacter: Character = {
      id: overrides.id || uuidv4(),
      name: overrides.name || 'Mock Character',
      race: overrides.race || races[Math.floor(Math.random() * races.length)],
      class: overrides.class || classes[Math.floor(Math.random() * classes.length)],
      level: overrides.level || Math.floor(Math.random() * 10) + 1,
      experience: overrides.experience || 0,
      status: 'Active',
      abilityScores: overrides.abilityScores || {
        strength: 10,
        dexterity: 12,
        constitution: 14,
        intelligence: 16,
        wisdom: 13,
        charisma: 11
      },
      hitPoints: overrides.hitPoints || 50,
      armorClass: overrides.armorClass || 15,
      spells: overrides.spells || Array.from(
        { length: Math.floor(Math.random() * 6) + 2 }, 
        () => this.generateMockSpell()
      ),
      campaignId: overrides.campaignId || uuidv4(),
      inventory: [],
      traits: {
        personality: ['Curious'],
        ideals: ['Knowledge'],
        bonds: ['Magical Research'],
        flaws: ['Overconfident']
      }
    };

    return baseCharacter;
  }
}
