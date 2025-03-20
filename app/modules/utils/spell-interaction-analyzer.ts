import { Spell } from '../spells';
import { Character } from '../characters';

export interface EnvironmentalContext {
  terrain: 'urban' | 'wilderness' | 'dungeon' | 'open-field';
  combatDifficulty: 'easy' | 'moderate' | 'challenging' | 'extreme';
  partyComposition: string[];
}

export interface SpellInteractionAnalysis {
  compatibilityScore: number;
  interactionType: 'synergy' | 'conflict' | 'neutral';
  contextualEffectiveness: {
    terrain: number;
    combatDifficulty: number;
  };
  potentialOutcomes: string[];
  riskFactors: string[];
}

export class SpellInteractionAnalyzer {
  /**
   * Analyze spell interaction with advanced contextual awareness
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @param character Casting character
   * @param context Environmental context
   * @returns Detailed spell interaction analysis
   */
  static analyzeSpellInteraction(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character,
    context: EnvironmentalContext
  ): SpellInteractionAnalysis {
    // Base compatibility calculation
    const baseCompatibility = this.calculateBaseCompatibility(
      primarySpell, 
      secondarySpell
    );

    // Contextual effectiveness assessment
    const contextualEffectiveness = this.assessContextualEffectiveness(
      primarySpell, 
      secondarySpell, 
      context
    );

    // Potential outcomes and risk factors
    const potentialOutcomes = this.identifyPotentialOutcomes(
      primarySpell, 
      secondarySpell
    );

    const riskFactors = this.evaluateRiskFactors(
      primarySpell, 
      secondarySpell, 
      character
    );

    // Determine interaction type
    const interactionType = this.determineInteractionType(
      baseCompatibility.compatibilityScore
    );

    return {
      compatibilityScore: baseCompatibility.compatibilityScore,
      interactionType,
      contextualEffectiveness,
      potentialOutcomes,
      riskFactors
    };
  }

  /**
   * Calculate base compatibility between two spells
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @returns Base compatibility metrics
   */
  private static calculateBaseCompatibility(
    primarySpell: Spell, 
    secondarySpell: Spell
  ): { compatibilityScore: number } {
    let compatibilityScore = 0;

    // Spell school compatibility matrix
    const schoolCompatibilityMatrix = {
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

    // Check school compatibility
    const schoolKey = primarySpell.school as keyof typeof schoolCompatibilityMatrix;
    if (schoolCompatibilityMatrix[schoolKey] && 
        schoolCompatibilityMatrix[schoolKey][secondarySpell.school]) {
      compatibilityScore += schoolCompatibilityMatrix[schoolKey][secondarySpell.school];
    }

    // Shared tag compatibility
    const sharedTags = primarySpell.tags?.filter(
      tag => secondarySpell.tags?.includes(tag)
    ) || [];
    compatibilityScore += sharedTags.length * 0.5;

    // Level synergy consideration
    const levelDifference = Math.abs(primarySpell.level - secondarySpell.level);
    compatibilityScore += Math.max(1 - levelDifference * 0.2, 0);

    return { 
      compatibilityScore: Math.min(Math.max(compatibilityScore, 0), 10) 
    };
  }

  /**
   * Assess contextual effectiveness of spell combination
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @param context Environmental context
   * @returns Contextual effectiveness scores
   */
  private static assessContextualEffectiveness(
    primarySpell: Spell,
    secondarySpell: Spell,
    context: EnvironmentalContext
  ): SpellInteractionAnalysis['contextualEffectiveness'] {
    const terrainEffectivenessMap = {
      'urban': {
        'Illusion': 0.8,
        'Enchantment': 0.7
      },
      'wilderness': {
        'Conjuration': 0.9,
        'Transmutation': 0.8
      },
      'dungeon': {
        'Evocation': 0.7,
        'Abjuration': 0.6
      },
      'open-field': {
        'Divination': 0.6,
        'Necromancy': 0.5
      }
    };

    const combatDifficultyMap = {
      'easy': 0.4,
      'moderate': 0.6,
      'challenging': 0.8,
      'extreme': 1.0
    };

    // Terrain effectiveness
    let terrainScore = 0.5; // Default neutral score
    const terrainKey = context.terrain as keyof typeof terrainEffectivenessMap;
    const terrainEffectiveness = terrainEffectivenessMap[terrainKey];
    
    if (terrainEffectiveness) {
      if (terrainEffectiveness[primarySpell.school]) {
        terrainScore += terrainEffectiveness[primarySpell.school];
      }
      if (terrainEffectiveness[secondarySpell.school]) {
        terrainScore += terrainEffectiveness[secondarySpell.school];
      }
    }

    // Combat difficulty effectiveness
    const combatDifficultyScore = combatDifficultyMap[context.combatDifficulty];

    return {
      terrain: Math.min(terrainScore, 1),
      combatDifficulty: combatDifficultyScore
    };
  }

  /**
   * Identify potential outcomes of spell combination
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @returns Potential outcome descriptions
   */
  private static identifyPotentialOutcomes(
    primarySpell: Spell,
    secondarySpell: Spell
  ): string[] {
    const potentialOutcomes: string[] = [];

    // Defensive combination potential
    if (
      primarySpell.tags?.includes('defense') && 
      secondarySpell.tags?.includes('protection')
    ) {
      potentialOutcomes.push('Enhanced defensive barrier');
    }

    // Offensive combination potential
    if (
      primarySpell.tags?.includes('damage') && 
      secondarySpell.tags?.includes('offensive')
    ) {
      potentialOutcomes.push('Amplified magical damage');
    }

    // Utility combination potential
    if (
      primarySpell.tags?.includes('utility') && 
      secondarySpell.tags?.includes('information')
    ) {
      potentialOutcomes.push('Advanced tactical intelligence');
    }

    // Movement and positioning potential
    if (
      primarySpell.tags?.includes('movement') && 
      secondarySpell.tags?.includes('teleportation')
    ) {
      potentialOutcomes.push('Superior battlefield repositioning');
    }

    // Fallback generic outcome
    if (potentialOutcomes.length === 0) {
      potentialOutcomes.push('Potential magical synergy');
    }

    return potentialOutcomes;
  }

  /**
   * Evaluate risk factors for spell combination
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @param character Casting character
   * @returns Risk factor descriptions
   */
  private static evaluateRiskFactors(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character
  ): string[] {
    const riskFactors: string[] = [];

    // Spell level disparity risk
    const levelDifference = Math.abs(primarySpell.level - secondarySpell.level);
    if (levelDifference > 2) {
      riskFactors.push('High spell level disparity');
    }

    // Conflicting magical schools risk
    const conflictingSchools = [
      ['Necromancy', 'Abjuration'],
      ['Illusion', 'Evocation']
    ];
    
    if (conflictingSchools.some(pair => 
      pair.includes(primarySpell.school) && 
      pair.includes(secondarySpell.school)
    )) {
      riskFactors.push('Potential magical interference');
    }

    // Character ability limitation risk
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
    
    if (abilityScore < 12 && (primarySpell.level + secondarySpell.level > 4)) {
      riskFactors.push('Potential casting ability limitations');
    }

    // Resource management risk
    if (primarySpell.level + secondarySpell.level > 6) {
      riskFactors.push('High resource consumption');
    }

    return riskFactors.length > 0 ? riskFactors : ['Low inherent risk'];
  }

  /**
   * Determine interaction type based on compatibility score
   * @param compatibilityScore Compatibility score
   * @returns Interaction type
   */
  private static determineInteractionType(
    compatibilityScore: number
  ): SpellInteractionAnalysis['interactionType'] {
    if (compatibilityScore >= 8) return 'synergy';
    if (compatibilityScore <= 3) return 'conflict';
    return 'neutral';
  }
}
