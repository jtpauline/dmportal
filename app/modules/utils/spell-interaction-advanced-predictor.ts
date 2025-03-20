import { Spell } from '../spells';
import { Character } from '../characters';
import { EnvironmentalContext } from './spell-interaction-analyzer';
import { SpellInteractionAnalysis } from './spell-interaction-analyzer';
import { MLTrainingDataCollector } from './ml-training-data-collector';
import { SpellInteractionPluginManager } from './spell-interaction-plugin-system';

export interface AdvancedPredictionContext {
  confidenceMetrics: {
    overall: number;
    bySpellSchool: Record<string, number>;
    byCharacterClass: Record<string, number>;
    byTerrain: Record<string, number>;
  };
  additionalInsights: string[];
  riskFactors: string[];
}

export class AdvancedSpellInteractionPredictor {
  /**
   * Comprehensive spell interaction prediction with advanced ML techniques
   * @param primarySpell Primary spell in interaction
   * @param secondarySpell Secondary spell in interaction
   * @param character Casting character
   * @param context Environmental context
   * @returns Enhanced spell interaction prediction
   */
  static predictAdvancedSpellInteraction(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character,
    context: EnvironmentalContext
  ): SpellInteractionAnalysis & { predictionContext: AdvancedPredictionContext } {
    // Retrieve base interaction analysis
    const baseAnalysis = SpellInteractionAnalyzer.analyzeSpellInteraction(
      primarySpell, 
      secondarySpell, 
      character, 
      context
    );

    // Compute advanced prediction context
    const predictionContext = this.computeAdvancedPredictionContext(
      primarySpell, 
      secondarySpell, 
      character, 
      context
    );

    // Apply advanced ML adjustments
    const enhancedAnalysis = this.applyAdvancedMLAdjustments(
      baseAnalysis, 
      predictionContext
    );

    // Collect training data for future model improvement
    this.collectTrainingData(
      primarySpell, 
      secondarySpell, 
      character, 
      context, 
      enhancedAnalysis
    );

    return {
      ...enhancedAnalysis,
      predictionContext
    };
  }

  /**
   * Compute advanced prediction context with multi-dimensional confidence scoring
   */
  private static computeAdvancedPredictionContext(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character,
    context: EnvironmentalContext
  ): AdvancedPredictionContext {
    // Spell school confidence calculation
    const spellSchoolConfidence = this.calculateSpellSchoolConfidence(
      primarySpell, 
      secondarySpell
    );

    // Character class confidence calculation
    const characterClassConfidence = this.calculateCharacterClassConfidence(
      character, 
      primarySpell, 
      secondarySpell
    );

    // Terrain-specific confidence calculation
    const terrainConfidence = this.calculateTerrainConfidence(context);

    // Overall confidence computation
    const overallConfidence = this.computeOverallConfidence(
      spellSchoolConfidence, 
      characterClassConfidence, 
      terrainConfidence
    );

    // Generate additional insights and risk factors
    const additionalInsights = this.generateAdditionalInsights(
      primarySpell, 
      secondarySpell, 
      character, 
      context
    );

    const riskFactors = this.identifyRiskFactors(
      primarySpell, 
      secondarySpell, 
      character, 
      context
    );

    return {
      confidenceMetrics: {
        overall: overallConfidence,
        bySpellSchool: spellSchoolConfidence,
        byCharacterClass: characterClassConfidence,
        byTerrain: terrainConfidence
      },
      additionalInsights,
      riskFactors
    };
  }

  /**
   * Calculate spell school confidence based on interaction potential
   */
  private static calculateSpellSchoolConfidence(
    primarySpell: Spell, 
    secondarySpell: Spell
  ): Record<string, number> {
    const spellSchoolSynergyMatrix = {
      'evocation': { 
        'conjuration': 0.8, 
        'illusion': 0.6 
      },
      'conjuration': { 
        'evocation': 0.7, 
        'transmutation': 0.9 
      },
      // Expand with more school interactions
    };

    const confidence: Record<string, number> = {};
    
    // Primary spell school confidence
    confidence[primarySpell.school] = 0.7;
    
    // Secondary spell school confidence
    confidence[secondarySpell.school] = 0.7;

    // Check for school synergy
    if (
      spellSchoolSynergyMatrix[primarySpell.school]?.[secondarySpell.school]
    ) {
      const synergyBonus = spellSchoolSynergyMatrix[primarySpell.school][secondarySpell.school];
      confidence[primarySpell.school] += synergyBonus;
      confidence[secondarySpell.school] += synergyBonus;
    }

    return confidence;
  }

  /**
   * Calculate character class confidence for spell interaction
   */
  private static calculateCharacterClassConfidence(
    character: Character, 
    primarySpell: Spell, 
    secondarySpell: Spell
  ): Record<string, number> {
    const classSpellAffinityMap = {
      'wizard': { 
        compatibleSchools: ['evocation', 'conjuration', 'illusion'],
        synergyBonus: 0.2 
      },
      'sorcerer': { 
        compatibleSchools: ['evocation', 'transmutation'],
        synergyBonus: 0.15 
      },
      // Add more classes
    };

    const confidence: Record<string, number> = { 
      [character.class]: 0.6 
    };

    const classAffinityData = classSpellAffinityMap[character.class];
    if (classAffinityData) {
      if (
        classAffinityData.compatibleSchools.includes(primarySpell.school) &&
        classAffinityData.compatibleSchools.includes(secondarySpell.school)
      ) {
        confidence[character.class] += classAffinityData.synergyBonus;
      }
    }

    return confidence;
  }

  /**
   * Calculate terrain-specific confidence
   */
  private static calculateTerrainConfidence(
    context: EnvironmentalContext
  ): Record<string, number> {
    const terrainInteractionMap = {
      'forest': 0.8,
      'mountain': 0.7,
      'desert': 0.6,
      'underwater': 0.5
    };

    return {
      [context.terrain]: terrainInteractionMap[context.terrain] || 0.5
    };
  }

  /**
   * Compute overall confidence by aggregating individual confidence metrics
   */
  private static computeOverallConfidence(
    spellSchoolConfidence: Record<string, number>,
    characterClassConfidence: Record<string, number>,
    terrainConfidence: Record<string, number>
  ): number {
    const confidenceFactors = [
      ...Object.values(spellSchoolConfidence),
      ...Object.values(characterClassConfidence),
      ...Object.values(terrainConfidence)
    ];

    const averageConfidence = 
      confidenceFactors.reduce((sum, conf) => sum + conf, 0) / 
      confidenceFactors.length;

    return Math.min(Math.max(averageConfidence, 0.1), 0.9);
  }

  /**
   * Generate additional insights based on spell interaction
   */
  private static generateAdditionalInsights(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character,
    context: EnvironmentalContext
  ): string[] {
    const insights: string[] = [];

    // Spell level compatibility insight
    if (Math.abs(primarySpell.level - secondarySpell.level) > 2) {
      insights.push(
        `Significant level difference between spells may impact interaction effectiveness`
      );
    }

    // Character specialization insight
    if (
      primarySpell.school === character.specialization || 
      secondarySpell.school === character.specialization
    ) {
      insights.push(
        `Spell aligns with character's specialization, potentially enhancing interaction`
      );
    }

    // Environmental context insight
    if (context.combatDifficulty === 'challenging') {
      insights.push(
        `High environmental complexity may introduce unexpected spell interactions`
      );
    }

    return insights;
  }

  /**
   * Identify potential risk factors in spell interaction
   */
  private static identifyRiskFactors(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character,
    context: EnvironmentalContext
  ): string[] {
    const riskFactors: string[] = [];

    // Spell resource cost risk
    const totalSpellResourceCost = 
      primarySpell.resourceCost + secondarySpell.resourceCost;
    if (totalSpellResourceCost > character.maxResourceCapacity * 0.7) {
      riskFactors.push(
        `High combined spell resource cost exceeds recommended threshold`
      );
    }

    // Terrain interaction risk
    if (context.terrain === 'underwater' && 
        (primarySpell.type === 'fire' || secondarySpell.type === 'fire')) {
      riskFactors.push(
        `Fire-based spells significantly reduced effectiveness in underwater environment`
      );
    }

    // Spell compatibility risk
    if (primarySpell.school === secondarySpell.school) {
      riskFactors.push(
        `Casting spells from same school might lead to diminishing returns`
      );
    }

    return riskFactors;
  }

  /**
   * Apply advanced ML adjustments to base interaction analysis
   */
  private static applyAdvancedMLAdjustments(
    baseAnalysis: SpellInteractionAnalysis,
    predictionContext: AdvancedPredictionContext
  ): SpellInteractionAnalysis {
    const { confidenceMetrics } = predictionContext;
    
    // Compute confidence-based adjustment
    const confidenceMultiplier = 
      1 + (confidenceMetrics.overall * 0.5);

    // Adjust compatibility score
    const adjustedCompatibilityScore = Math.min(
      baseAnalysis.compatibilityScore * confidenceMultiplier, 
      10
    );

    return {
      ...baseAnalysis,
      compatibilityScore: adjustedCompatibilityScore,
      potentialOutcomes: [
        ...baseAnalysis.potentialOutcomes,
        ...predictionContext.additionalInsights
      ],
      riskFactors: [
        ...baseAnalysis.riskFactors,
        ...predictionContext.riskFactors
      ]
    };
  }

  /**
   * Collect training data for continuous model improvement
   */
  private static collectTrainingData(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character,
    context: EnvironmentalContext,
    analysis: SpellInteractionAnalysis
  ): void {
    MLTrainingDataCollector.recordTrainingData({
      primarySpell,
      secondarySpell,
      character,
      context,
      performanceMetrics: {
        damageDealt: analysis.compatibilityScore * 10,
        resourceEfficiency: 
          (10 - analysis.riskFactors.length) / 10,
        tacticalAdvantage: analysis.compatibilityScore / 2
      },
      outcome: 
        analysis.compatibilityScore >= 7 ? 'success' :
        analysis.compatibilityScore >= 4 ? 'neutral' : 
        'failure'
    });
  }
}
