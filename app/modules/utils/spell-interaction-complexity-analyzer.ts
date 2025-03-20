import { Spell } from '../spells';
import { Character } from '../characters';

export interface SpellInteractionComplexityAnalysis {
  complexityScore: number;
  strategicPotential: string[];
  interactionDynamics: {
    synergyCriticalPoints: string[];
    potentialRisks: string[];
    resourceManagement: {
      manaCost: number;
      actionEconomy: string;
    };
  };
}

export class SpellInteractionComplexityAnalyzer {
  /**
   * Analyze spell interaction complexity
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @param character Casting character
   * @returns Detailed complexity analysis
   */
  static analyzeSpellInteractionComplexity(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character
  ): SpellInteractionComplexityAnalysis {
    // Base complexity calculation
    const baseComplexity = this.calculateBaseComplexity(
      primarySpell, 
      secondarySpell
    );

    // Character-specific complexity modifiers
    const characterModifiedComplexity = this.applyCharacterModifiers(
      baseComplexity, 
      character
    );

    // Strategic potential identification
    const strategicPotential = this.identifyStrategicPotential(
      primarySpell, 
      secondarySpell
    );

    // Interaction dynamics analysis
    const interactionDynamics = this.analyzeInteractionDynamics(
      primarySpell, 
      secondarySpell, 
      character
    );

    return {
      complexityScore: characterModifiedComplexity.complexityScore,
      strategicPotential,
      interactionDynamics
    };
  }

  /**
   * Calculate base complexity between two spells
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @returns Base complexity metrics
   */
  private static calculateBaseComplexity(
    primarySpell: Spell, 
    secondarySpell: Spell
  ): { complexityScore: number } {
    let complexityScore = 0;

    // Spell school interaction complexity
    const schoolComplexityMatrix = {
      'Evocation': { 
        'Abjuration': 0.7, 
        'Conjuration': 0.6 
      },
      'Illusion': {
        'Enchantment': 0.8,
        'Divination': 0.5
      },
      'Necromancy': {
        'Transmutation': 0.6,
        'Conjuration': 0.4
      }
    };

    // Check school complexity interaction
    const schoolKey = primarySpell.school as keyof typeof schoolComplexityMatrix;
    if (schoolComplexityMatrix[schoolKey] && 
        schoolComplexityMatrix[schoolKey][secondarySpell.school]) {
      complexityScore += schoolComplexityMatrix[schoolKey][secondarySpell.school];
    }

    // Tag complexity analysis
    const sharedTags = primarySpell.tags?.filter(
      tag => secondarySpell.tags?.includes(tag)
    ) || [];
    complexityScore += sharedTags.length * 0.4;

    // Level difference complexity impact
    const levelDifference = Math.abs(primarySpell.level - secondarySpell.level);
    complexityScore += levelDifference * 0.3;

    return { 
      complexityScore: Math.min(Math.max(complexityScore, 0), 10) 
    };
  }

  /**
   * Apply character-specific modifiers to complexity
   * @param baseComplexity Base complexity metrics
   * @param character Casting character
   * @returns Modified complexity metrics
   */
  private static applyCharacterModifiers(
    baseComplexity: { complexityScore: number },
    character: Character
  ): { complexityScore: number } {
    // Spellcasting ability modifier
    const spellcastingAbilities = {
      'Wizard': 'intelligence',
      'Sorcerer': 'charisma',
      'Warlock': 'charisma',
      'Druid': 'wisdom',
      'Cleric': 'wisdom',
      'Bard': 'charisma',
      'Paladin': 'charisma',
      'Ranger': 'wisdom'
    };

    const abilityKey = spellcastingAbilities[character.class];
    const abilityScore = character.abilityScores[abilityKey];
    
    // Adjust complexity based on ability score
    const abilityModifier = Math.floor((abilityScore - 10) / 2) * 0.4;
    const modifiedComplexityScore = baseComplexity.complexityScore + abilityModifier;

    return {
      complexityScore: Math.min(Math.max(modifiedComplexityScore, 0), 10)
    };
  }

  /**
   * Identify strategic potential of spell combination
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @returns Strategic potential insights
   */
  private static identifyStrategicPotential(
    primarySpell: Spell,
    secondarySpell: Spell
  ): string[] {
    const strategicPotential: string[] = [];

    // Defensive combination potential
    if (
      primarySpell.tags?.includes('defense') && 
      secondarySpell.tags?.includes('protection')
    ) {
      strategicPotential.push('Enhanced defensive strategy');
    }

    // Offensive combination potential
    if (
      primarySpell.tags?.includes('damage') && 
      secondarySpell.tags?.includes('offensive')
    ) {
      strategicPotential.push('Amplified offensive capabilities');
    }

    // Utility combination potential
    if (
      primarySpell.tags?.includes('utility') && 
      secondarySpell.tags?.includes('information')
    ) {
      strategicPotential.push('Advanced tactical information gathering');
    }

    // Movement and positioning potential
    if (
      primarySpell.tags?.includes('movement') && 
      secondarySpell.tags?.includes('teleportation')
    ) {
      strategicPotential.push('Superior battlefield positioning');
    }

    // Fallback generic potential
    if (strategicPotential.length === 0) {
      strategicPotential.push('Potential tactical synergy');
    }

    return strategicPotential;
  }

  /**
   * Analyze interaction dynamics between spells
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @param character Casting character
   * @returns Detailed interaction dynamics
   */
  private static analyzeInteractionDynamics(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character
  ): SpellInteractionComplexityAnalysis['interactionDynamics'] {
    return {
      synergyCriticalPoints: [
        `Optimal casting sequence for ${primarySpell.name} and ${secondarySpell.name}`,
        'Maximizing spell interaction efficiency'
      ],
      potentialRisks: [
        'Potential magical interference',
        'Resource allocation challenges'
      ],
      resourceManagement: {
        manaCost: primarySpell.level + secondarySpell.level,
        actionEconomy: this.determineActionEconomy(primarySpell, secondarySpell, character)
      }
    };
  }

  /**
   * Determine action economy for spell combination
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @param character Casting character
   * @returns Action economy assessment
   */
  private static determineActionEconomy(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character
  ): string {
    const classActionEconomy = {
      'Wizard': 'Efficient spell weaving',
      'Sorcerer': 'Dynamic spell adaptation',
      'Warlock': 'Concentrated magical burst',
      'Druid': 'Natural spell synchronization',
      'Cleric': 'Divine spell coordination',
      'Bard': 'Versatile spell manipulation',
      'Paladin': 'Focused magical channeling',
      'Ranger': 'Adaptive spell integration'
    };

    return classActionEconomy[character.class] || 'Standard action economy';
  }
}
