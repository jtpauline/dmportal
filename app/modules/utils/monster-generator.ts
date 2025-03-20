import { RandomGenerator } from './random-generator';
import { Monster, MonsterType, MonsterSize, Alignment } from '../monsters';

export class MonsterGenerator {
  /**
   * Generate a random monster with configurable parameters
   * @param options Monster generation options
   * @returns Randomly generated monster
   */
  static generateMonster(options: {
    type?: MonsterType;
    size?: MonsterSize;
    challengeRating?: number;
    environment?: string[];
  } = {}): Monster {
    const {
      type = this.randomMonsterType(),
      size = this.randomMonsterSize(),
      challengeRating = this.calculateChallengeRating(),
      environment = this.generateEnvironment()
    } = options;

    return {
      id: crypto.randomUUID(),
      name: this.generateMonsterName(type),
      type,
      size,
      
      // Core Stats
      armorClass: this.calculateArmorClass(size, challengeRating),
      hitPoints: this.calculateHitPoints(size, challengeRating),
      speed: this.calculateSpeed(size),
      
      // Ability Scores
      strength: this.generateAbilityScore(),
      dexterity: this.generateAbilityScore(),
      constitution: this.generateAbilityScore(),
      intelligence: this.generateAbilityScore(),
      wisdom: this.generateAbilityScore(),
      charisma: this.generateAbilityScore(),
      
      // Combat Relevant
      challengeRating,
      experiencePoints: this.calculateExperiencePoints(challengeRating),
      
      // Defensive Capabilities
      damageResistances: this.generateDamageResistances(),
      damageImmunities: this.generateDamageImmunities(),
      conditionImmunities: this.generateConditionImmunities(),
      
      // Offensive Capabilities
      attacks: this.generateAttacks(challengeRating),
      
      // Additional Characteristics
      alignment: this.generateAlignment(type),
      environment,
      
      // Special Abilities
      specialAbilities: this.generateSpecialAbilities(challengeRating),
      
      // Lore and Description
      description: this.generateDescription(type, size),
      lore: this.generateLore(type)
    };
  }

  /**
   * Generate a random monster name based on type
   * @param type Monster type
   * @returns Generated monster name
   */
  private static generateMonsterName(type: MonsterType): string {
    const namePrefixes = {
      'Beast': ['Wild', 'Savage', 'Primal', 'Feral'],
      'Dragon': ['Ancient', 'Scaled', 'Chromatic', 'Metallic'],
      'Undead': ['Spectral', 'Haunting', 'Cursed', 'Shadowy'],
      'Humanoid': ['Tribal', 'Wandering', 'Nomadic', 'Clan']
    };

    const nameBase = [
      'Stalker', 'Hunter', 'Guardian', 'Warrior', 
      'Sentinel', 'Marauder', 'Defender', 'Prowler'
    ];

    const prefix = (namePrefixes[type] || [''])
      [Math.floor(Math.random() * (namePrefixes[type]?.length || 1))];
    const base = nameBase[Math.floor(Math.random() * nameBase.length)];

    return `${prefix} ${base}`;
  }

  /**
   * Randomly select monster type
   * @returns Randomly selected monster type
   */
  private static randomMonsterType(): MonsterType {
    const types: MonsterType[] = [
      'Beast', 'Dragon', 'Humanoid', 'Undead', 
      'Elemental', 'Fiend', 'Celestial', 'Construct'
    ];
    return types[Math.floor(Math.random() * types.length)];
  }

  /**
   * Randomly select monster size
   * @returns Randomly selected monster size
   */
  private static randomMonsterSize(): MonsterSize {
    const sizes: MonsterSize[] = [
      'Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'
    ];
    return sizes[Math.floor(Math.random() * sizes.length)];
  }

  /**
   * Calculate challenge rating with some randomness
   * @returns Calculated challenge rating
   */
  private static calculateChallengeRating(): number {
    return Math.max(0.25, Math.floor(Math.random() * 10) / 2);
  }

  /**
   * Generate monster environments
   * @returns Array of environments
   */
  private static generateEnvironment(): string[] {
    const environments = [
      'forest', 'mountain', 'desert', 'arctic', 
      'underground', 'urban', 'swamp', 'plains'
    ];
    const count = Math.floor(Math.random() * 3) + 1;
    return Array.from({ length: count }, () => 
      environments[Math.floor(Math.random() * environments.length)]
    );
  }

  /**
   * Generate ability score with some variation
   * @returns Generated ability score
   */
  private static generateAbilityScore(): number {
    return Math.floor(Math.random() * 15) + 5;
  }

  /**
   * Calculate armor class based on size and challenge rating
   * @param size Monster size
   * @param challengeRating Challenge rating
   * @returns Calculated armor class
   */
  private static calculateArmorClass(
    size: MonsterSize, 
    challengeRating: number
  ): number {
    const sizeModifiers = {
      'Tiny': -2, 'Small': -1, 'Medium': 0, 
      'Large': 1, 'Huge': 2, 'Gargantuan': 3
    };
    return 10 + Math.floor(challengeRating * 2) + (sizeModifiers[size] || 0);
  }

  /**
   * Calculate hit points based on size and challenge rating
   * @param size Monster size
   * @param challengeRating Challenge rating
   * @returns Calculated hit points
   */
  private static calculateHitPoints(
    size: MonsterSize, 
    challengeRating: number
  ): number {
    const sizeMultipliers = {
      'Tiny': 2, 'Small': 4, 'Medium': 8, 
      'Large': 16, 'Huge': 32, 'Gargantuan': 64
    };
    return Math.floor(challengeRating * 10 * (sizeMultipliers[size] || 8));
  }

  /**
   * Calculate monster speed based on size
   * @param size Monster size
   * @returns Calculated speed
   */
  private static calculateSpeed(size: MonsterSize): number {
    const speedMap = {
      'Tiny': 10, 'Small': 20, 'Medium': 30, 
      'Large': 40, 'Huge': 50, 'Gargantuan': 60
    };
    return speedMap[size] || 30;
  }

  /**
   * Calculate experience points based on challenge rating
   * @param challengeRating Challenge rating
   * @returns Calculated experience points
   */
  private static calculateExperiencePoints(challengeRating: number): number {
    const xpTable = [
      10, 25, 50, 100, 200, 400, 
      1000, 1800, 3900, 5000, 7500
    ];
    return xpTable[Math.min(Math.floor(challengeRating), xpTable.length - 1)];
  }

  /**
   * Generate damage resistances
   * @returns Array of damage resistances
   */
  private static generateDamageResistances(): string[] {
    const damageTypes = [
      'Bludgeoning', 'Piercing', 'Slashing', 
      'Fire', 'Cold', 'Lightning', 'Acid'
    ];
    return Math.random() > 0.7 
      ? [damageTypes[Math.floor(Math.random() * damageTypes.length)]]
      : [];
  }

  /**
   * Generate damage immunities
   * @returns Array of damage immunities
   */
  private static generateDamageImmunities(): string[] {
    const damageTypes = [
      'Poison', 'Necrotic', 'Psychic', 'Radiant'
    ];
    return Math.random() > 0.8 
      ? [damageTypes[Math.floor(Math.random() * damageTypes.length)]]
      : [];
  }

  /**
   * Generate condition immunities
   * @returns Array of condition immunities
   */
  private static generateConditionImmunities(): string[] {
    const conditions = [
      'Poisoned', 'Charmed', 'Frightened', 'Paralyzed'
    ];
    return Math.random() > 0.8 
      ? [conditions[Math.floor(Math.random() * conditions.length)]]
      : [];
  }

  /**
   * Generate monster attacks
   * @param challengeRating Challenge rating
   * @returns Array of monster attacks
   */
  private static generateAttacks(challengeRating: number): any[] {
    const attackTypes = [
      { name: 'Bite', damage: `1d${6 + Math.floor(challengeRating * 2)}` },
      { name: 'Claw', damage: `1d${8 + Math.floor(challengeRating * 2)}` },
      { name: 'Tail Slap', damage: `1d${10 + Math.floor(challengeRating * 2)}` }
    ];
    
    const attackCount = Math.floor(Math.random() * 2) + 1;
    return Array.from({ length: attackCount }, () => ({
      ...attackTypes[Math.floor(Math.random() * attackTypes.length)],
      toHitBonus: Math.floor(challengeRating)
    }));
  }

  /**
   * Generate monster alignment based on type
   * @param type Monster type
   * @returns Generated alignment
   */
  private static generateAlignment(type: MonsterType): Alignment {
    const alignmentMap = {
      'Beast': 'True Neutral',
      'Dragon': ['Lawful Evil', 'Chaotic Evil', 'Lawful Good'],
      'Humanoid': [
        'Lawful Good', 'Neutral Good', 'Chaotic Good',
        'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
        'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'
      ],
      'Undead': ['Neutral Evil', 'Chaotic Evil'],
      'Elemental': 'True Neutral',
      'Fiend': ['Lawful Evil', 'Neutral Evil', 'Chaotic Evil'],
      'Celestial': ['Lawful Good', 'Neutral Good', 'Chaotic Good'],
      'Construct': 'True Neutral'
    };

    const possibleAlignments = alignmentMap[type] || ['True Neutral'];
    return Array.isArray(possibleAlignments)
      ? possibleAlignments[Math.floor(Math.random() * possibleAlignments.length)]
      : possibleAlignments;
  }

  /**
   * Generate special abilities
   * @param challengeRating Challenge rating
   * @returns Array of special abilities
   */
  private static generateSpecialAbilities(challengeRating: number): any[] {
    const abilities = [
      { 
        name: 'Regeneration', 
        description: `Regains ${Math.floor(challengeRating)} hit points at the start of its turn`
      },
      { 
        name: 'Multiattack', 
        description: `Can make ${Math.floor(challengeRating / 2) + 1} attacks per turn`
      },
      { 
        name: 'Keen Senses', 
        description: 'Advantage on Perception checks' 
      }
    ];

    return Math.random() > 0.6 
      ? [abilities[Math.floor(Math.random() * abilities.length)]]
      : [];
  }

  /**
   * Generate monster description
   * @param type Monster type
   * @param size Monster size
   * @returns Generated description
   */
  private static generateDescription(type: MonsterType, size: MonsterSize): string {
    const descriptors = {
      'Beast': ['Primal', 'Savage', 'Untamed'],
      'Dragon': ['Majestic', 'Ancient', 'Powerful'],
      'Humanoid': ['Cunning', 'Resourceful', 'Adaptable'],
      'Undead': ['Haunting', 'Spectral', 'Cursed']
    };

    const sizeDescriptors = {
      'Tiny': 'diminutive',
      'Small': 'small',
      'Medium': 'average-sized',
      'Large': 'towering',
      'Huge': 'massive',
      'Gargantuan': 'colossal'
    };

    const descriptor = (descriptors[type] || ['Mysterious'])[0];
    return `A ${sizeDescriptors[size]} ${type.toLowerCase()} with a ${descriptor} presence.`;
  }

  /**
   * Generate monster lore
   * @param type Monster type
   * @returns Generated lore text
   */
  private static generateLore(type: MonsterType): string {
    const loreSections = {
      'Beast': 'Creatures of instinct and survival',
      'Dragon': 'Ancient beings of immense power and wisdom',
      'Humanoid': 'Complex societies with intricate social structures',
      'Undead': 'Remnants of past lives, bound by dark magic'
    };

    return loreSections[type] || 'A mysterious entity with unknown origins.';
  }
}
