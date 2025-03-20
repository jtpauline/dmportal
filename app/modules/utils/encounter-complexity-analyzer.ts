import { Monster } from '../monsters';
import { Character } from '../characters';
import { RandomGenerator } from './random-generator';

export interface ComplexityAnalysisReport {
  overallComplexity: number;
  monsterDiversity: number;
  abilityComplexity: number;
  environmentalImpact: number;
  characterSynergyPotential: number;
  recommendedTactics: string[];
  potentialChallenges: string[];
}

export class EncounterComplexityAnalyzer {
  /**
   * Comprehensive encounter complexity analysis
   * @param monsters Encounter monsters
   * @param characters Player characters
   * @returns Detailed complexity analysis report
   */
  static analyzeEncounterComplexity(
    monsters: Monster[], 
    characters: Character[]
  ): ComplexityAnalysisReport {
    const monsterDiversity = this.calculateMonsterDiversity(monsters);
    const abilityComplexity = this.calculateAbilityComplexity(monsters);
    const characterSynergy = this.assessCharacterSynergy(characters);
    const environmentalComplexity = this.calculateEnvironmentalComplexity();

    const overallComplexity = this.calculateOverallComplexity({
      monsterDiversity,
      abilityComplexity,
      characterSynergy,
      environmentalComplexity
    });

    return {
      overallComplexity,
      monsterDiversity,
      abilityComplexity,
      environmentalImpact: environmentalComplexity,
      characterSynergyPotential: characterSynergy,
      recommendedTactics: this.generateRecommendedTactics(overallComplexity),
      potentialChallenges: this.identifyPotentialChallenges(
        monsters, 
        characters, 
        overallComplexity
      )
    };
  }

  /**
   * Calculate monster type diversity
   * @param monsters Encounter monsters
   * @returns Monster diversity score
   */
  private static calculateMonsterDiversity(monsters: Monster[]): number {
    const uniqueMonsterTypes = new Set(monsters.map(m => m.type)).size;
    const uniqueMonsterChallengeRatings = new Set(
      monsters.map(m => Math.floor(m.challengeRating))
    ).size;

    return Math.min(10, uniqueMonsterTypes * 2 + uniqueMonsterChallengeRatings);
  }

  /**
   * Calculate monster ability complexity
   * @param monsters Encounter monsters
   * @returns Ability complexity score
   */
  private static calculateAbilityComplexity(monsters: Monster[]): number {
    const specialAbilitiesCount = monsters.reduce(
      (sum, monster) => sum + (monster.specialAbilities?.length || 0), 
      0
    );

    const uniqueAbilityTypes = new Set(
      monsters.flatMap(m => 
        m.specialAbilities?.map(a => a.name.toLowerCase()) || []
      )
    ).size;

    return Math.min(10, specialAbilitiesCount * 0.5 + uniqueAbilityTypes * 1.5);
  }

  /**
   * Assess character synergy potential
   * @param characters Player characters
   * @returns Character synergy score
   */
  private static assessCharacterSynergy(characters: Character[]): number {
    const multiclassCharacters = characters.filter(
      c => c.multiclassLevels && c.multiclassLevels.length > 0
    );

    const uniqueClasses = new Set(
      characters.map(c => c.class)
    ).size;

    const synergyScore = (
      uniqueClasses * 1.5 + 
      multiclassCharacters.length * 2
    );

    return Math.min(10, synergyScore);
  }

  /**
   * Calculate environmental complexity
   * @returns Environmental complexity score
   */
  private static calculateEnvironmentalComplexity(): number {
    const environmentalFactors = [
      'Difficult Terrain',
      'Magical Interference',
      'Extreme Weather',
      'Limited Visibility'
    ];

    // Simulate random environmental complexity
    return RandomGenerator.randomInRange(2, 8);
  }

  /**
   * Calculate overall encounter complexity
   * @param complexityFactors Complexity calculation factors
   * @returns Overall complexity score
   */
  private static calculateOverallComplexity(complexityFactors: {
    monsterDiversity: number;
    abilityComplexity: number;
    characterSynergy: number;
    environmentalComplexity: number;
  }): number {
    const { 
      monsterDiversity, 
      abilityComplexity, 
      characterSynergy,
      environmentalComplexity 
    } = complexityFactors;

    return Math.min(10, 
      monsterDiversity * 0.3 + 
      abilityComplexity * 0.3 + 
      characterSynergy * 0.2 + 
      environmentalComplexity * 0.2
    );
  }

  /**
   * Generate recommended tactics based on complexity
   * @param overallComplexity Encounter complexity score
   * @returns Array of recommended tactical approaches
   */
  private static generateRecommendedTactics(
    overallComplexity: number
  ): string[] {
    const tacticTemplates = [
      'Prioritize crowd control abilities',
      'Focus on high-damage burst strategies',
      'Maintain flexible positioning',
      'Coordinate character abilities carefully',
      'Prepare defensive countermeasures',
      'Utilize environmental advantages',
      'Manage resource allocation strategically'
    ];

    const tacticCount = Math.ceil(overallComplexity / 3);
    
    return RandomGenerator.selectUniqueFromArray(
      tacticTemplates, 
      tacticCount
    );
  }

  /**
   * Identify potential encounter challenges
   * @param monsters Encounter monsters
   * @param characters Player characters
   * @param overallComplexity Encounter complexity score
   * @returns Array of potential challenge descriptions
   */
  private static identifyPotentialChallenges(
    monsters: Monster[], 
    characters: Character[],
    overallComplexity: number
  ): string[] {
    const challengeTemplates = [
      'Manage multiple monster types with diverse abilities',
      'Overcome significant ability complexity',
      'Navigate challenging environmental conditions',
      'Coordinate character abilities effectively',
      'Adapt to unexpected monster tactics',
      'Mitigate high-risk encounter scenarios'
    ];

    const challengeCount = Math.ceil(overallComplexity / 2);
    
    return RandomGenerator.selectUniqueFromArray(
      challengeTemplates, 
      challengeCount
    );
  }
}
