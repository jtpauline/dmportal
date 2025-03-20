import React from 'react';
import { SpellComboRecommendation } from '~/modules/utils/spell-combo-recommendation-system';

interface SpellComboRecommendationCardProps {
  combo: SpellComboRecommendation[];
}

export const SpellComboRecommendationCard: React.FC<SpellComboRecommendationCardProps> = ({ 
  combo 
}) => {
  // Recommendation strength color mapping
  const strengthColorMap = {
    'exceptional': 'bg-purple-100 border-purple-300 text-purple-800',
    'high': 'bg-green-100 border-green-300 text-green-800',
    'moderate': 'bg-yellow-100 border-yellow-300 text-yellow-800',
    'low': 'bg-red-100 border-red-300 text-red-800'
  };

  // No recommendations case
  if (combo.length === 0) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg text-center">
        <p className="text-gray-600">
          No spell combo recommendations available
        </p>
      </div>
    );
  }

  return (
    <div className="spell-combo-recommendations bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">
        Spell Combo Recommendations
      </h3>

      {combo.map((recommendation, index) => (
        <div 
          key={index} 
          className={`
            mb-4 p-4 rounded-lg border
            ${strengthColorMap[recommendation.recommendationStrength]}
          `}
        >
          <div className="flex justify-between items-center mb-2">
            <div>
              <h4 className="font-semibold text-lg">
                {recommendation.primarySpell.name} + {recommendation.secondarySpell.name}
              </h4>
              <p className="text-sm text-gray-600">
                Compatibility: {recommendation.compatibilityScore.toFixed(2)}/10
              </p>
            </div>
            <span 
              className="px-2 py-1 rounded-full text-xs uppercase font-bold"
            >
              {recommendation.recommendationStrength}
            </span>
          </div>

          <div className="mt-2">
            <h5 className="font-semibold mb-1">Strategic Potential</h5>
            <ul className="list-disc list-inside text-gray-700 text-sm">
              {recommendation.strategicPotential.map((potential, idx) => (
                <li key={idx}>{potential}</li>
              ))}
            </ul>
          </div>

          <div className="mt-2">
            <h5 className="font-semibold mb-1">Synergy Critical Points</h5>
            <ul className="list-disc list-inside text-gray-700 text-sm">
              {recommendation.synergyCriticalPoints.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
