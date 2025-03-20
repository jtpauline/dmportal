import { Campaign, CampaignType } from './campaigns';
import { Character } from './characters';
import { Encounter } from './encounters';

export interface NarrativeContext {
  campaign: Campaign;
  characters: Character[];
  currentEncounter?: Encounter;
}

export class CampaignNarrativeGenerator {
  /**
   * Generate a narrative segment based on campaign context
   */
  static generateNarrativeSegment(context: NarrativeContext): string {
    const narrativeGenerators = {
      'Dungeon Crawl': this.generateDungeonCrawlNarrative,
      'Wilderness Adventure': this.generateWildernessNarrative,
      'Urban Campaign': this.generateUrbanNarrative,
      'Planar Adventure': this.generatePlanarNarrative,
      'Political Intrigue': this.generatePoliticalIntrigueNarrative
    };

    const generator = narrativeGenerators[context.campaign.setting.type];
    return generator ? generator(context) : this.generateGenericNarrative(context);
  }

  /**
   * Dungeon Crawl Narrative Generation
   */
  private static generateDungeonCrawlNarrative(context: NarrativeContext): string {
    const dungeonDescriptors = [
      'ancient', 'forgotten', 'treacherous', 'mysterious', 'labyrinthine'
    ];
    const encounterTypes = [
      'monster ambush', 'trap-laden corridor', 'hidden treasure room', 
      'arcane puzzle chamber', 'dark ritual site'
    ];

    return `In the ${this.getRandomItem(dungeonDescriptors)} depths, 
      ${context.characters[0].name} and companions navigate a 
      ${this.getRandomItem(encounterTypes)}, their torches casting 
      flickering shadows against ancient stone walls.`;
  }

  /**
   * Wilderness Adventure Narrative Generation
   */
  private static generateWildernessNarrative(context: NarrativeContext): string {
    const terrainTypes = [
      'dense forest', 'mountain pass', 'rocky badlands', 
      'mist-shrouded valley', 'windswept plains'
    ];
    const wildernessEvents = [
      'tracking a legendary beast', 'surviving harsh environmental conditions', 
      'discovering an ancient ruin', 'navigating treacherous terrain'
    ];

    return `Traversing the ${this.getRandomItem(terrainTypes)}, 
      ${context.characters[0].name}'s party finds themselves 
      ${this.getRandomItem(wildernessEvents)}, testing their survival skills 
      and adventuring prowess.`;
  }

  /**
   * Urban Campaign Narrative Generation
   */
  private static generateUrbanNarrative(context: NarrativeContext): string {
    const urbanSettings = [
      'crowded marketplace', 'shadowy back alley', 'noble's mansion', 
      'thieves' guild hideout', 'bustling tavern'
    ];
    const urbanIntrigues = [
      'uncovering a conspiracy', 'negotiating a delicate political alliance', 
      'tracking a notorious criminal', 'resolving a merchant dispute'
    ];

    return `Amidst the ${this.getRandomItem(urbanSettings)} of 
      ${context.campaign.setting.primaryRegion}, 
      ${context.characters[0].name} becomes entangled in 
      ${this.getRandomItem(urbanIntrigues)}, navigating the 
      complex social landscape.`;
  }

  /**
   * Planar Adventure Narrative Generation
   */
  private static generatePlanarNarrative(context: NarrativeContext): string {
    const planarRealms = [
      'Ethereal Plane', 'Shadowfell', 'Elemental Chaos', 
      'Astral Dominion', 'Feywild'
    ];
    const planarChallenges = [
      'negotiating with extraplanar entities', 
      'surviving reality-warping environments', 
      'preventing a planar convergence', 
      'rescuing souls from dimensional prison'
    ];

    return `Transported to the ${this.getRandomItem(planarRealms)}, 
      ${context.characters[0].name} confronts the challenge of 
      ${this.getRandomItem(planarChallenges)}, where the very 
      fabric of reality bends to unknown laws.`;
  }

  /**
   * Political Intrigue Narrative Generation
   */
  private static generatePoliticalIntrigueNarrative(context: NarrativeContext): string {
    const politicalSettings = [
      'royal court', 'secret council chamber', 
      'diplomatic negotiation', 'underground resistance meeting'
    ];
    const intrigueTypes = [
      'uncovering a royal assassination plot', 
      'mediating a critical diplomatic dispute', 
      'exposing corrupt government officials', 
      'preventing a potential civil war'
    ];

    return `Within the intricate web of the ${this.getRandomItem(politicalSettings)}, 
      ${context.characters[0].name} becomes a pivotal figure in 
      ${this.getRandomItem(intrigueTypes)}, where words can be 
      more dangerous than weapons.`;
  }

  /**
   * Generic Narrative Fallback
   */
  private static generateGenericNarrative(context: NarrativeContext): string {
    const genericAdventureHooks = [
      'embarking on a perilous quest', 
      'facing an unexpected challenge', 
      'unraveling an ancient mystery', 
      'confronting a moral dilemma'
    ];

    return `${context.characters[0].name} and companions find themselves 
      ${this.getRandomItem(genericAdventureHooks)}, their destiny 
      intertwined with the unfolding narrative of their campaign.`;
  }

  /**
   * Utility method to get a random item from an array
   */
  private static getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
}
