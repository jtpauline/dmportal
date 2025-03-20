import React, { useState } from 'react';
import { Character } from '~/modules/characters';
import { Spell } from '~/modules/utils/spell-system';
import { SpellSystem } from '~/modules/utils/spell-system';

interface SpellInteractionAnalyzerProps {
  character: Character;
  availableSpells: Spell[];
  targetCharacters?: Character[];
}

export const SpellInteractionAnalyzer: React.FC<SpellInteractionAnalyzerProps> = ({ 
  character, 
  availableSpells,
  targetCharacters = []
}) => {
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<Character | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleSpellAnalysis = () => {
    if (!selectedSpell) return;

    const interactionResult = SpellSystem.analyzeSpellInteraction(
      character, 
      selectedSpell, 
      selectedTarget || undefined
    );

    setAnalysisResult(interactionResult);
  };

  return (
    <div className="spell-interaction-analyzer p-6 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Spell Interaction Analyzer</h2>

      <div className="spell-selection mb-4">
        <label className="block mb-2 font-semibold">Select Spell</label>
        <select 
          value={selectedSpell?.id || ''}
          onChange={(e) => {
            const spell = availableSpells.find(s => s.id === e.target.value);
            setSelectedSpell(spell || null);
          }}
          className="w-full p-2 border rounded"
        >
          <option value="">Choose a Spell</option>
          {availableSpells.map(spell => (
            <option key={spell.id} value={spell.id}>
              {spell.name} (Level {spell.level})
            </option>
          ))}
        </select>
      </div>

      {targetCharacters.length > 0 && (
        <div className="target-selection mb-4">
          <label className="block mb-2 font-semibold">Select Target</label>
          <select 
            value={selectedTarget?.id || ''}
            onChange={(e) => {
              const target = targetCharacters.find(c => c.id === e.target.value);
              setSelectedTarget(target || null);
            }}
            className="w-full p-2 border rounded"
          >
            <option value="">Choose a Target (Optional)</option>
            {targetCharacters.map(target => (
              <option key={target.id} value={target.id}>
                {target.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button 
        onClick={handleSpellAnalysis}
        disabled={!selectedSpell}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        Analyze Spell Interaction
      </button>

      {analysisResult && (
        <div className="analysis-result mt-6 p-4 bg-white rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Spell Interaction Analysis</h3>

          {!analysisResult.isValid ? (
            <div className="text-red-600">
              <p>Spell Interaction Invalid</p>
              {analysisResult.errors.map((error, index) => (
                <p key={index} className="text-sm">{error}</p>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-green-600">Spell Interaction Valid</p>

              {analysisResult.potentialEffects && (
                <div className="potential-effects mt-4">
                  <h4 className="font-semibold">Potential Effects:</h4>
                  {analysisResult.potentialEffects.map((effect, index) => (
                    <div key={index} className="bg-gray-100 p-2 rounded mt-2">
                      <p>Type: {effect.type}</p>
                      <p>Value: {effect.value}</p>
                      {effect.savingThrow && (
                        <p>
                          Saving Throw: {effect.savingThrow.ability} 
                          (DC {effect.savingThrow.difficulty})
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {analysisResult.savingThrowResult && (
                <div className="saving-throw-result mt-4">
                  <h4 className="font-semibold">Saving Throw Result:</h4>
                  <p>Success: {analysisResult.savingThrowResult.success ? 'Yes' : 'No'}</p>
                  <p>Partial Effect: {analysisResult.savingThrowResult.partialEffect ? 'Yes' : 'No'}</p>
                  {analysisResult.savingThrowResult.damage && (
                    <p>Damage: {analysisResult.savingThrowResult.damage}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
