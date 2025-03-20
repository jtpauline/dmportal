import React, { useState, useMemo } from 'react';
import { Character } from '~/modules/characters';
import { SpellCombo, SpellComboSystem } from '~/modules/utils/spell-combo-system';

interface SpellComboInterfaceProps {
  character: Character;
  onComboExecute: (comboId: string) => void;
}

export const SpellComboInterface: React.FC<SpellComboInterfaceProps> = ({
  character,
  onComboExecute
}) => {
  const [selectedCombo, setSelectedCombo] = useState<string | null>(null);

  // Analyze available combos
  const availableCombos = useMemo(() => 
    SpellComboSystem.analyzeAvailableCombos(character),
    [character]
  );

  // Generate combo suggestions
  const comboSuggestions = useMemo(() => 
    SpellComboSystem.generateComboSuggestions(character),
    [character]
  );

  const handleComboSelect = (comboId: string) => {
    setSelectedCombo(comboId);
  };

  const handleExecuteCombo = () => {
    if (selectedCombo) {
      onComboExecute(selectedCombo);
    }
  };

  return (
    <div className="spell-combo-interface p-6 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">
        Spell Combo Opportunities
      </h2>

      <div className="available-combos mb-6">
        <h3 className="text-xl font-semibold mb-4">
          Available Combos
        </h3>
        {availableCombos.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {availableCombos.map(combo => (
              <div 
                key={combo.id}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedCombo === combo.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white hover:bg-blue-100'
                }`}
                onClick={() => handleComboSelect(combo.id)}
              >
                <h4 className="font-bold text-lg mb-2">{combo.name}</h4>
                <p className="text-sm mb-2">{combo.description}</p>
                <div className="text-xs">
                  <strong>Required Level:</strong> {combo.requiredLevel}
                  <br />
                  <strong>Compatible Classes:</strong> {combo.compatibleClasses.join(', ')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No spell combos currently available.
          </p>
        )}
      </div>

      <div className="combo-suggestions mb-6">
        <h3 className="text-xl font-semibold mb-4">
          Combo Suggestions
        </h3>
        {comboSuggestions.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {comboSuggestions.map(combo => (
              <div 
                key={combo.id}
                className="p-4 border rounded-lg bg-yellow-50"
              >
                <h4 className="font-bold text-lg mb-2">{combo.name}</h4>
                <p className="text-sm mb-2">{combo.description}</p>
                <div className="text-xs">
                  <strong>Progress:</strong> {
                    combo.spells.filter(
                      spellId => character.spells?.some(spell => spell.id === spellId)
                    ).length
                  } / {combo.spells.length} spells
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No combo suggestions at the moment.
          </p>
        )}
      </div>

      <div className="combo-execution">
        <button
          onClick={handleExecuteCombo}
          disabled={!selectedCombo}
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Execute Selected Combo
        </button>
      </div>
    </div>
  );
};
