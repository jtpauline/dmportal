import { Character } from '../characters';
import { Monster } from '../monsters';
import { RandomGenerator } from './random-generator';
import { TacticalInsightsGenerator } from './tactical-insights-generator';
import { EnvironmentalInteractionSystem } from './environmental-interaction-system';

export interface NarrativeGenerationContext {
  characters: Character[];
  monsters: Monster[];
  terrain: string;
  environmentalFactors: string[];
  campaignStage: number;
}

export interface EncounterNarrative {
  encounterSetup: string;
  initialDescription: string;
  potentialPlotTwists: string[];
  narrativeChallenges: string[];
  emotionalTone: string;
}

export class MachineLearningNarrativeGenerator {
  /**
   * Generate a comprehensive encounter narrative
   * @param context Narrative generation context
   * @returns Detailed encounter narrative
   */
  static generateEncounterNarrative(
    context: NarrativeGenerationContext
  ): EncounterNarrative {
    // Analyze tactical insights for narrative context
    const tacticalInsights = TacticalInsightsGenerator.generateTacticalInsights({
      characters: context.characters,
      monsters: context.monsters,
      terrain: context.terrain,
      environmentalFactors: context.environmentalFactors
    });

    // Analyze environmental interactions
    const environmentalInteractions = EnvironmentalInteractionSystem.analyzeEnvironmentalInteractions({
      characters: context.characters,
      monsters: context.monsters,
      terrain: context.terrain,
      environmentalFactors: context.environmentalFactors
    });

    // Generate narrative components
    const encounterSetup = this.generateEncounterSetup(context);
    const initialDescription = this.generateInitialDescription(
      context, 
      environmentalInteractions
    );
    const potentialPlotTwists = this.generatePotentialPlotTwists(context);
    const narrativeChallenges = this.generateNarrativeChallenges(
      tacticalInsights, 
      context
    );
    const emotionalTone = this.determineEmotionalTone(context);

    return {
      encounterSetup,
      initialDescription,
      potentialPlotTwists,
      narrativeChallenges,
      emotionalTone
    };
  }

  /**
   * Generate encounter setup narrative
   * @param context Narrative generation context
   * @returns Encounter setup description
   */
  private static generateEncounterSetup(
    context: NarrativeGenerationContext
  ): string {
    const setupTemplates = [
      'A sudden ambush interrupts the party\'s journey',
      'An unexpected alliance forms in the face of danger',
      'A long-awaited confrontation finally unfolds',
      'A mysterious force draws the characters into conflict',
      'A complex web of motivations sets the stage for battle'
    ];

    const terrainSpecificSetups = {
      'forest': [
        'Deep within the ancient woods, a hidden threat emerges',
        'The dense canopy conceals a brewing confrontation',
        'Whispers of ancient forest spirits hint at impending conflict'
      ],
      'mountain': [
        'High in the treacherous mountain passes, danger lurks',
        'Steep cliffs and narrow paths set the stage for a dramatic encounter',
        'The harsh mountain terrain becomes a battlefield'
      ],
      'underground': [
        'In the depths of forgotten caverns, an encounter takes shape',
        'Echoing tunnels amplify the tension of the impending conflict',
        'Darkness and stone become silent witnesses to the coming battle'
      ],
      'urban': [
        'Amidst the bustling city streets, conflict brews',
        'Urban intrigue and hidden agendas set the encounter\'s tone',
        'The complex urban landscape becomes a strategic battleground'
      ]
    };

    const terrainSetups = terrainSpecificSetups[context.terrain.toLowerCase()] || [];
    
    const characterContextSetups = context.characters.map(character => 
      `${character.name}'s past catches up in an unexpected confrontation`
    );

    const combinedSetups = [
      ...setupTemplates,
      ...terrainSetups,
      ...characterContextSetups
    ];

    return RandomGenerator.selectFromArray(combinedSetups);
  }

  /**
   * Generate initial encounter description
   * @param context Narrative generation context
   * @param environmentalInteractions Environmental interaction details
   * @returns Initial encounter description
   */
  private static generateInitialDescription(
    context: NarrativeGenerationContext,
    environmentalInteractions: ReturnType<typeof EnvironmentalInteractionSystem.analyzeEnvironmentalInteractions>
  ): string {
    const baseDescriptions = [
      'Tension builds as the characters assess the unfolding situation',
      'The battlefield comes into sharp focus, revealing its complexities',
      'A moment of anticipation hangs in the air before the conflict begins',
      'The environment itself seems to hold its breath, waiting for the first move'
    ];

    const environmentDescription = environmentalInteractions.description;
    const characterPreparations = context.characters
      .map(character => `${character.name} readies for the impending challenge`)
      .join('. ');

    const monsterDescriptions = context.monsters
      .map(monster => `A ${monster.name} emerges, its presence both threatening and mysterious`)
      .join('. ');

    return `${RandomGenerator.selectFromArray(baseDescriptions)}. ${environmentDescription}. ${characterPreparations}. ${monsterDescriptions}.`;
  }

  /**
   * Generate potential plot twists
   * @param context Narrative generation context
   * @returns Array of potential plot twists
   */
  private static generatePotentialPlotTwists(
    context: NarrativeGenerationContext
  ): string[] {
    const generalPlotTwists = [
      'An unexpected alliance shifts the balance of power',
      'A hidden motivation is revealed, changing everything',
      'A seemingly defeated enemy returns with a new strategy',
      'A environmental factor dramatically alters the encounter',
      'A character\'s hidden ability turns the tide'
    ];

    const characterSpecificTwists = context.characters.flatMap(character => [
      `${character.name} discovers a crucial piece of information mid-battle`,
      `An unexpected connection to the monsters is revealed for ${character.name}`
    ]);

    const monsterSpecificTwists = context.monsters.flatMap(monster => [
      `The ${monster.name} reveals a completely unexpected capability`,
      `A surprising motivation behind the ${monster.name}'s actions emerges`
    ]);

    const combinedTwists = [
      ...generalPlotTwists,
      ...characterSpecificTwists,
      ...monsterSpecificTwists
    ];

    return RandomGenerator.selectUniqueFromArray(
      combinedTwists, 
      Math.min(combinedTwists.length, 3)
    );
  }

  /**
   * Generate narrative challenges
   * @param tacticalInsights Generated tactical insights
   * @param context Narrative generation context
   * @returns Array of narrative challenges
   */
  private static generateNarrativeChallenges(
    tacticalInsights: ReturnType<typeof TacticalInsightsGenerator.generateTacticalInsights>,
    context: NarrativeGenerationContext
  ): string[] {
    const generalChallenges = [
      'Balancing individual character goals with group survival',
      'Navigating complex moral ambiguities',
      'Managing limited resources under extreme pressure',
      'Maintaining team cohesion in the face of overwhelming odds'
    ];

    const tacticalChallenges = tacticalInsights.potentialRisks;

    const characterSpecificChallenges = context.characters.flatMap(character => [
      `${character.name} must overcome personal limitations`,
      `Integrating ${character.name}'s unique abilities into the group strategy`
    ]);

    const combinedChallenges = [
      ...generalChallenges,
      ...tacticalChallenges,
      ...characterSpecificChallenges
    ];

    return RandomGenerator.selectUniqueFromArray(
      combinedChallenges, 
      Math.min(combinedChallenges.length, 4)
    );
  }

  /**
   * Determine emotional tone of the encounter
   * @param context Narrative generation context
   * @returns Emotional tone description
   */
  private static determineEmotionalTone(
    context: NarrativeGenerationContext
  ): string {
    const toneFactors = [
      'Tension and anticipation',
      'Desperate struggle for survival',
      'Calculated strategic confrontation',
      'Mysterious and unpredictable conflict',
      'Morally complex engagement'
    ];

    const characterEmotionalContext = context.characters.map(character => 
      `${character.name}'s personal stakes and emotional state`
    );

    const monsterEmotionalContext = context.monsters.map(monster => 
      `The ${monster.name}'s underlying motivations and emotional drive`
    );

    const combinedTones = [
      ...toneFactors,
      ...characterEmotionalContext,
      ...monsterEmotionalContext
    ];

    return RandomGenerator.selectFromArray(combinedTones);
  }
}
