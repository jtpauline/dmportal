import { Monster } from '../monsters';
import { Character } from '../characters';
import { RandomGenerator } from './random-generator';

export interface NarrativeGenerationOptions {
  terrain: string;
  environmentalFactors: string[];
  monsters: Monster[];
  characters: Character[];
}

export interface EncounterNarrative {
  introduction: string;
  environmentalDescription: string;
  monsterMotivation: string;
  potentialTwists: string[];
  challengeHints: string[];
  atmosphericElements: {
    mood: string;
    soundscape: string;
    visualDescription: string;
  };
}

export class NarrativeGenerator {
  /**
   * Generate a comprehensive narrative for an encounter
   * @param options Narrative generation parameters
   * @returns Detailed encounter narrative
   */
  static generateNarrative(options: NarrativeGenerationOptions): EncounterNarrative {
    const { 
      terrain, 
      environmentalFactors, 
      monsters, 
      characters 
    } = options;

    return {
      introduction: this.generateIntroduction(terrain, monsters),
      environmentalDescription: this.generateEnvironmentalDescription(terrain, environmentalFactors),
      monsterMotivation: this.generateMonsterMotivation(monsters),
      potentialTwists: this.generatePotentialTwists(monsters, characters),
      challengeHints: this.generateChallengeHints(monsters, characters),
      atmosphericElements: this.generateAtmosphericElements(terrain, monsters)
    };
  }

  /**
   * Generate an engaging encounter introduction
   * @param terrain Encounter terrain
   * @param monsters Encounter monsters
   * @returns Narrative introduction
   */
  private static generateIntroduction(terrain: string, monsters: Monster[]): string {
    const terrainIntros = {
      'forest': [
        'The dense canopy filters dim light, creating an eerie atmosphere.',
        'Ancient trees loom overhead, their branches casting long shadows.',
        'Moss-covered ground muffles your footsteps as tension builds.'
      ],
      'mountain': [
        'Jagged peaks rise around you, creating treacherous terrain.',
        'Cold winds whisper warnings of impending danger.',
        'Rocky outcroppings provide both cover and potential ambush points.'
      ],
      'underground': [
        'Damp stone walls close in, limiting visibility and movement.',
        'Echoes of distant sounds create an unsettling atmosphere.',
        'Narrow passages promise unexpected encounters.'
      ],
      'urban': [
        'Narrow streets and towering buildings create a claustrophobic battleground.',
        'Shadows dance between crumbling structures and forgotten alleyways.',
        'The city itself seems to hold its breath in anticipation.'
      ]
    };

    const monsterTypes = [...new Set(monsters.map(m => m.type))];
    const monsterDescriptors = monsterTypes.map(type => {
      const descriptorMap = {
        'Beast': 'primal predators',
        'Dragon': 'ancient and terrifying creatures',
        'Humanoid': 'cunning adversaries',
        'Undead': 'nightmarish entities',
        'Fiend': 'infernal threats'
      };
      return descriptorMap[type] || 'mysterious entities';
    });

    const introTemplates = [
      `As you enter the ${terrain}, ${monsterDescriptors.join(' and ')} emerge from the shadows.`,
      `The ${terrain} transforms into a battlefield as ${monsterDescriptors.join(' and ')} converge.`,
      `Danger lurks in every shadow of this ${terrain}, with ${monsterDescriptors.join(' and ')} ready to strike.`
    ];

    return introTemplates[Math.floor(Math.random() * introTemplates.length)] + ' ' +
      (terrainIntros[terrain] || terrainIntros['forest'])[Math.floor(Math.random() * 3)];
  }

  /**
   * Generate a detailed environmental description
   * @param terrain Encounter terrain
   * @param environmentalFactors Additional environmental factors
   * @returns Environmental description
   */
  private static generateEnvironmentalDescription(
    terrain: string, 
    environmentalFactors: string[]
  ): string {
    const baseDescriptions = {
      'forest': 'A dense forest with thick undergrowth and towering trees.',
      'mountain': 'A rugged mountain landscape with steep cliffs and rocky terrain.',
      'underground': 'A dark, claustrophobic network of caverns and tunnels.',
      'urban': 'A maze-like urban environment with narrow streets and tall buildings.'
    };

    const additionalFactors = environmentalFactors.map(factor => {
      const factorDescriptions = {
        'mist': 'Thick mist obscures vision, creating an ethereal atmosphere.',
        'rain': 'Heavy rain creates slippery and challenging terrain.',
        'darkness': 'Shadows deepen, making movement and perception difficult.',
        'wind': 'Powerful gusts threaten to throw combatants off balance.'
      };
      return factorDescriptions[factor] || `Unique environmental factor: ${factor}`;
    });

    return `${baseDescriptions[terrain] || baseDescriptions['forest']} ${
      additionalFactors.length > 0 ? additionalFactors.join(' ') : ''
    }`;
  }

  /**
   * Generate monster motivation for the encounter
   * @param monsters Encounter monsters
   * @returns Monster motivation narrative
   */
  private static generateMonsterMotivation(monsters: Monster[]): string {
    const motivationTemplates = {
      'Beast': [
        'Driven by primal hunger and territorial instincts.',
        'Protecting their hunting grounds with savage determination.',
        'Responding to threats to their pack or territory.'
      ],
      'Dragon': [
        'Defending their ancient lair with legendary ferocity.',
        'Seeking to expand their dominion and crush potential threats.',
        'Driven by an inscrutable draconic agenda.'
      ],
      'Humanoid': [
        'Pursuing complex political or tribal objectives.',
        'Defending their homeland or resources.',
        'Executing a carefully planned strategic assault.'
      ],
      'Undead': [
        'Bound by a curse or dark necromantic purpose.',
        'Seeking to spread their unholy corruption.',
        'Driven by an unending hunger for life force.'
      ],
      'Fiend': [
        'Executing a diabolic scheme to corrupt or destroy.',
        'Harvesting souls or spreading chaos.',
        'Responding to a summoning or ancient pact.'
      ]
    };

    const uniqueMonsterTypes = [...new Set(monsters.map(m => m.type))];
    return uniqueMonsterTypes
      .map(type => 
        (motivationTemplates[type] || motivationTemplates['Beast'])[
          Math.floor(Math.random() * 3)
        ]
      )
      .join(' ');
  }

  /**
   * Generate potential narrative twists
   * @param monsters Encounter monsters
   * @param characters Player characters
   * @returns Array of potential narrative twists
   */
  private static generatePotentialTwists(
    monsters: Monster[], 
    characters: Character[]
  ): string[] {
    const twistTemplates = [
      'A hidden monster emerges from an unexpected location.',
      'The environment suddenly changes, creating new challenges.',
      'An unexpected alliance or betrayal occurs mid-encounter.',
      'A previously defeated monster returns with enhanced abilities.',
      'A character\'s hidden ability or secret becomes crucial.'
    ];

    const monsterTwists = monsters.map(monster => {
      const monsterSpecificTwists = {
        'Beast': 'The monsters coordinate in an unexpectedly intelligent manner.',
        'Dragon': 'The dragon reveals a devastating special ability.',
        'Undead': 'The defeated monsters begin to regenerate.',
        'Fiend': 'A summoning ritual begins, potentially bringing more threats.'
      };
      return monsterSpecificTwists[monster.type] || twistTemplates[0];
    });

    return [
      ...monsterTwists,
      ...twistTemplates.slice(0, 2)
    ].sort(() => Math.random() - 0.5).slice(0, 3);
  }

  /**
   * Generate challenge hints for players
   * @param monsters Encounter monsters
   * @param characters Player characters
   * @returns Array of challenge hints
   */
  private static generateChallengeHints(
    monsters: Monster[], 
    characters: Character[]
  ): string[] {
    const hintTemplates = [
      'Carefully manage resources and positioning.',
      'Look for environmental advantages.',
      'Coordinate character abilities for maximum effect.',
      'Be prepared for unexpected monster tactics.'
    ];

    const monsterSpecificHints = monsters.map(monster => {
      const hints = {
        'Beast': 'Expect unpredictable and aggressive movement patterns.',
        'Dragon': 'Prepare for powerful area of effect attacks.',
        'Undead': 'Radiant damage and turn undead abilities will be crucial.',
        'Fiend': 'Resist magical manipulation and corruption attempts.'
      };
      return hints[monster.type] || hintTemplates[0];
    });

    return [
      ...monsterSpecificHints,
      ...hintTemplates
    ].sort(() => Math.random() - 0.5).slice(0, 3);
  }

  /**
   * Generate atmospheric elements for the encounter
   * @param terrain Encounter terrain
   * @param monsters Encounter monsters
   * @returns Atmospheric elements description
   */
  private static generateAtmosphericElements(
    terrain: string, 
    monsters: Monster[]
  ): {
    mood: string;
    soundscape: string;
    visualDescription: string;
  } {
    const moodMap = {
      'forest': ['Primal and tense', 'Mysterious and foreboding', 'Wild and unpredictable'],
      'mountain': ['Harsh and unforgiving', 'Majestic and dangerous', 'Isolating and challenging'],
      'underground': ['Claustrophobic and oppressive', 'Dark and menacing', 'Echoing with unknown threats'],
      'urban': ['Chaotic and unpredictable', 'Tense and confined', 'Layered with hidden dangers']
    };

    const soundscapeMap = {
      'forest': ['Rustling leaves', 'Distant animal calls', 'Creaking branches'],
      'mountain': ['Howling winds', 'Falling rocks', 'Echoing distant sounds'],
      'underground': ['Dripping water', 'Distant rumbling', 'Eerie silence'],
      'urban': ['Distant city sounds', 'Echoing footsteps', 'Muffled urban noise']
    };

    const monsterTypeVisuals = {
      'Beast': 'Primal and raw movement',
      'Dragon': 'Majestic and terrifying presence',
      'Undead': 'Unnatural and unsettling motion',
      'Fiend': 'Otherworldly and corrupt manifestation'
    };

    const uniqueMonsterType = monsters[0]?.type || 'Beast';

    return {
      mood: moodMap[terrain][Math.floor(Math.random() * 3)],
      soundscape: soundscapeMap[terrain][Math.floor(Math.random() * 3)],
      visualDescription: `${monsterTypeVisuals[uniqueMonsterType] || 'Dynamic and intense'} amidst ${terrain} terrain`
    };
  }
}
