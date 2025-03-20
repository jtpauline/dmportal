import { Spell } from '../spells';
import { Character } from '../characters';
import { EnvironmentalContext } from './spell-interaction-analyzer';
import { SpellInteractionAnalysis } from './spell-interaction-analyzer';
import { SpellInteractionCache } from './spell-interaction-cache';
import { MLTrainingDataPoint, MLTrainingDataCollector } from './ml-training-data-collector';
import { SpellInteractionMLExporter } from './spell-interaction-ml-exporter';
import { SpellInteractionPluginManager } from './spell-interaction-plugin-system';

export class AdvancedSpellInteractionMLPredictor {
  // Advanced ML model simulation
  private static trainingDataset: MLTrainingDataPoint[] = [];
  private static modelConfidence: {
    overall: number;
    bySpellSchool: Record<string, number>;
    byTerrain: Record<string, number>;
  } = {
    overall: 0.5,
    bySpellSchool: {},
    byTerrain: {}
  };

  /**
   * Train advanced ML model with comprehensive dataset
   * @param trainingData Comprehensive spell interaction training data
   */
  static trainAdvancedModel(trainingData: MLTrainingDataPoint[]): void {
    // Accumulate and process training data
    this.trainingDataset.push(...trainingData);

    // Compute granular model confidence
    this.computeAdvancedModelConfidence();

    // Export dataset for potential external ML processing
    const exportedDataset = SpellInteractionMLExporter.convertToMLDataset(this.trainingDataset);
    const jsonExport = SpellInteractionMLExporter.exportDataset(exportedDataset, 'json');
    
    // Optional: Log or store exported dataset
    console.log('Exported ML Dataset:', jsonExport);
  }

  /**
   * Compute advanced model confidence with multi-dimensional analysis
   */
  private static computeAdvancedModelConfidence(): void {
    // Overall confidence based on dataset size
    this.modelConfidence.overall = Math.min(
      this.trainingDataset.length / 5000, 
      0.9
    );

    // Spell school-specific confidence
    const spellSchoolConfidence = this.trainingDataset.reduce((acc, dataPoint) => {
      const school = dataPoint.primarySpell.school;
      acc[school] = (acc[school] || 0) + 1;
      return acc;
    }, {});

    Object.keys(spellSchoolConfidence).forEach(school => {
      this.modelConfidence.bySpellSchool[school] = 
        Math.min(spellSchoolConfidence[school] / 500, 0.8);
    });

    // Terrain-specific confidence
    const terrainConfidence = this.trainingDataset.reduce((acc, dataPoint) => {
      const terrain = dataPoint.context.terrain;
      acc[terrain] = (acc[terrain] || 0) + 1;
      return acc;
    }, {});

    Object.keys(terrainConfidence).forEach(terrain => {
      this.modelConfidence.byTerrain[terrain] = 
        Math.min(terrainConfidence[terrain] / 300, 0.7);
    });
  }

  /**
   * Advanced spell interaction prediction with multi-dimensional analysis
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @param character Casting character
   * @param context Environmental context
   * @returns Advanced predicted spell interaction analysis
   */
  static predictAdvancedSpellInteraction(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character,
    context: EnvironmentalContext
  ): SpellInteractionAnalysis {
    // Retrieve cached analysis
    const cachedAnalysis = SpellInteractionCache.analyzeSpellInteraction(
      primarySpell, 
      secondarySpell, 
      character, 
      context
    );

    // Process through interaction plugins
    const pluginResults = SpellInteractionPluginManager.processSpellInteraction(
      primarySpell,
      secondarySpell,
      character,
      context
    );

    // Determine contextual confidence
    const schoolConfidence = 
      this.modelConfidence.bySpellSchool[primarySpell.school] || 0.5;
    const terrainConfidence = 
      this.modelConfidence.byTerrain[context.terrain] || 0.5;

    // Advanced ML-based adjustments
    if (schoolConfidence > 0.6 && terrainConfidence > 0.5) {
      return this.applyAdvancedMLAdjustments(
        cachedAnalysis, 
        pluginResults,
        schoolConfidence, 
        terrainConfidence
      );
    }

    return cachedAnalysis;
  }

  /**
   * Apply advanced ML-based adjustments to interaction analysis
   * @param baseAnalysis Base interaction analysis
   * @param pluginResults Plugin processing results
   * @param schoolConfidence Spell school-specific confidence
   * @param terrainConfidence Terrain-specific confidence
   * @returns Enhanced interaction analysis
   */
  private static applyAdvancedMLAdjustments(
    baseAnalysis: SpellInteractionAnalysis,
    pluginResults: any[],
    schoolConfidence: number,
    terrainConfidence: number
  ): SpellInteractionAnalysis {
    // Aggregate plugin adjustments
    const pluginCompatibilityAdjustments = pluginResults.reduce(
      (total, result) => total + (result.compatibilityScoreAdjustment || 0), 
      0
    );

    // Compute dynamic adjustment factors
    const confidenceMultiplier = 1 + (schoolConfidence * terrainConfidence);
    
    // Aggregate plugin insights and warnings
    const additionalInsights = pluginResults.flatMap(
      result => result.additionalInsights || []
    );
    const warningMessages = pluginResults.flatMap(
      result => result.warningMessages || []
    );

    return {
      ...baseAnalysis,
      compatibilityScore: Math.min(
        baseAnalysis.compatibilityScore * confidenceMultiplier + pluginCompatibilityAdjustments, 
        10
      ),
      potentialOutcomes: [
        ...baseAnalysis.potentialOutcomes,
        ...additionalInsights,
        `Advanced ML Insight (Confidence: ${(schoolConfidence * 100).toFixed(2)}%)`
      ],
      riskFactors: [
        ...baseAnalysis.riskFactors,
        ...warningMessages,
        `Prediction Uncertainty: ${((1 - schoolConfidence) * 100).toFixed(2)}%`
      ]
    };
  }

  /**
   * Get comprehensive model statistics
   * @returns Detailed model statistics
   */
  static getAdvancedModelStats() {
    return {
      overallConfidence: this.modelConfidence.overall,
      spellSchoolConfidence: this.modelConfidence.bySpellSchool,
      terrainConfidence: this.modelConfidence.byTerrain,
      trainingDatasetSize: this.trainingDataset.length,
      registeredPlugins: SpellInteractionPluginManager.getRegisteredPlugins().map(p => p.name)
    };
  }
}
