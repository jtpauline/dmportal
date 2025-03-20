import React, { useState } from 'react';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { SpellComboRecommendationSystem } from '~/modules/utils/spell-combo-recommendation-system';
import { EnvironmentalContext } from '~/modules/utils/spell-interaction-analyzer';

export const loader = async ({ params }) => {
  // Mock data - in real implementation, fetch from actual character data
  const character = {
    name: 'Aria Stormwind',
    class: 'Wizard',
    level: 5,
    abilityScores: {
      intelligence: 16
    }
  };

  // Mock available spells
  const availableSpells = [
    { 
      id: 'fireball',
      name: 'Fireball', 
      level: 3, 
      school: 'Evocation', 
      tags: ['damage', 'offensive'] 
    },
    { 
      id: 'misty-step',
      name: 'Misty Step', 
      level: 2, 
      school: 'Conjuration', 
      tags: ['utility', 'movement'] 
    },
    { 
      id: 'shield',
      name: 'Shield', 
      level: 1, 
      school: 'Abjuration', 
      tags: ['defense', 'protection'] 
    },
    { 
      id: 'magic-missile',
      name: 'Magic Missile', 
      level: 1, 
      school: 'Evocation', 
      tags: ['damage', 'offensive'] 
    },
    { 
      id: 'detect-magic',
      name: 'Detect Magic', 
      level: 1, 
      school: 'Divination', 
      tags: ['utility', 'information'] 
    }
  ];

  return json({
    character,
    availableSpells
  });
};

export default function SpellComboRecommendationsPage() {
  const { character, availableSpells } = useLoaderData<typeof loader>();
  const [environmentalContext, setEnvironmentalContext] = useState<EnvironmentalContext>({
    environment: 'generic',
    combatDifficulty: 'moderate'
  });

  // Generate optimal spell combinations
  const optimalCombinations = SpellComboRecommendationSystem.findOptimalSpellCombinations(
    availableSpells,
    character,
    environmentalContext
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{character.name}'s Spell Combo Recommendations</h1>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Environment</h3>
          <select 
            value={environmentalContext.environment}
            onChange={(e) => setEnvironmentalContext(prev => ({
              ...prev,
              environment: e.target.value as EnvironmentalContext['environment']
            }))}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="generic">Generic</option>
            <option value="urban">Urban</option>
            <option value="wilderness">Wilderness</option>
            <option value="dungeon">Dungeon</option>
          </select>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Combat Difficulty</h3>
          <select 
            value={environmentalContext.combatDifficulty}
            onChange={(e) => setEnvironmentalContext(prev => ({
              ...prev,
              combatDifficulty: e.target.value as EnvironmentalContext['combatDifficulty']
            }))}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="challenging">Challenging</option>
            <option value="extreme">Extreme</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Optimal Spell Combinations</h2>
        {optimalCombinations.map((combo, index) => (
          <div 
            key={combo.primarySpell.id} 
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h3 className="text-xl font-semibold mb-4">
              Primary Spell: {combo.primarySpell.name}
            </h3>
            <p className="mb-4">
              Overall Recommendation Score: 
              <span className="font-bold ml-2">
                {combo.overallRecommendationScore.toFixed(2)}
              </span>
            </p>

            <div className="space-y-4">
              <h4 className="font-bold">Recommended Spell Combinations:</h4>
              {combo.recommendedSpells.map(recommendation => (
                <div 
                  key={recommendation.spell.id} 
                  className="border-b pb-4 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">
                      {recommendation.spell.name}
                    </span>
                    <span 
                      className={`
                        font-bold uppercase 
                        ${recommendation.interactionType === 'synergy' 
                          ? 'text-green-600' 
                          : recommendation.interactionType === 'conflict' 
                            ? 'text-red-600' 
                            : 'text-gray-600'
                        }
                      `}
                    >
                      {recommendation.interactionType}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p>
                      Compatibility Score: 
                      <span className="ml-2 font-bold">
                        {recommendation.compatibilityScore.toFixed(2)}
                      </span>
                    </p>
                    <p className="mt-2">
                      Strategic Potential:
                      <ul className="list-disc list-inside ml-4">
                        {recommendation.strategicPotential.map((potential, idx) => (
                          <li key={idx}>{potential}</li>
                        ))}
                      </ul>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
