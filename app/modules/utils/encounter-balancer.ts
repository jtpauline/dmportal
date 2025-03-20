import { Monster } from '../monsters';
import { Character } from '../characters';
import { DiceRoller } from './dice-roller';

export interface EncounterBalanceReport {
  isBalanced: boolean;
  challengeRating: number;
  recommendedAdjustments: string[];
  potentialRisks: string[];
}

export class EncounterBalancer {
  /**
   * Comprehensive encounter balance analysis
   * @param monsters Monsters in the encounter
   * @param characters Player characters
   * @returns Detailed balance report
   */
  static analyzeEncounter(
    monsters: Monster[], 
    characters: Character[]
  ): EncounterBalanceReport {
    const partyLevel = this.calculateAveragePartyLevel(characters);
    const encounterDifficulty = this.calculateEncounterDifficulty(monsters);
    const balanceFactors = this.assessBalanceFactors(monsters, characters);

    return {
      isBalanced: balanceFactors.balanceScore >= 0.7,
      challengeRating: encounterDifficulty,
      recommendedAdjustments: this.generateAdjustmentRecommendations(
        balanceFactors, 
        partyLevel
      ),
      potentialRisks: this.identifyPotentialRisks(monsters, characters)
    };
  }

  /**
   * Calculate average party level
   * @param characters Player characters
   * @returns Average party level
   */
  private static calculateAveragePartyLevel(characters: Character[]): number {
    return characters.reduce((sum, char) => sum + char.level, 0) / characters.length;
  }

  /**
   * Calculate overall encounter difficulty
   * @param monsters Encounter monsters
   * @returns Encounter difficulty rating
   */
  private static calculateEncounterDifficulty(monsters: Monster[]): number {
    return monsters.reduce((sum, monster) => sum + monster.challengeRating, 0);
  }

  /**
   * Assess various balance factors
   * @param monsters Encounter monsters
   * @param characters Player characters
   * @returns Balance assessment metrics
   */
  private static assessBalanceFactors(
    monsters: Monster[], 
    characters: Character[]
  ): {
    balanceScore: number;
    monsterVariety: number;
    specialAbilitiesCount: number;
  } {
    const monsterTypes = new Set(monsters.map(m => m.type)).size;
    const specialAbilitiesCount = monsters.reduce(
      (sum, monster) => sum + (monster.specialAbilities?.length || 0), 
      0
    );

    // Complex balance scoring algorithm
    const balanceScore = Math.min(1, Math.max(0, 
      0.5 + (monsterTypes * 0.1) - 
      (Math.abs(monsters.length - characters.length) * 0.2) +
      (specialAbilitiesCount * 0.05)
    ));

    return {
      balanceScore,
      monsterVariety: monsterTypes,
      specialAbilitiesCount
    };
  }

  /**
   * Generate encounter adjustment recommendations
   * @param balanceFactors Balance assessment metrics
   * @param partyLevel Average party level
   * @returns Array of adjustment recommendations
   */
  private static generateAdjustmentRecommendations(
    balanceFactors: { 
      balanceScore: number; 
      monsterVariety: number; 
      specialAbilitiesCount: number 
    },
    partyLevel: number
  ): string[] {
    const recommendations: string[] = [];

    if (balanceFactors.balanceScore < 0.5) {
      recommendations.push('Encounter may be too challenging');
    }

    if (balanceFactors.monsterVariety < 2) {
      recommendations.push('Consider adding monster type diversity');
    }

    if (balanceFactors.specialAbilitiesCount === 0) {
      recommendations.push('Add monsters with special abilities for complexity');
    }

    return recommendations;
  }

  /**
   * Identify potential encounter risks
   * @param monsters Encounter monsters
   * @param characters Player characters
   * @returns Array of potential risks
   */
  private static identifyPotentialRisks(
    monsters: Monster[], 
    characters: Character[]
  ): string[] {
    const risks: string[] = [];

    // Check for overwhelming special abilities
    const dangerousAbilities = monsters.filter(monster => 
      monster.specialAbilities?.some(ability => 
        ability.name.includes('Regeneration') || 
        ability.name.includes('Multiattack')
      )
    );

    if (dangerousAbilities.length > 0) {
      risks.push('Monsters with potentially overwhelming special abilities');
    }

    // Check for significant damage immunities
    const immuneMonsters = monsters.filter(monster => 
      monster.damageImmunities && monster.damageImmunities.length > 0
    );

    if (immuneMonsters.length > 0) {
      risks.push('Monsters with damage immunities that may neutralize party strategies');
    }

    return risks;
  }
}
