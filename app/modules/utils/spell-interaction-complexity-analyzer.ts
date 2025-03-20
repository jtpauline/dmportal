import { Spell } from '../spells';
import { Character } from '../characters';

export interface SpellInteractionComplexityMetrics {
  overallComplexity: number;
  synergyComplexity: number;
  unexpectedInteractionProbability: number;
  magicalResonanceIntensity: number;
  interactionRiskFactor: number;
}

export interface SpellInteractionContext {
  character: Character;
  environment: string;
  combatDifficulty: number;
}

export class SpellInteractionComplexityAnalyzer {
  /**
   * Analyze Spell Interaction Complexity
   * Provides a comprehensive analysis of spell interaction dynamics
   */
  static analyzeSpellInteractionComplexity(
    spells: Spell[], 
    context: SpellInteractionContext
  ): SpellInteractionComplexityMetrics {
    return {
      overallComplexity: this.calculateOverallComplexity(spells),
      synergyComplexity: this.calculateSynergyComplexity(spells),
      unexpectedInteractionProbability: this.calculateUnexpectedInteractionProbability(spells),
      magicalResonanceIntensity: this.calculateMagicalResonanceIntensity(spells, context),
      interactionRiskFactor: this.calculateInteractionRiskFactor(spells, context)
    };
  }

  /**
   * Calculate Overall Spell Interaction Complexity
   * Considers spell schools, levels, and magical characteristics
   */
  private static calculateOverallComplexity(spells: Spell[]): number {
    const spellSchools = new Set(spells.map(spell => spell.school));
    const spellLevels = spells.map(spell => spell.level);
    
    // Complexity increases with:
    // 1. Number of unique spell schools
    // 2. Variance in spell levels
    // 3. Total number of spells
    const schoolDiversity = spellSchools.size / 8; // Max 8 spell schools
    const levelVariance = this.calculateLevelVariance(spellLevels);
    const spellCountFactor = Math.min(spells.length / 4, 1);

    return Math.min(
      (schoolDiversity * 0.4) + 
      (levelVariance * 0.3) + 
      (spellCountFactor * 0.3),
      1
    );
  }

  /**
   * Calculate Spell Synergy Complexity
   * Evaluates how intricately spells can interact
   */
  private static calculateSynergyComplexity(spells: Spell[]): number {
    const spellTypes = spells.map(spell => spell.type);
    const uniqueTypes = new Set(spellTypes);

    // Synergy complexity increases with:
    // 1. Diversity of spell types
    // 2. Potential for complementary effects
    const typeDiversityFactor = uniqueTypes.size / 5; // Assuming 5 main spell types
    const complementaryPotential = this.calculateComplementaryPotential(spells);

    return Math.min(
      (typeDiversityFactor * 0.6) + 
      (complementaryPotential * 0.4),
      1
    );
  }

  /**
   * Calculate Unexpected Interaction Probability
   * Predicts likelihood of unusual spell interactions
   */
  private static calculateUnexpectedInteractionProbability(spells: Spell[]): number {
    const spellSchools = spells.map(spell => spell.school);
    const uniqueSchools = new Set(spellSchools);

    // Unexpected interactions more likely when:
    // 1. Multiple spell schools are involved
    // 2. Spells have conflicting magical properties
    const schoolDiversityFactor = uniqueSchools.size / 8;
    const conflictPotential = this.calculateSpellConflictPotential(spells);

    return Math.min(
      (schoolDiversityFactor * 0.7) + 
      (conflictPotential * 0.3),
      1
    );
  }

  /**
   * Calculate Magical Resonance Intensity
   * Measures potential magical energy amplification
   */
  private static calculateMagicalResonanceIntensity(
    spells: Spell[], 
    context: SpellInteractionContext
  ): number {
    const spellLevels = spells.map(spell => spell.level);
    const averageSpellLevel = spellLevels.reduce((a, b) => a + b, 0) / spellLevels.length;

    // Resonance intensity influenced by:
    // 1. Average spell level
    // 2. Combat difficulty
    // 3. Character's magical affinity
    const levelIntensityFactor = averageSpellLevel / 9; // Assuming max spell level of 9
    const combatDifficultyFactor = context.combatDifficulty;
    const characterMagicalAffinityFactor = this.calculateCharacterMagicalAffinity(context.character);

    return Math.min(
      (levelIntensityFactor * 0.4) + 
      (combatDifficultyFactor * 0.3) + 
      (characterMagicalAffinityFactor * 0.3),
      1
    );
  }

  /**
   * Calculate Interaction Risk Factor
   * Evaluates potential negative consequences of spell interactions
   */
  private static calculateInteractionRiskFactor(
    spells: Spell[], 
    context: SpellInteractionContext
  ): number {
    const spellSchools = spells.map(spell => spell.school);
    const uniqueSchools = new Set(spellSchools);

    // Risk factor increases with:
    // 1. Diversity of spell schools
    // 2. Environmental complexity
    // 3. Combat difficulty
    const schoolRiskFactor = uniqueSchools.size / 8;
    const environmentalComplexityFactor = this.calculateEnvironmentalComplexity(context.environment);
    const combatRiskFactor = context.combatDifficulty;

    return Math.min(
      (schoolRiskFactor * 0.4) + 
      (environmentalComplexityFactor * 0.3) + 
      (combatRiskFactor * 0.3),
      1
    );
  }

  /**
   * Calculate Level Variance
   * Helps determine complexity based on spell level differences
   */
  private static calculateLevelVariance(levels: number[]): number {
    const mean = levels.reduce((a, b) => a + b, 0) / levels.length;
    const variance = levels.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / levels.length;
    return Math.min(variance / 9, 1); // Normalize against max possible variance
  }

  /**
   * Calculate Complementary Potential
   * Evaluates how well spells might work together
   */
  private static calculateComplementaryPotential(spells: Spell[]): number {
    const spellTypes = spells.map(spell => spell.type);
    const complementaryPairings = [
      ['Damage', 'Control'],
      ['Healing', 'Protection'],
      ['Utility', 'Buff']
    ];

    const complementaryScore = complementaryPairings.reduce((score, pairing) => {
      return score + (spellTypes.includes(pairing[0]) && spellTypes.includes(pairing[1]) ? 0.5 : 0);
    }, 0);

    return Math.min(complementaryScore, 1);
  }

  /**
   * Calculate Spell Conflict Potential
   * Identifies likelihood of spell interactions causing unintended effects
   */
  private static calculateSpellConflictPotential(spells: Spell[]): number {
    const conflictingSchools = [
      ['Necromancy', 'Life'],
      ['Illusion', 'Divination'],
      ['Evocation', 'Abjuration']
    ];

    const conflictScore = conflictingSchools.reduce((score, schools) => {
      const hasConflict = spells.some(spell => schools.includes(spell.school));
      return hasConflict ? score + 0.5 : score;
    }, 0);

    return Math.min(conflictScore, 1);
  }

  /**
   * Calculate Environmental Complexity
   * Assesses how environment impacts spell interactions
   */
  private static calculateEnvironmentalComplexity(environment: string): number {
    const environmentComplexityMap: Record<string, number> = {
      'Urban': 0.7,
      'Wilderness': 0.5,
      'Dungeon': 0.6,
      'Planar': 0.9,
      'Underwater': 0.8
    };

    return environmentComplexityMap[environment] || 0.5;
  }

  /**
   * Calculate Character Magical Affinity
   * Determines character's potential to manage complex spell interactions
   */
  private static calculateCharacterMagicalAffinity(character: Character): number {
    // This is a placeholder - in a real implementation, 
    // you'd use more sophisticated character attributes
    const intelligenceFactor = character.intelligence / 20; // Assuming max intelligence of 20
    const wisdomFactor = character.wisdom / 20;
    const spellcastingLevelFactor = character.level / 20;

    return Math.min(
      (intelligenceFactor * 0.4) + 
      (wisdomFactor * 0.3) + 
      (spellcastingLevelFactor * 0.3),
      1
    );
  }
}
