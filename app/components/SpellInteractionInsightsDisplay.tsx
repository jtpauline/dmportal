import React, { useMemo } from 'react';
import { Spell } from '../modules/spells';
import { Character } from '../modules/characters';
import { EnvironmentalContext } from '../modules/utils/spell-interaction-analyzer';
import { AdvancedSpellInteractionMLPredictor } from '../modules/utils/spell-interaction-ml-predictor';
import { MLTrainingDataCollector } from '../modules/utils/ml-training-data-collector';

interface SpellInteractionInsightsProps {
  primarySpell: Spell;
  secondarySpell: Spell;
  character: Character;
  context: EnvironmentalContext;
}

export const SpellInteractionInsightsDisplay: React.FC<SpellInteractionInsightsProps> = ({
  primarySpell,
  secondarySpell,
  character,
  context
}) => {
  const interactionAnalysis = useMemo(() => {
    return AdvancedSpellInteractionMLPredictor.predictAdvancedSpellInteraction(
      primarySpell,
      secondarySpell,
      character,
      context
    );
  }, [primarySpell, secondarySpell, character, context]);

  const datasetStatistics = useMemo(() => {
    return MLTrainingDataCollector.getDatasetStatistics();
  }, []);

  const modelStats = useMemo(() => {
    return AdvancedSpellInteractionMLPredictor.getAdvancedModelStats();
  }, []);

  const renderConfidenceBar = (confidence: number, label: string) => {
    const width = `${confidence * 100}%`;
    const color = confidence > 0.7 ? 'bg-green-500' : 
                  confidence > 0.4 ? 'bg-yellow-500' : 
                  'bg-red-500';

    return (
      <div className="mb-2">
        <div className="flex justify-between text-xs mb-1">
          <span>{label}</span>
          <span>{(confidence * 100).toFixed(2)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${color}`} 
            style={{ width }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Spell Interaction Insights</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Interaction Analysis</h3>
          <div className="bg-white p-3 rounded-md">
            <p>Compatibility Score: {interactionAnalysis.compatibilityScore.toFixed(2)}/10</p>
            
            <h4 className="mt-2 font-medium">Potential Outcomes:</h4>
            <ul className="list-disc list-inside text-sm">
              {interactionAnalysis.potentialOutcomes.map((outcome, index) => (
                <li key={index}>{outcome}</li>
              ))}
            </ul>
            
            <h4 className="mt-2 font-medium">Risk Factors:</h4>
            <ul className="list-disc list-inside text-sm text-red-600">
              {interactionAnalysis.riskFactors.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Model Confidence</h3>
          <div className="bg-white p-3 rounded-md">
            {renderConfidenceBar(modelStats.overallConfidence, 'Overall Model Confidence')}
            
            <h4 className="mt-2 font-medium">Spell School Confidence:</h4>
            {Object.entries(modelStats.spellSchoolConfidence).map(([school, confidence]) => (
              renderConfidenceBar(confidence, `${school} School`)
            ))}
            
            <h4 className="mt-2 font-medium">Terrain Confidence:</h4>
            {Object.entries(modelStats.terrainConfidence).map(([terrain, confidence]) => (
              renderConfidenceBar(confidence, `${terrain} Terrain`)
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-4 bg-white p-3 rounded-md">
        <h3 className="font-semibold mb-2">Dataset Statistics</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium">Total Data Points</h4>
            <p>{datasetStatistics.totalDataPoints}</p>
          </div>
          <div>
            <h4 className="font-medium">Outcome Distribution</h4>
            <ul>
              {Object.entries(datasetStatistics.outcomeDistribution).map(([outcome, count]) => (
                <li key={outcome}>{outcome}: {count}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Spell School Distribution</h4>
            <ul>
              {Object.entries(datasetStatistics.spellSchoolDistribution).map(([school, count]) => (
                <li key={school}>{school}: {count}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
