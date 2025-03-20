import React, { useState, useMemo } from 'react';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { SpellInteractionAnalyzer, EnvironmentalContext } from '~/modules/utils/spell-interaction-analyzer';
import { SpellComboRecommendationCard } from '~/components/SpellComboRecommendationCard';
import { SpellComboRecommendationSystem } from '~/modules/utils/spell-combo-recommendation-system';

export const loader = async ({ params }) => {
  // Mock data - in real implementation, fetch from actual character data
  const character = {
    id: 'char1',
    name: 'Aria Stormwind',
    class: 'Wizard',
    level: 5,
    abilityScores: {
      intelligence: 16,
      wisdom: 12,
      charisma: 10
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
      tags: ['utility', 'movement', 'teleportation'] 
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

export default function SpellInteractionAnalysisPage() {
  const { character, availableSpells } = useLoaderData<typeof loader>();
  const [selectedSpell, setSelectedSpell] = useState<any>(null);
  const [environmentalContext, setEnvironmentalContext] = useState<EnvironmentalContext>({
    terrain: 'dungeon',
    combatDifficulty: 'moderate',
    partyComposition: ['Wizard', 'Fighter', 'Rogue']
  });

  // Generate spell combo recommendations
  const spellCombos = useMemo(() => {
    if (!selectedSpell) return [];
    
    return SpellComboRecommendationSystem.generateSpellComboRecommendations(
      selectedSpell, 
      availableSpells, 
      character, 
      environmentalContext
    );
  }, [selectedSpell, availableSpells, character, environmentalContext]);

  // Detailed spell interaction analysis
  const spellInteractionAnalysis = useMemo(() => {
    if (!selectedSpell) return null;

    return availableSpells
      .filter(spell => spell.id !== selectedSpell.id)
      .map(secondarySpell => 
        SpellInteractionAnalyzer.analyzeSpellInteraction(
          selectedSpell, 
          secondarySpell, 
          character, 
          environmentalContext
        )
      );
  }, [selectedSpell, availableSpells, character, environmentalContext]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {character.name}'s Spell Interaction Analysis
      </h1>

      {/* Environmental Context Controls */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div>
          <label className="block mb-2">Terrain</label>
          <select 
            value={environmentalContext.terrain}
            onChange={(e) => setEnvironmentalContext(prev => ({
              ...prev, 
              terrain: e.target.value as EnvironmentalContext['terrain']
            }))}
            className="w-full p-2 border rounded"
          >
            {['urban', 'wilderness', 'dungeon', 'open-field'].map(terrain => (
              <option key={terrain} value={terrain}>
                {terrain.charAt(0).toUpperCase() + terrain.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Combat Difficulty</label>
          <select 
            value={environmentalContext.combatDifficulty}
            onChange={(e) => setEnvironmentalContext(prev => ({
              ...prev, 
              combatDifficulty: e.target.value as EnvironmentalContext['combatDifficulty']
            }))}
            className="w-full p-2 border rounded"
          >
            {['easy', 'moderate', 'challenging', 'extreme'].map(difficulty => (
              <option key={difficulty} value={difficulty}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Primary Spell</label>
          <select 
            value={selectedSpell?.id || ''}
            onChange={(e) => {
              const selected = availableSpells.find(
                spell => spell.id === e.target.value
              );
              setSelectedSpell(selected || null);
            }}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Primary Spell</option>
            {availableSpells.map(spell => (
              <option key={spell.id} value={spell.id}>
                {spell.name} (Level {spell.level} {spell.school})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Spell Interaction Analysis */}
      {selectedSpell && spellInteractionAnalysis && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">
            Interaction Analysis for {selectedSpell.name}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Detailed Interaction Insights */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">
                Interaction Insights
              </h3>
              {spellInteractionAnalysis.map((analysis, index) => (
                <div 
                  key={index} 
                  className="mb-4 pb-4 border-b last:border-b-0"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">
                      Interaction Type: 
                      <span 
                        className={`
                          ml-2 px-2 py-1 rounded-full text-xs uppercase
                          ${analysis.interactionType === 'synergy' 
                            ? 'bg-green-100 text-green-800' 
                            : analysis.interactionType === 'conflict' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-800'
                          }
                        `}
                      >
                        {analysis.interactionType}
                      </span>
                    </span>
                    <span>
                      Compatibility: {analysis.compatibilityScore.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-2">
                    <h4 className="font-semibold">Potential Outcomes</h4>
                    <ul className="list-disc list-inside text-gray-700">
                      {analysis.potentialOutcomes.map((outcome, idx) => (
                        <li key={idx}>{outcome}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-2">
                    <h4 className="font-semibold">Risk Factors</h4>
                    <ul className="list-disc list-inside text-red-700">
                      {analysis.riskFactors.map((risk, idx) => (
                        <li key={idx}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Spell Combo Recommendations */}
            <div>
              <SpellComboRecommendationCard combo={spellCombos} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
