import { Campaign } from '../campaigns';
import { Character } from '../characters';
import { NarrativeComplexityAnalyzer } from './narrative-complexity-analyzer';

export interface NarrativeEvent {
  type: string;
  description: string;
  impact: number;
  personalGrowth: {
    skillImprovement?: string;
    personalityShift?: string;
  };
}

export class CharacterNarrativeSystem {
  /**
   * Generate Personal Narrative Event
   */
  static generatePersonalNarrativeEvent(
    character: Character, 
    campaign: Campaign
  ): NarrativeEvent {
    const complexityMetrics = NarrativeComplexityAnalyzer.analyzeNarrativeComplexity(
      campaign, 
      [character]
    );

    // Determine event type based on character complexity
    const eventType = this.determineEventType(character, complexityMetrics);

    // Generate specific narrative event
    return this.createPersonalNarrativeEvent(character, eventType, complexityMetrics);
  }

  /**
   * Integrate Narrative Event
   */
  static integrateNarrativeEvent(
    character: Character, 
    narrativeEvent: NarrativeEvent
  ): void {
    // Update character narrative history
    character.narrativeHistory.push({
      eventType: narrativeEvent.type,
      description: narrativeEvent.description,
      timestamp: Date.now()
    });

    // Apply personal growth impacts
    this.applyPersonalGrowth(character, narrativeEvent);

    // Potential character progression
    this.triggerCharacterProgression(character, narrativeEvent);
  }

  /**
   * Determine Event Type
   */
  private static determineEventType(
    character: Character, 
    complexityMetrics: any
  ): string {
    const eventTypes = [
      'Personal Challenge',
      'Moral Dilemma',
      'Unexpected Revelation',
      'Transformative Experience',
      'Skill Mastery Moment'
    ];

    // Select event type based on character complexity
    const eventTypeIndex = Math.floor(
      complexityMetrics.characterInterconnectedness * eventTypes.length
    );

    return eventTypes[eventTypeIndex] || 'Personal Challenge';
  }

  /**
   * Create Personal Narrative Event
   */
  private static createPersonalNarrativeEvent(
    character: Character, 
    eventType: string,
    complexityMetrics: any
  ): NarrativeEvent {
    const eventDescriptions = {
      'Personal Challenge': [
        `${character.name} faces a challenging situation that tests their resolve`,
        `An unexpected obstacle forces ${character.name} to confront personal limitations`
      ],
      'Moral Dilemma': [
        `${character.name} encounters a complex ethical decision with no clear right answer`,
        `A situation challenges ${character.name}'s core beliefs and values`
      ],
      'Unexpected Revelation': [
        `${character.name} uncovers a shocking truth about their past`,
        `A sudden insight dramatically changes ${character.name}'s perspective`
      ],
      'Transformative Experience': [
        `${character.name} undergoes a profound personal transformation`,
        `A life-changing moment reshapes ${character.name}'s understanding of themselves`
      ],
      'Skill Mastery Moment': [
        `${character.name} achieves a breakthrough in their primary skill`,
        `An intense training or challenge leads to significant skill improvement`
      ]
    };

    // Calculate event impact based on complexity metrics
    const eventImpact = (
      complexityMetrics.characterInterconnectedness * 0.4 +
      complexityMetrics.narrativeDepth * 0.3 +
      complexityMetrics.plotDynamism * 0.3
    );

    // Select random description for the event type
    const descriptions = eventDescriptions[eventType] || [];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];

    return {
      type: eventType,
      description,
      impact: eventImpact,
      personalGrowth: this.generatePersonalGrowth(character, eventType)
    };
  }

  /**
   * Generate Personal Growth
   */
  private static generatePersonalGrowth(
    character: Character, 
    eventType: string
  ): NarrativeEvent['personalGrowth'] {
    const growthMap = {
      'Personal Challenge': {
        skillImprovement: 'Resilience and adaptability enhanced',
        personalityShift: 'Increased self-awareness and emotional maturity'
      },
      'Moral Dilemma': {
        skillImprovement: 'Ethical reasoning and decision-making skills improved',
        personalityShift: 'Deeper understanding of personal values'
      },
      'Unexpected Revelation': {
        skillImprovement: 'Perception and intuition sharpened',
        personalityShift: 'Fundamental worldview transformation'
      },
      'Transformative Experience': {
        skillImprovement: 'Emotional intelligence and self-reflection developed',
        personalityShift: 'Significant personal growth and self-discovery'
      },
      'Skill Mastery Moment': {
        skillImprovement: 'Primary skill significantly advanced',
        personalityShift: 'Increased confidence and professional identity'
      }
    };

    return growthMap[eventType] || {};
  }

  /**
   * Apply Personal Growth
   */
  private static applyPersonalGrowth(
    character: Character, 
    narrativeEvent: NarrativeEvent
  ): void {
    // Potential skill or attribute improvements
    if (narrativeEvent.personalGrowth.skillImprovement) {
      // Implement skill or attribute improvement logic
      // This could involve updating character stats, skills, or abilities
    }
  }

  /**
   * Trigger Character Progression
   */
  private static triggerCharacterProgression(
    character: Character, 
    narrativeEvent: NarrativeEvent
  ): void {
    // Check if event meets progression threshold
    if (narrativeEvent.impact > 0.7) {
      // Potential character class or ability unlocking
      // Implement progression mechanics
    }
  }

  /**
   * Generate Character Narrative Forecast
   */
  static generateCharacterNarrativeForecast(
    character: Character, 
    campaign: Campaign
  ): {
    potentialCharacterArcs: string[];
    personalChallenges: string[];
    growthOpportunities: string[];
  } {
    const complexityMetrics = NarrativeComplexityAnalyzer.analyzeNarrativeComplexity(
      campaign, 
      [character]
    );

    return {
      potentialCharacterArcs: this.generatePotentialCharacterArcs(character, complexityMetrics),
      personalChallenges: this.generatePersonalChallenges(character),
      growthOpportunities: this.identifyGrowthOpportunities(character, complexityMetrics)
    };
  }

  /**
   * Generate Potential Character Arcs
   */
  private static generatePotentialCharacterArcs(
    character: Character, 
    complexityMetrics: any
  ): string[] {
    const arcTemplates = [
      'Redemption Journey',
      'Hero\'s Transformation',
      'Philosophical Awakening',
      'Power and Responsibility',
      'Personal Sacrifice'
    ];

    // Select arcs based on character complexity
    const arcCount = Math.ceil(complexityMetrics.characterInterconnectedness * 3);
    return arcTemplates.slice(0, arcCount);
  }

  /**
   * Generate Personal Challenges
   */
  private static generatePersonalChallenges(character: Character): string[] {
    const challengeTemplates = [
      'Overcome a deep-seated fear',
      'Reconcile conflicting personal beliefs',
      'Confront a past trauma',
      'Challenge personal limitations'
    ];

    return challengeTemplates.filter(() => Math.random() < 0.5);
  }

  /**
   * Identify Growth Opportunities
   */
  private static identifyGrowthOpportunities(
    character: Character, 
    complexityMetrics: any
  ): string[] {
    const opportunityTemplates = [
      'Advanced skill training',
      'Unique magical research',
      'Diplomatic mission',
      'Spiritual or philosophical exploration'
    ];

    // Select opportunities based on character complexity
    const opportunityCount = Math.ceil(complexityMetrics.plotDynamism * 3);
    return opportunityTemplates.slice(0, opportunityCount);
  }
}
