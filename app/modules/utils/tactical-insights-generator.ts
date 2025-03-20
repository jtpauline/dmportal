import { Character } from '../characters';
import { Monster } from '../monsters';
import { RandomGenerator } from './random-generator';
import { EnvironmentalInteractionSystem } from './environmental-interaction-system';

export interface TacticalInsightsContext {
  characters: Character[];
  monsters: Monster[];
  terrain: string;
  environmentalFactors: string[];
}

export interface TacticalInsights {
  characterStrengths: string[];
  monsterWeaknesses: string[];
  strategicApproaches: string[];
  potentialRisks: string[];
  recommendedTactics: string[];
}

export class TacticalInsightsGenerator {
  /**
   * Generate comprehensive tactical insights
   * @param context Tactical insights generation context
   * @returns Detailed tactical insights
   */
  static generateTacticalInsights(
    context: TacticalInsightsContext
  ): TacticalInsights {
    // Analyze character composition
    const characterStrengths = this.analyzeCharacterStrengths(context.characters);
    
    // Analyze monster capabilities
    const monsterWeaknesses = this.analyzeMonsterWeaknesses(context.monsters);
    
    // Generate strategic approaches
    const strategicApproaches = this.generateStrategicApproaches(context);
    
    // Identify potential risks
    const potentialRisks = this.identifyPotentialRisks(context);
    
    // Generate recommended tactics
    const recommendedTactics = this.generateRecommendedTactics(context);

    return {
      characterStrengths,
      monsterWeaknesses,
      strategicApproaches,
      potentialRisks,
      recommendedTactics
    };
  }

  /**
   * Analyze character strengths and unique capabilities
   * @param characters Player characters
   * @returns Array of character strength descriptions
   */
  private static analyzeCharacterStrengths(
    characters: Character[]
  ): string[] {
    const strengthTemplates = [
      'High burst damage potential',
      'Exceptional crowd control abilities',
      'Strong defensive capabilities',
      'Versatile skill set',
      'Unique multiclass synergies'
    ];

    const classSpecificStrengths = {
      'Fighter': ['Consistent damage output', 'Superior martial prowess'],
      'Wizard': ['Powerful area of effect spells', 'Versatile magical utility'],
      'Rogue': ['High burst damage', 'Exceptional mobility'],
      'Cleric': ['Strong healing capabilities', 'Divine support abilities']
    };

    const characterStrengths = characters.flatMap(character => {
      const baseStrengths = RandomGenerator.selectUniqueFromArray(
        strengthTemplates, 
        2
      );
      
      const classStrengths = classSpecificStrengths[character.class] || [];
      
      return [
        ...baseStrengths,
        ...RandomGenerator.selectUniqueFromArray(classStrengths, 1)
      ];
    });

    return RandomGenerator.selectUniqueFromArray(
      characterStrengths, 
      Math.min(characterStrengths.length, 4)
    );
  }

  /**
   * Analyze monster weaknesses and vulnerabilities
   * @param monsters Encounter monsters
   * @returns Array of monster weakness descriptions
   */
  private static analyzeMonsterWeaknesses(
    monsters: Monster[]
  ): string[] {
    const weaknessTemplates = [
      'Vulnerable to specific damage types',
      'Limited mobility',
      'Predictable attack patterns',
      'Weak defensive capabilities',
      'Susceptible to crowd control'
    ];

    const monsterTypeWeaknesses = {
      'Beast': ['Susceptible to area of effect damage', 'Limited tactical intelligence'],
      'Dragon': ['Vulnerable to specific elemental damage', 'Potential aerial weakness'],
      'Undead': ['Radiant damage vulnerability', 'Turn undead susceptibility'],
      'Fiend': ['Divine magic vulnerability', 'Specific planar weaknesses']
    };

    const monsterWeaknesses = monsters.flatMap(monster => {
      const baseWeaknesses = RandomGenerator.selectUniqueFromArray(
        weaknessTemplates, 
        2
      );
      
      const typeWeaknesses = monsterTypeWeaknesses[monster.type] || [];
      
      return [
        ...baseWeaknesses,
        ...RandomGenerator.selectUniqueFromArray(typeWeaknesses, 1)
      ];
    });

    return RandomGenerator.selectUniqueFromArray(
      monsterWeaknesses, 
      Math.min(monsterWeaknesses.length, 4)
    );
  }

  /**
   * Generate strategic approaches for the encounter
   * @param context Tactical insights context
   * @returns Array of strategic approach descriptions
   */
  private static generateStrategicApproaches(
    context: TacticalInsightsContext
  ): string[] {
    // Analyze environmental interactions
    const environmentalInteractions = EnvironmentalInteractionSystem.analyzeEnvironmentalInteractions(context);

    const strategicTemplates = [
      'Leverage character synergies',
      'Exploit monster vulnerabilities',
      'Utilize environmental advantages',
      'Manage resource allocation strategically',
      'Maintain flexible tactical positioning'
    ];

    const environmentalTactics = environmentalInteractions.potentialTactics;

    return RandomGenerator.selectUniqueFromArray(
      [...strategicTemplates, ...environmentalTactics], 
      3
    );
  }

  /**
   * Identify potential risks in the encounter
   * @param context Tactical insights context
   * @returns Array of potential risk descriptions
   */
  private static identifyPotentialRisks(
    context: TacticalInsightsContext
  ): string[] {
    const riskTemplates = [
      'Unexpected monster abilities',
      'Complex environmental interactions',
      'Resource management challenges',
      'Potential character vulnerability',
      'High-risk tactical scenarios'
    ];

    const monsterTypeRisks = {
      'Beast': ['Unpredictable movement patterns', 'Potential pack tactics'],
      'Dragon': ['Devastating area of effect attacks', 'Legendary action capabilities'],
      'Undead': ['Regenerative capabilities', 'Morale-breaking abilities'],
      'Fiend': ['Magical corruption potential', 'Summoning capabilities']
    };

    const monsterRisks = context.monsters.flatMap(monster => {
      const baseRisks = RandomGenerator.selectUniqueFromArray(
        riskTemplates, 
        2
      );
      
      const typeRisks = monsterTypeRisks[monster.type] || [];
      
      return [
        ...baseRisks,
        ...RandomGenerator.selectUniqueFromArray(typeRisks, 1)
      ];
    });

    return RandomGenerator.selectUniqueFromArray(
      monsterRisks, 
      Math.min(monsterRisks.length, 4)
    );
  }

  /**
   * Generate recommended tactics for the encounter
   * @param context Tactical insights context
   * @returns Array of recommended tactic descriptions
   */
  private static generateRecommendedTactics(
    context: TacticalInsightsContext
  ): string[] {
    const generalTactics = [
      'Coordinate character abilities',
      'Prioritize high-value targets',
      'Maintain tactical flexibility',
      'Manage encounter resources carefully',
      'Adapt to changing battlefield conditions'
    ];

    const characterClassTactics = {
      'Fighter': ['Focus on consistent damage output', 'Protect vulnerable party members'],
      'Wizard': ['Control battlefield with area spells', 'Manage spell slot efficiency'],
      'Rogue': ['Maximize burst damage opportunities', 'Utilize stealth and positioning'],
      'Cleric': ['Provide strategic healing and support', 'Use divine abilities effectively']
    };

    const classTactics = context.characters.flatMap(character => 
      characterClassTactics[character.class] || []
    );

    return RandomGenerator.selectUniqueFromArray(
      [...generalTactics, ...classTactics], 
      4
    );
  }
}
