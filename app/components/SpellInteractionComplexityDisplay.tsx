import React from 'react';
import { SpellInteractionComplexityMetrics } from '~/modules/utils/spell-interaction-complexity-analyzer';

interface SpellInteractionComplexityDisplayProps {
  complexityMetrics: SpellInteractionComplexityMetrics;
}

const SpellInteractionComplexityDisplay: React.FC<SpellInteractionComplexityDisplayProps> = ({ 
  complexityMetrics 
}) => {
  const renderMetricBar = (value: number, label: string) => {
    const percentage = value * 100;
    const colorIntensity = Math.floor(value * 255);
    
    return (
      <div className="complexity-metric mb-2">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm font-medium">{percentage.toFixed(0)}%</span>
        </div>
        <div 
          className="w-full bg-gray-200 rounded-full h-2.5"
          style={{ 
            boxShadow: `0 0 10px rgba(${colorIntensity}, 0, ${255 - colorIntensity}, 0.5)` 
          }}
        >
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ 
              width: `${percentage}%`,
              background: `linear-gradient(to right, 
                rgba(${colorIntensity}, 0, ${255 - colorIntensity}, 0.8), 
                rgba(${colorIntensity}, 0, ${255 - colorIntensity}, 0.5))`
            }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="spell-interaction-complexity-display p-4 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Spell Interaction Complexity Analysis
      </h2>
      
      <div className="complexity-metrics space-y-3">
        {renderMetricBar(
          complexityMetrics.overallComplexity, 
          'Overall Complexity'
        )}
        
        {renderMetricBar(
          complexityMetrics.synergyComplexity, 
          'Synergy Complexity'
        )}
        
        {renderMetricBar(
          complexityMetrics.unexpectedInteractionProbability, 
          'Unexpected Interaction Risk'
        )}
        
        {renderMetricBar(
          complexityMetrics.magicalResonanceIntensity, 
          'Magical Resonance Intensity'
        )}
        
        {renderMetricBar(
          complexityMetrics.interactionRiskFactor, 
          'Interaction Risk Factor'
        )}
      </div>

      <div className="complexity-insights mt-4 text-sm text-gray-600">
        <p>
          🔮 Magical Complexity Interpretation:
          {complexityMetrics.overallComplexity > 0.7 
            ? " High complexity detected. Proceed with caution!" 
            : complexityMetrics.overallComplexity > 0.4 
              ? " Moderate complexity. Strategic spell selection recommended." 
              : " Low complexity. Spell interactions appear stable."}
        </p>
      </div>
    </div>
  );
};

export default SpellInteractionComplexityDisplay;
