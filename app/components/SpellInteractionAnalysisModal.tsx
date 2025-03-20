import React, { useState, useMemo } from 'react';
import { Spell } from '../modules/spells';
import { Character } from '../modules/characters';
import { EnvironmentalContext } from '../modules/utils/spell-interaction-analyzer';
import { MLTrainingDataCollector, MLTrainingDataPoint } from '../modules/utils/ml-training-data-collector';
import { SpellInteractionCache } from '../modules/utils/spell-interaction-cache';
import { Modal } from './ui/Modal';

interface SpellInteractionAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  primarySpell: Spell;
  secondarySpell: Spell;
  character: Character;
  context: EnvironmentalContext;
}

export const SpellInteractionAnalysisModal: React.FC<SpellInteractionAnalysisModalProps> = ({
  isOpen,
  onClose,
  primarySpell,
  secondarySpell,
  character,
  context
}) => {
  const [performanceMetrics, setPerformanceMetrics] = useState({
    damageDealt: 0,
    resourceEfficiency: 0,
    tacticalAdvantage: 0
  });

  const [outcome, setOutcome] = useState<'success' | 'neutral' | 'failure'>('neutral');

  // Compute interaction analysis
  const interactionAnalysis = useMemo(() => 
    SpellInteractionCache.analyzeSpellInteraction(
      primarySpell, 
      secondarySpell, 
      character, 
      context
    ), 
    [primarySpell, secondarySpell, character, context]
  );

  // Dataset statistics
  const datasetStats = useMemo(() => 
    MLTrainingDataCollector.getDatasetStatistics(),
    []
  );

  // Record training data
  const recordTrainingData = () => {
    const trainingDataPoint: MLTrainingDataPoint = {
      primarySpell,
      secondarySpell,
      character,
      context,
      performanceMetrics,
      outcome
    };

    MLTrainingDataCollector.recordTrainingData(trainingDataPoint);
  };

  // Render performance metrics inputs
  const renderPerformanceMetricsInputs = () => {
    const metricInputs = [
      { 
        key: 'damageDealt', 
        label: 'Damage Dealt', 
        max: 100 
      },
      { 
        key: 'resourceEfficiency', 
        label: 'Resource Efficiency', 
        max: 10 
      },
      { 
        key: 'tacticalAdvantage', 
        label: 'Tactical Advantage', 
        max: 10 
      }
    ];

    return metricInputs.map(metric => (
      <div key={metric.key} className="mb-4">
        <label className="block mb-2">{metric.label}</label>
        <input 
          type="range"
          min="0"
          max={metric.max}
          value={performanceMetrics[metric.key]}
          onChange={(e) => setPerformanceMetrics(prev => ({
            ...prev,
            [metric.key]: Number(e.target.value)
          }))}
          className="w-full"
        />
        <span>{performanceMetrics[metric.key]}</span>
      </div>
    ));
  };

  // Render dataset statistics
  const renderDatasetStatistics = () => {
    return (
      <div className="dataset-stats">
        <h4 className="text-lg font-bold mb-2">Dataset Statistics</h4>
        <div>
          <strong>Total Data Points:</strong> {datasetStats.totalDataPoints}
        </div>
        <div>
          <strong>Outcome Distribution:</strong>
          <pre>{JSON.stringify(datasetStats.outcomeDistribution, null, 2)}</pre>
        </div>
        <div>
          <strong>Spell School Distribution:</strong>
          <pre>{JSON.stringify(datasetStats.spellSchoolDistribution, null, 2)}</pre>
        </div>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="spell-interaction-analysis-modal p-6">
        <h2 className="text-2xl font-bold mb-4">
          Spell Interaction Analysis: {primarySpell.name} + {secondarySpell.name}
        </h2>

        <div className="interaction-summary mb-4">
          <h3 className="text-xl font-semibold">Interaction Details</h3>
          <p><strong>Compatibility Score:</strong> {interactionAnalysis.compatibilityScore.toFixed(2)}/10</p>
          <p><strong>Interaction Type:</strong> {interactionAnalysis.interactionType || 'Standard'}</p>
        </div>

        <div className="performance-metrics mb-4">
          <h3 className="text-xl font-semibold mb-2">Performance Metrics</h3>
          {renderPerformanceMetricsInputs()}

          <div className="outcome-selection mb-4">
            <label className="block mb-2">Interaction Outcome</label>
            <select 
              value={outcome}
              onChange={(e) => setOutcome(e.target.value as 'success' | 'neutral' | 'failure')}
              className="w-full p-2 border rounded"
            >
              <option value="success">Success</option>
              <option value="neutral">Neutral</option>
              <option value="failure">Failure</option>
            </select>
          </div>

          <button 
            onClick={recordTrainingData}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Record Training Data
          </button>
        </div>

        <div className="dataset-statistics">
          {renderDatasetStatistics()}
        </div>
      </div>
    </Modal>
  );
};
