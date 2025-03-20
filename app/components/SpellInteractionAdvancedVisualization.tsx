import React from 'react';
import { SpellInteractionPrediction } from '../modules/utils/spell-interaction-ml-advanced-predictor';

interface SpellInteractionAdvancedVisualizationProps {
  prediction: SpellInteractionPrediction;
  primarySpellName: string;
  secondarySpellName: string;
}

const SpellInteractionAdvancedVisualization: React.FC<SpellInteractionAdvancedVisualizationProps> = ({
  prediction,
  primarySpellName,
  secondarySpellName
}) => {
  const renderCompatibilityIndicator = () => {
    const getCompatibilityColor = (score: number) => {
      if (score < 0.3) return 'bg-red-500';
      if (score < 0.6) return 'bg-yellow-500';
      return 'bg-green-500';
    };

    return (
      <div className="compatibility-indicator">
        <div 
          className={`w-full h-2 rounded ${getCompatibilityColor(prediction.compatibilityScore)}`}
          style={{ width: `${prediction.compatibilityScore * 100}%` }}
        />
        <span className="text-sm">
          Compatibility: {(prediction.compatibilityScore * 100).toFixed(2)}%
        </span>
      </div>
    );
  };

  const renderSynergyWheel = () => {
    const synergyPercentage = prediction.synergyCoefficent * 100;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (synergyPercentage / 100) * circumference;

    return (
      <div className="synergy-wheel flex flex-col items-center">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke="#e0e0e0" 
            strokeWidth="10"
          />
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke="#4CAF50" 
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <span className="text-sm mt-2">
          Synergy: {synergyPercentage.toFixed(2)}%
        </span>
      </div>
    );
  };

  const renderCombinationStrategies = () => (
    <div className="combination-strategies">
      <h4 className="font-bold mb-2">Recommended Strategies</h4>
      <ul className="list-disc pl-5">
        {prediction.recommendedCombinationStrategy.map((strategy, index) => (
          <li key={index} className="text-sm">{strategy}</li>
        ))}
      </ul>
    </div>
  );

  const renderPotentialRisks = () => (
    <div className="potential-risks">
      <h4 className="font-bold mb-2 text-red-600">Potential Risks</h4>
      <ul className="list-disc pl-5 text-red-500">
        {prediction.potentialRisks.map((risk, index) => (
          <li key={index} className="text-sm">{risk}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="spell-interaction-advanced-visualization p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {primarySpellName} + {secondarySpellName} Interaction
      </h2>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Compatibility Analysis</h3>
          {renderCompatibilityIndicator()}
          {renderSynergyWheel()}
        </div>

        <div>
          {renderCombinationStrategies()}
          {renderPotentialRisks()}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Effectiveness Rating</h3>
        <div 
          className="w-full bg-blue-100 rounded-full h-4"
          style={{ 
            background: `linear-gradient(to right, #4CAF50 ${prediction.effectivenessRating * 100}%, #E0E0E0 ${prediction.effectivenessRating * 100}%)` 
          }}
        >
          <span className="text-sm">
            {(prediction.effectivenessRating * 100).toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default SpellInteractionAdvancedVisualization;
