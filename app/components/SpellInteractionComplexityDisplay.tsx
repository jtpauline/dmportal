import React from 'react';
import { SpellInteractionVisualizer } from '~/modules/utils/spell-interaction-visualization';
import { Spell } from '~/modules/spells';

interface SpellInteractionComplexityDisplayProps {
  primarySpell: Spell;
  secondarySpell: Spell;
}

export const SpellInteractionComplexityDisplay: React.FC<SpellInteractionComplexityDisplayProps> = ({ 
  primarySpell, 
  secondarySpell 
}) => {
  const complexityData = SpellInteractionVisualizer.calculateInteractionComplexity(
    primarySpell, 
    secondarySpell
  );

  const getComplexityColor = (score: number) => {
    if (score >= 0.8) return 'bg-red-100 text-red-800';
    if (score >= 0.6) return 'bg-orange-100 text-orange-800';
    if (score >= 0.4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className={`
      p-4 rounded-lg border 
      ${getComplexityColor(complexityData.complexityScore)}
    `}>
      <h4 className="font-bold text-lg mb-2">
        Spell Interaction Complexity
      </h4>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-sm font-semibold">Overall Complexity</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <div 
              className="bg-purple-600 h-2.5 rounded-full" 
              style={{ width: `${complexityData.complexityScore * 100}%` }}
            ></div>
          </div>
          <span className="text-xs">
            {(complexityData.complexityScore * 100).toFixed(0)}%
          </span>
        </div>

        <div>
          <div className="text-xs">
            <p>Level Difference: {(complexityData.complexityBreakdown.levelDifference * 100).toFixed(0)}%</p>
            <p>School Interaction: {(complexityData.complexityBreakdown.schoolInteraction * 100).toFixed(0)}%</p>
            <p>Resource Cost Variance: {(complexityData.complexityBreakdown.resourceCostVariance * 100).toFixed(0)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
