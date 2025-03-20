import React from 'react';
import { SpellInteractionVisualizationData } from '~/modules/utils/spell-interaction-visualization';

interface SpellInteractionVisualizationCardProps {
  visualizationData: SpellInteractionVisualizationData;
}

export const SpellInteractionVisualizationCard: React.FC<SpellInteractionVisualizationCardProps> = ({ 
  visualizationData 
}) => {
  const getCompatibilityColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      emerald: 'bg-emerald-100 border-emerald-300 text-emerald-800',
      green: 'bg-green-100 border-green-300 text-green-800',
      yellow: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      orange: 'bg-orange-100 border-orange-300 text-orange-800',
      red: 'bg-red-100 border-red-300 text-red-800'
    };
    return colorMap[color] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  const renderConfidenceMetrics = () => {
    const { confidenceMetrics } = visualizationData;
    return (
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div>
          <p className="text-xs font-semibold">Overall Confidence</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${confidenceMetrics.overall * 100}%` }}
            ></div>
          </div>
        </div>
        {Object.entries(confidenceMetrics.bySpellSchool).map(([school, confidence]) => (
          <div key={school}>
            <p className="text-xs capitalize">{school} School</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-purple-600 h-2.5 rounded-full" 
                style={{ width: `${confidence * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderRiskFactors = () => {
    const { visualRepresentation } = visualizationData;
    return (
      <div className="mt-2 space-y-1">
        {visualRepresentation.riskVisualization.map((risk, index) => {
          const [severity, message] = risk.split(':');
          const severityColorMap = {
            critical: 'bg-red-100 text-red-800',
            warning: 'bg-yellow-100 text-yellow-800',
            moderate: 'bg-orange-100 text-orange-800',
            low: 'bg-gray-100 text-gray-800'
          };
          return (
            <div 
              key={index} 
              className={`p-1 rounded text-xs ${severityColorMap[severity]}`}
            >
              {message}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`
      p-4 rounded-lg border-2 mb-2 
      ${getCompatibilityColorClass(visualizationData.visualRepresentation.compatibilityColor)}
    `}>
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-bold text-lg">
            Spell Interaction Analysis
          </h4>
          <p className="text-sm">
            {visualizationData.spellSchools.primary} + {visualizationData.spellSchools.secondary}
          </p>
        </div>
        <div className="text-right">
          <span className="font-bold text-2xl">
            {visualizationData.compatibilityScore.toFixed(1)}
          </span>
        </div>
      </div>

      {renderConfidenceMetrics()}
      {renderRiskFactors()}

      <div className="mt-2">
        <h5 className="text-sm font-semibold">Potential Outcomes</h5>
        <ul className="text-xs list-disc list-inside">
          {visualizationData.potentialOutcomes.map((outcome, index) => (
            <li key={index}>{outcome}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
