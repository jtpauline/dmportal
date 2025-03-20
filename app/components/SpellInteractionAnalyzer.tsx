import React, { useState } from 'react';
import { Spell } from '~/modules/spells';
import { SpellInteractionAnalyzer } from '~/modules/utils/spell-interaction-analyzer';

interface SpellInteractionProps {
  availableSpells: Spell[];
  character: any; // Replace with actual Character type
}

export const SpellInteractionInterface: React.FC<SpellInteractionProps> = ({ 
  availableSpells, 
  character 
}) => {
  const [primarySpell, setPrimarySpell] = useState<Spell | null>(null);
  const [secondarySpell, setSecondarySpell] = useState<Spell | null>(null);
  const [interactionAnalysis, setInteractionAnalysis] = useState<any>(null);

  const analyzeSpellInteraction = () => {
    if (primarySpell) {
      const analysis = SpellInteractionAnalyzer.analyzeSpellInteraction(
        primarySpell, 
        secondarySpell || undefined,
        character,
        {
          environment: 'forest',
          combatDifficulty: 'moderate'
        }
      );
      setInteractionAnalysis(analysis);
    }
  };

  const renderInteractionAnalysis = () => {
    if (!interactionAnalysis) return null;

    return (
      <div className="spell-interaction-analysis bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Spell Interaction Analysis</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold">Interaction Type</h4>
            <p className={`
              font-bold uppercase 
              ${
                interactionAnalysis.interactionType === 'synergy' 
                  ? 'text-green-600' 
                  : interactionAnalysis.interactionType === 'conflict' 
                  ? 'text-red-600' 
                  : 'text-gray-600'
              }
            `}>
              {interactionAnalysis.interactionType}
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Compatibility Score</h4>
            <p className={`
              text-lg font-bold 
              ${
                interactionAnalysis.compatibilityScore >= 8 
                  ? 'text-green-600' 
                  : interactionAnalysis.compatibilityScore <= 3 
                  ? 'text-red-600' 
                  : 'text-gray-600'
              }
            `}>
              {interactionAnalysis.compatibilityScore.toFixed(2)}/10
            </p>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Potential Effects</h4>
          <ul className="list-disc list-inside text-gray-700">
            {interactionAnalysis.potentialEffects.map((effect, index) => (
              <li key={index}>{effect}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="spell-interaction-interface p-6 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Spell Interaction Analyzer</h2>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Primary Spell</h3>
          <select 
            value={primarySpell?.id || ''}
            onChange={(e) => {
              const selected = availableSpells.find(
                spell => spell.id === e.target.value
              );
              setPrimarySpell(selected || null);
            }}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="">Select Primary Spell</option>
            {availableSpells.map(spell => (
              <option key={spell.id} value={spell.id}>
                {spell.name} (Level {spell.level} {spell.school})
              </option>
            ))}
          </select>

          {primarySpell && (
            <div className="bg-white p-4 rounded shadow">
              <h4 className="font-semibold mb-2">Primary Spell Details</h4>
              <p>Name: {primarySpell.name}</p>
              <p>Level: {primarySpell.level}</p>
              <p>School: {primarySpell.school}</p>
              <p>Tags: {primarySpell.tags?.join(', ') || 'N/A'}</p>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Secondary Spell (Optional)</h3>
          <select 
            value={secondarySpell?.id || ''}
            onChange={(e) => {
              const selected = availableSpells.find(
                spell => spell.id === e.target.value
              );
              setSecondarySpell(selected || null);
            }}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="">Select Secondary Spell (Optional)</option>
            {availableSpells.map(spell => (
              <option key={spell.id} value={spell.id}>
                {spell.name} (Level {spell.level} {spell.school})
              </option>
            ))}
          </select>

          {secondarySpell && (
            <div className="bg-white p-4 rounded shadow">
              <h4 className="font-semibold mb-2">Secondary Spell Details</h4>
              <p>Name: {secondarySpell.name}</p>
              <p>Level: {secondarySpell.level}</p>
              <p>School: {secondarySpell.school}</p>
              <p>Tags: {secondarySpell.tags?.join(', ') || 'N/A'}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button 
          onClick={analyzeSpellInteraction}
          disabled={!primarySpell}
          className={`
            px-6 py-2 rounded 
            ${
              primarySpell 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Analyze Spell Interaction
        </button>
      </div>

      {interactionAnalysis && (
        <div className="mt-6">
          {renderInteractionAnalysis()}
        </div>
      )}
    </div>
  );
};
