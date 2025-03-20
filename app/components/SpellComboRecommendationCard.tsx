import React from 'react';
import { SpellComboRecommendation } from '~/modules/utils/spell-interaction-plugin-system';

interface SpellComboRecommendationCardProps {
  recommendation: SpellComboRecommendation;
}

export const SpellComboRecommendationCard: React.FC<SpellComboRecommendationCardProps> = ({ 
  recommendation 
}) => {
  const getRecommendationColor = (score: number) => {
    if (score >= 0.9) return 'bg-green-100 border-green-300';
    if (score >= 0.7) return 'bg-yellow-100 border-yellow-300';
    return 'bg-gray-100 border-gray-300';
  };

  return (
    <div className={`
      p-4 rounded-lg border-2 mb-2 
      ${getRecommendationColor(recommendation.recommendationScore)}
    `}>
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-bold text-lg">
            Spell Combo Recommendation
          </h4>
          <p className="text-sm text-gray-600">
            {recommendation.rationale}
          </p>
        </div>
        <div className="text-right">
          <span className="font-bold text-xl">
            {(recommendation.recommendationScore * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
};
