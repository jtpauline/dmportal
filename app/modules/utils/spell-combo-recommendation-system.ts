import { Spell } from '../spells';
import { Character } from '../characters';
import { EnvironmentalContext } from './spell-interaction-analyzer';
import { SpellInteractionAnalyzer } from './spell-interaction-analyzer';

export interface SpellComboRecommendation {
  primarySpell: Spell;
  secondarySpell: Spell;
  compatibilityScore: number;
  strategicPotential: string[];
  recommendationStrength: 'low' | 'moderate' | 'high' | 'exceptional';
  synergyCriticalPoints: string[];
}

export class SpellComboRecommendationSystem {
  // Centralized school interaction mapping
  private static schoolInteractionMap = {
    'Evocation': {
      'Conjuration': {
        strategicPotential: 'Amplified destructive potential',
        synergyCriticalPoints: 'Maximize area of effect and control'
      },
      'Abjuration': {
        strategicPotential: 'Defensive magical empowerment',
        synergyCriticalPoints: 'Balance offensive and defensive capabilities'
      }
    },
    'Illusion': {
      'Enchantment': {
        strategicPotential: 'Mind-altering tactical advantage',
        synergyCriticalPoints: 'Exploit psychological manipulation'
      },
      'Divination': {
        strategicPotential: 'Enhanced perceptual manipulation',
        synergyCriticalPoints: 'Enhance perceptual advantage'
      }
    }
  };

  /**
   * Generate spell combo recommendations
   * @param primarySpell Primary spell to find combos for
   * @param availableSpells List of available spells
   * @param character Casting character
   * @param context Environmental context
   * @returns Array of spell combo recommendations
   */
  static generateSpellComboRecommendations(
    primarySpell: Spell,
    availableSpells: Spell[],
    character: Character,
    context: EnvironmentalContext
  ): SpellComboRecommendation[] {
    return availableSpells
      .filter(spell => spell.id !== primarySpell.id)
      .map(secondarySpell => this.createSpellComboRecommendation(
        primarySpell, 
        secondarySpell, 
        character, 
        context
      ))
      .sort(this.sortRecommendations)
      .slice(0, 5);
  }

  /**
   * Create a single spell combo recommendation
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @param character Casting character
   * @param context Environmental context
   * @returns Spell combo recommendation
   */
  private static createSpellComboRecommendation(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character,
    context: EnvironmentalContext
  ): SpellComboRecommendation {
    const interaction = SpellInteractionAnalyzer.analyzeSpellInteraction(
      primarySpell, 
      secondarySpell, 
      character, 
      context
    );

    return {
      primarySpell,
      secondarySpell,
      compatibilityScore: interaction.compatibilityScore,
      strategicPotential: this.generateStrategicPotential(
        primarySpell, 
        secondarySpell
      ),
      recommendationStrength: this.determineRecommendationStrength(
        interaction.compatibilityScore,
        interaction.interactionType
      ),
      synergyCriticalPoints: this.generateSynergyCriticalPoints(
        primarySpell, 
        secondarySpell
      )
    };
  }

  /**
   * Sort recommendations by strength and compatibility
   * @param a First recommendation
   * @param b Second recommendation
   * @returns Comparison result
   */
  private static sortRecommendations(
    a: SpellComboRecommendation, 
    b: SpellComboRecommendation
  ): number {
    const strengthOrder = {
      'exceptional': 4,
      'high': 3,
      'moderate': 2,
      'low': 1
    };
    
    const strengthComparison = 
      strengthOrder[b.recommendationStrength] - 
      strengthOrder[a.recommendationStrength];
    
    return strengthComparison !== 0 
      ? strengthComparison 
      : b.compatibilityScore - a.compatibilityScore;
  }

  /**
   * Determine recommendation strength
   * @param compatibilityScore Spell compatibility score
   * @param interactionType Type of spell interaction
   * @returns Recommendation strength
   */
  private static determineRecommendationStrength(
    compatibilityScore: number,
    interactionType: 'synergy' | 'conflict' | 'neutral'
  ): SpellComboRecommendation['recommendationStrength'] {
    if (interactionType === 'conflict') return 'low';
    
    if (compatibilityScore >= 9) return 'exceptional';
    if (compatibilityScore >= 7) return 'high';
    if (compatibilityScore >= 5) return 'moderate';
    return 'low';
  }

  /**
   * Generate strategic potential for spell combination
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @returns Strategic potential insights
   */
  private static generateStrategicPotential(
    primarySpell: Spell,
    secondarySpell: Spell
  ): string[] {
    const strategicPotential: string[] = [];

    // Tag-based strategic potential
    const strategicTagCombinations = [
      { 
        tags: ['defense', 'protection'], 
        potential: 'Comprehensive defensive strategy' 
      },
      { 
        tags: ['damage', 'offensive'], 
        potential: 'Devastating offensive burst' 
      },
      { 
        tags: ['utility', 'information'], 
        potential: 'Advanced tactical intelligence gathering' 
      },
      { 
        tags: ['movement', 'teleportation'], 
        potential: 'Superior battlefield repositioning' 
      }
    ];

    strategicTagCombinations.forEach(combo => {
      if (
        combo.tags.every(tag => 
          primarySpell.tags?.includes(tag) || 
          secondarySpell.tags?.includes(tag)
        )
      ) {
        strategicPotential.push(combo.potential);
      }
    });

    // School-based strategic potential
    const schoolKey = primarySpell.school as keyof typeof this.schoolInteractionMap;
    const schoolInteraction = this.schoolInteractionMap[schoolKey]?.[secondarySpell.school];
    
    if (schoolInteraction) {
      strategicPotential.push(schoolInteraction.strategicPotential);
    }

    // Fallback
    if (strategicPotential.length === 0) {
      strategicPotential.push('Potential tactical synergy');
    }

    return strategicPotential;
  }

  /**
   * Generate synergy critical points
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @returns Synergy critical points
   */
  private static generateSynergyCriticalPoints(
    primarySpell: Spell,
    secondarySpell: Spell
  ): string[] {
    const synergyCriticalPoints: string[] = [
      `Optimal casting sequence: ${primarySpell.name} → ${secondarySpell.name}`
    ];

    // Resource management insights
    const totalSpellLevel = primarySpell.level + secondarySpell.level;
    if (totalSpellLevel > 5) {
      synergyCriticalPoints.push('High resource investment required');
    }

    // School-based synergy critical points
    const schoolKey = primarySpell.school as keyof typeof this.schoolInteractionMap;
    const schoolInteraction = this.schoolInteractionMap[schoolKey]?.[secondarySpell.school];
    
    if (schoolInteraction) {
      synergyCriticalPoints.push(schoolInteraction.synergyCriticalPoints);
    }

    return synergyCriticalPoints;
  }
}
