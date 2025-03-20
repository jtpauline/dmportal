import React, { useState, useMemo } from 'react';
import { Character } from '~/modules/characters';
import { SpellSynergy, SpellSynergySystem } from '~/modules/utils/spell-synergy-system';
import { Spell } from '~/modules/utils/spell-system';

interface SpellSynergyInterfaceProps {
  character: Character;
  onSynergyExecute: (synergyId: string) => void;
}

export const SpellSynergyInterface: React.FC<SpellSynergyInterfaceProps> = ({
  character,
  onSynergyExecute
}) => {
  const [selectedSpells, setSelectedSpells] = useState<Spell[]>([]);
  const [dynamicSynergy, setDynamicSynergy] = useState<SpellSynergy | null>(null);

  // Discover predefined spell synergies
  const availableSynergies = useMemo(() => 
    SpellSynergySystem.discoverSpellSynergies(character),
    [character]
  );

  // Handle spell selection for dynamic synergy
  const handleSpellSelect = (spell: Spell) => {
    const updatedSpells = selectedSpells.includes(spell)
      ? selectedSpells.filter(s => s !== spell)
      : [...selectedSpells, spell].slice(0, 4); // Limit to 4 spells

    setSelectedSpells(updatedSpells);

    // Generate dynamic synergy when 2+ spells are selected
    if (updatedSpells.length >= 2) {
      const generatedSynergy = SpellSynergySystem.generateDynamicSynergy(
        character, 
        updatedSpells
      );
      setDynamicSynergy(generatedSynergy);
    } else {
      setDynamicSynergy(null);
    }
  };

  const handleSynergyExecute = (synergyId: string) => {
    onSynergyExecute(synergyId);
    // Reset selection after execution
    setSelectedSpells([]);
    setDynamicSynergy(null);
  };

  return (
    <div className="spell-synergy-interface p-6 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">
        Spell Synergy Workshop
      </h2>

      <div className="spell-selection mb-6">
        <h3 className="text-xl font-semibold mb-4">
          Select Spells for Synergy (2-4 spells)
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {character.spells?.map(spell => (
            <div 
              key={spell.id}
              className={`p-3 border rounded-lg cursor-pointer ${
                selectedSpells.includes(spell) 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white hover:bg-blue-100'
              }`}
              onClick={() => handleSpellSelect(spell)}
            >
              <h4 className="font-bold">{spell.name}</h4>
              <p className="text-xs">{spell.school} | Level {spell.level}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="predefined-synergies mb-6">
        <h3 className="text-xl font-semibold mb-4">
          Predefined Synergies
        </h3>
        {availableSynergies.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {availableSynergies.map(synergy => (
              <div 
                key={synergy.id}
                className="p-4 border rounded-lg bg-white"
              >
                <h4 className="font-bold text-lg mb-2">{synergy.name}</h4>
                <p className="text-sm mb-2">{synergy.description}</p>
                <div className="text-xs">
                  <strong>Type:</strong> {synergy.type}
                  <br />
                  <strong>Complexity:</strong> {synergy.complexity}
                </div>
                <button
                  onClick={() => handleSynergyExecute(synergy.id)}
                  className="mt-2 w-full bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Execute Synergy
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No predefined spell synergies available.
          </p>
        )}
      </div>

      {dynamicSynergy && (
        <div className="dynamic-synergy mt-6 p-4 bg-yellow-50 rounded-lg">
          <h3 className="text-xl font-bold mb-4">
            Dynamic Spell Synergy
          </h3>
          <div className="synergy-details">
            <h4 className="font-semibold">{dynamicSynergy.name}</h4>
            <p className="text-sm mb-2">{dynamicSynergy.description}</p>
            <div className="text-xs mb-2">
              <strong>Type:</strong> {dynamicSynergy.type}
              <br />
              <strong>Complexity:</strong> {dynamicSynergy.complexity}
            </div>
            <button
              onClick={() => handleSynergyExecute(dynamicSynergy.id)}
              className="mt-2 w-full bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
            >
              Execute Dynamic Synergy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
