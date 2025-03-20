import React from 'react';
import { SpellComboRecommendation } from '~/modules/utils/spell-combo-recommendation-system';

interface SpellComboVisualizationProps {
  combos: SpellComboRecommendation[];
}

export const SpellComboVisualization: React.FC<SpellComboVisualizationProps> = ({ combos }) => {
  // Calculate visualization metrics
  const totalCombos = combos.length;
  const averageRecommendationScore = combos.reduce((sum, combo) => sum + combo.overallRecommendationScore, 0) / totalCombos;
  
  const interactionTypeBreakdown = combos.reduce((acc, combo) => {
    combo.recommendedSpells.forEach(spell => {
      acc[spell.interactionType] = (acc[spell.interactionType] || 0) + 1;
    });
    return acc;
  }, { synergy: 0, conflict: 0, neutral: 0 });

  return (
    <div className="spell-combo-visualization bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Spell Combo Analysis Overview</h2>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Combinations</h3>
          <p className="text-3xl font-bold text-blue-600">{totalCombos}</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Avg Recommendation Score</h3>
          <p className="text-3xl font-bold text-green-600">
            {averageRecommendationScore.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Interaction Type Distribution</h3>
          <div className="space-y-2">
            {Object.entries(interactionTypeBreakdown).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="capitalize">{type}</span>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Interaction Type Breakdown</h3>
        <div className="flex space-x-4">
          {Object.entries(interactionTypeBreakdown).map(([type, count]) => (
            <div 
              key={type} 
              className="flex-1 bg-gray-100 p-4 rounded-lg text-center"
            >
              <h4 className="text-lg font-semibold capitalize mb-2">{type}</h4>
              <p className="text-2xl font-bold">
                {count}
                <span className="text-sm ml-1">({((count / Object.values(interactionTypeBreakdown).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%)</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
