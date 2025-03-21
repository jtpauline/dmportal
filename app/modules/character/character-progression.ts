import { Character } from './character-core';
import { Campaign } from '../campaign/campaign-core';

export interface LevelUpEvent {
  type: 'level_up';
  oldLevel: number;
  newLevel: number;
  classImproved: string;
  newFeatsOrAbilities: string[];
}

export interface CharacterProgressionInsights {
  levelTrajectory: number[];
  skillMasteryProgression: {
    [skillName: string]: {
      totalRanks: number;
      masteryLevel: 'Novice' | 'Intermediate' | 'Expert' | 'Master';
    }
  };
  classBalanceInsights: {
    [className: string]: {
      levelsInClass: number;
      contributionScore: number;
    }
  };
}

export class CharacterProgressionSystem {
  /**
   * Calculate comprehensive character progression insights
   * @param character Character to analyze
   * @param campaign Campaign context
   * @returns Detailed progression insights
   */
  analyzeCharacterProgression(
    character: Character, 
    campaign: Campaign
  ): CharacterProgressionInsights {
    return {
      levelTrajectory: this.calculateLevelTrajectory(character),
      skillMasteryProgression: this.assessSkillMastery(character),
      classBalanceInsights: this.evaluateMulticlassBalance(character)
    };
  }

  /**
   * Determine level progression history
   * @param character Character to track
   * @returns Array of levels over time
   */
  private calculateLevelTrajectory(character: Character): number[] {
    // Placeholder for more complex level tracking
    return character.classes.map(cls => cls.level);
  }

  /**
   * Assess skill mastery and progression
   * @param character Character to evaluate
   * @returns Skill mastery insights
   */
  private assessSkillMastery(character: Character) {
    return Object.entries(character.skills).reduce((insights, [skillName, skillData]) => {
      insights[skillName] = {
        totalRanks: skillData.rank,
        masteryLevel: this.determineMasteryLevel(skillData.rank)
      };
      return insights;
    }, {});
  }

  /**
   * Determine skill mastery level
   * @param ranks Number of skill ranks
   * @returns Mastery level classification
   */
  private determineMasteryLevel(ranks: number): 'Novice' | 'Intermediate' | 'Expert' | 'Master' {
    if (ranks < 5) return 'Novice';
    if (ranks < 10) return 'Intermediate';
    if (ranks < 15) return 'Expert';
    return 'Master';
  }

  /**
   * Evaluate multiclass character balance
   * @param character Character to evaluate
   * @returns Multiclass balance insights
   */
  private evaluateMulticlassBalance(character: Character) {
    return character.classes.reduce((insights, characterClass) => {
      insights[characterClass.name] = {
        levelsInClass: characterClass.level,
        contributionScore: this.calculateClassContribution(characterClass)
      };
      return insights;
    }, {});
  }

  /**
   * Calculate class contribution to character effectiveness
   * @param characterClass Class to evaluate
   * @returns Contribution score
   */
  private calculateClassContribution(characterClass: { name: string; level: number }): number {
    const classContributionFactors = {
      'Fighter': (level) => level * 1.2,
      'Wizard': (level) => level * 1.5,
      'Rogue': (level) => level * 1.1,
      'Cleric': (level) => level * 1.3
    };

    const contributionMethod = classContributionFactors[characterClass.name] || 
      ((level) => level);
    
    return contributionMethod(characterClass.level);
  }

  /**
   * Handle character level up
   * @param character Character leveling up
   * @returns Level up event details
   */
  handleLevelUp(character: Character): LevelUpEvent {
    const primaryClass = character.classes[0];
    primaryClass.level++;
    character.progression.level++;
    character.progression.experience = 0;

    const newFeatsOrAbilities = this.determineLevelUpBenefits(primaryClass);

    return {
      type: 'level_up',
      oldLevel: character.progression.level - 1,
      newLevel: character.progression.level,
      classImproved: primaryClass.name,
      newFeatsOrAbilities
    };
  }

  /**
   * Determine level up benefits based on class
   * @param characterClass Class receiving level up
   * @returns Array of new feats or abilities
   */
  private determineLevelUpBenefits(characterClass: { name: string; level: number }): string[] {
    const levelUpBenefits = {
      'Fighter': [
        'Bonus Feat',
        'Increased Base Attack Bonus'
      ],
      'Wizard': [
        'New Spell Level',
        'Increased Spell Slots'
      ],
      'Rogue': [
        'Sneak Attack Improvement',
        'Skill Point Bonus'
      ]
    };

    return levelUpBenefits[characterClass.name] || [];
  }
}
