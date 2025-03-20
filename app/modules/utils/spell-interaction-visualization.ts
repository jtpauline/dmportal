import { Spell } from '../spells';
import { Character } from '../characters';
import { EnvironmentalContext } from './spell-interaction-analyzer';
import { SpellInteractionAnalysis } from './spell-interaction-analyzer';
import { AdvancedSpellInteractionPredictor } from './spell-interaction-advanced-predictor';

export interface SpellInteractionVisualizationData {
  compatibilityScore: number;
  spellSchools: {
    primary: string;
    secondary: string;
  };
  confidenceMetrics: {
    overall: number;
    bySpellSchool: Record<string, number>;
    byCharacterClass: Record<string, number>;
    byTerrain: Record<string, number>;
  };
  potentialOutcomes: string[];
  riskFactors: string[];
  visualRepresentation: {
    compatibilityColor: string;
    compatibilityIntensity: number;
    riskVisualization: string[];
  };
}

export class SpellInteractionVisualizer {
  /**
   * Generate comprehensive visualization data for spell interaction
   * @param primarySpell Primary spell in interaction
   * @param secondarySpell Secondary spell in interaction
   * @param character Casting character
   * @param context Environmental context
   * @returns Detailed visualization data
   */
  static generateVisualizationData(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character,
    context: EnvironmentalContext
  ): SpellInteractionVisualizationData {
    // Predict advanced spell interaction
    const advancedAnalysis = AdvancedSpellInteractionPredictor.predictAdvancedSpellInteraction(
      primarySpell,
      secondarySpell,
      character,
      context
    );

    // Generate visual representation
    const visualRepresentation = this.createVisualRepresentation(
      advancedAnalysis.compatibilityScore,
      advancedAnalysis.riskFactors
    );

    return {
      compatibilityScore: advancedAnalysis.compatibilityScore,
      spellSchools: {
        primary: primarySpell.school,
        secondary: secondarySpell.school
      },
      confidenceMetrics: advancedAnalysis.predictionContext.confidenceMetrics,
      potentialOutcomes: advancedAnalysis.potentialOutcomes,
      riskFactors: advancedAnalysis.riskFactors,
      visualRepresentation
    };
  }

  /**
   * Create visual representation of spell interaction
   * @param compatibilityScore Interaction compatibility score
   * @param riskFactors Identified risk factors
   * @returns Visual representation data
   */
  private static createVisualRepresentation(
    compatibilityScore: number,
    riskFactors: string[]
  ): SpellInteractionVisualizationData['visualRepresentation'] {
    // Determine compatibility color based on score
    const getCompatibilityColor = (score: number): string => {
      if (score >= 8) return 'emerald';
      if (score >= 6) return 'green';
      if (score >= 4) return 'yellow';
      if (score >= 2) return 'orange';
      return 'red';
    };

    // Generate risk visualization
    const riskVisualization = riskFactors.map(factor => {
      const riskSeverityMap: Record<string, string> = {
        'High combined spell resource cost': 'critical',
        'Fire-based spells significantly reduced': 'warning',
        'Casting spells from same school': 'moderate'
      };

      const severityLevel = Object.entries(riskSeverityMap)
        .find(([key]) => factor.includes(key))?.[1] || 'low';

      return `${severityLevel}:${factor}`;
    });

    return {
      compatibilityColor: getCompatibilityColor(compatibilityScore),
      compatibilityIntensity: Math.min(compatibilityScore / 10, 1),
      riskVisualization
    };
  }

  /**
   * Generate spell interaction complexity score
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @returns Complexity score and breakdown
   */
  static calculateInteractionComplexity(
    primarySpell: Spell,
    secondarySpell: Spell
  ): {
    complexityScore: number;
    complexityBreakdown: {
      levelDifference: number;
      schoolInteraction: number;
      resourceCostVariance: number;
    }
  } {
    // Calculate complexity based on multiple factors
    const levelDifferenceComplexity = 
      Math.abs(primarySpell.level - secondarySpell.level) * 0.2;

    const schoolInteractionComplexity = 
      primarySpell.school === secondarySpell.school ? 0.1 : 0.3;

    const resourceCostVarianceComplexity = 
      Math.abs(primarySpell.resourceCost - secondarySpell.resourceCost) / 10;

    const complexityScore = Math.min(
      levelDifferenceComplexity + 
      schoolInteractionComplexity + 
      resourceCostVarianceComplexity,
      1
    );

    return {
      complexityScore,
      complexityBreakdown: {
        levelDifference: levelDifferenceComplexity,
        schoolInteraction: schoolInteractionComplexity,
        resourceCostVariance: resourceCostVarianceComplexity
      }
    };
  }
}
