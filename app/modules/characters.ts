// Centralized type definitions to resolve potential import issues
export type CharacterRace = 
  'Human' | 'Elf' | 'Dwarf' | 'Halfling' | 'Gnome' | 
  'Tiefling' | 'Dragonborn' | 'Half-Elf' | 'Half-Orc';

export type CharacterClass = 
  'Fighter' | 'Wizard' | 'Rogue' | 'Cleric' | 
  'Barbarian' | 'Ranger' | 'Paladin' | 'Druid' | 
  'Monk' | 'Warlock' | 'Sorcerer' | 'Bard';

export interface Character {
  id?: string;
  name: string;
  race: CharacterRace;
  class: CharacterClass;
  level: number;
  abilities?: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
}
