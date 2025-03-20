import React, { useState } from 'react';
import { Character } from '~/modules/characters';
import { Spell } from '~/modules/utils/spell-system';
import { SpellCastingSystem, SpellCastResult } from '~/modules/utils/spell-casting-system';

interface SpellCastingInterfaceProps {
  character: Character;
  preparedSpells: Spell[];
}

export const SpellCastingInterface: React.FC<SpellCastingInterfaceProps> = ({ 
  character, 
  preparedSpells 
}) => {
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [spellLevel, setSpellLevel] = useState<number>(1);
  const [castResult, setCastResult] = useState<SpellCastResult | null>(null);

  const handleSpellCast = () => {
    if (!selectedSpell) return;

    const castResult = SpellCastingSystem.castSpell({
      character,
      spell: selectedSpell,
      spellLevel
    });

    setCastResult(castResult);
  };

  return (
    <div className="spell-casting-interface p-6 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Spell Casting</h2>

      <div className="spell-selection mb-6">
        <label className="block mb-2 font-semibold">Select Prepared Spell</label>
        <select 
          value={selectedSpell?.id || ''}
          onChange={(e) => {
            const spell = preparedSpells.find(s => s.id === e.target.value);
            setSelectedSpell(spell || null);
          }}
          className="w-full p-2 border rounded"
        >
          <option value="">Choose a Spell</option>
          {preparedSpells.map(spell => (
            <option key={spell.id} value={spell.id}>
              {spell.name} (Level {spell.level})
            </option>
          ))}
        </select>
      </div>

      {selectedSpell && (
        <div className="spell-details mb-6">
          <h3 className="text-xl font-semibold mb-4">{selectedSpell.name}</h3>
          
          <div className="spell-level-selection mb-4">
            <label className="block mb-2 font-semibold">Spell Level</label>
            <select 
              value={spellLevel}
              onChange={(e) => setSpellLevel(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            >
              {[...Array(9)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Level {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="spell-description mb-4">
            <p className="text-gray-700">{selectedSpell.description}</p>
          </div>

          <button 
            onClick={handleSpellCast}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Cast Spell
          </button>
        </div>
      )}

      {castResult && (
        <div className="cast-result mt-6 p-4 bg-white rounded shadow">
          <h4 className="text-xl font-semibold mb-4">Casting Result</h4>
          
          {!castResult.success ? (
            <div className="text-red-600">
              <p>Spell Casting Failed</p>
              {castResult.errors?.map((error, index) => (
                <p key={index} className="text-sm">{error}</p>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-green-600">Spell Cast Successfully!</p>
              
              {castResult.damage && (
                <p>Damage Dealt: {castResult.damage}</p>
              )}
              
              {castResult.healing && (
                <p>Healing Provided: {castResult.healing}</p>
              )}
              
              {castResult.concentrationRequired && (
                <p className="text-yellow-600">
                  Concentration Spell: Maintain concentration to keep the effect
                </p>
              )}
              
              <div className="spell-effects mt-4">
                <h5 className="font-semibold">Spell Effects:</h5>
                {castResult.effects.map((effect, index) => (
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};
