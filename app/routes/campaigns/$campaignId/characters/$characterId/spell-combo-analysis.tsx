import React, { useState } from 'react';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { SpellComboRecommendationSystem } from '~/modules/utils/spell-combo-recommendation-system';
import { SpellComboRecommendationCard } from '~/components/SpellComboRecommendationCard';
import { SpellComboVisualization } from '~/components/SpellComboVisualization';
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

  // Mock available spells with more comprehensive set
  const availableSpells = [
    { 
      id: 'fireball',
      name: 'Fireball', 
      level: 3, 
      school: 'Evocation', 
      tags: ['damage', 'offensive', 'area-of-effect'] 
    },
    { 
      id: 'misty-step',
      name: 'Misty Step', 
      level: 2, 
      school: 'Conjuration', 
      tags: ['utility', 'movement', 'teleportation'] 
    },
    { 
      id: 'shield',
      name: 'Shield', 
      level: 1, 
      school: 'Abjuration', 
      tags: ['defense', 'protection', 'instant'] 
    },
    { 
      id: 'magic-missile',
      name: 'Magic Missile', 
      level: 1, 
      school: 'Evocation', 
      tags: ['damage', 'offensive', 'guaranteed-hit'] 
    },
    { 
      id: 'detect-magic',
      name: 'Detect Magic', 
      level: 1, 
      school: 'Divination', 
      tags: ['utility', 'information', 'detection'] 
    },
    {
      id: 'mage-armor',
      name: 'Mage Armor',
      level: 1,
      school: 'Abjuration',
      tags: ['defense', 'protection', 'buff']
    },
    {
      id: 'invisibility',
      name: 'Invisibility',
      level: 2,
      school: 'Illusion',
      tags: ['utility', 'stealth', 'defensive']
    }
  ];

  return json({
    character,
    availableSpells
  });
};

export default function SpellComboAnalysisPage() {
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
      <h1 className="text-3xl font-bold mb-6">{character.name}'s Spell Combo Analysis</h1>
      
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

      <SpellComboVisualization combos={optimalCombinations} />

      <div className="mt-8 space-y-6">
        <h2 className="text-2xl font-bold">Detailed Spell Combinations</h2>
        {optimalCombinations.map((combo) => (
          <SpellComboRecommendationCard 
            key={combo.primarySpell.id} 
            combo={combo} 
          />
        ))}
      </div>
    </div>
  );
}
