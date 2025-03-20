import React, { useState, useMemo } from 'react';
import { Character } from '~/modules/characters';
import { Spell } from '~/modules/utils/spell-system';
import { SpellPreparationSystem } from '~/modules/utils/spell-preparation-system';

interface SpellPreparationModalProps {
  character: Character;
  availableSpells: Spell[];
  onSpellsPrepared: (preparedCharacter: Character) => void;
  onClose: () => void;
}

export const SpellPreparationModal: React.FC<SpellPreparationModalProps> = ({
  character,
  availableSpells,
  onSpellsPrepared,
  onClose
}) => {
  const [selectedSpells, setSelectedSpells] = useState<Spell[]>([]);
  const maxPreparedSpells = useMemo(() => 
    SpellPreparationSystem.calculateMaxPreparedSpells(character), 
    [character]
  );

  const handleSpellSelection = (spell: Spell) => {
    setSelectedSpells(current => {
      // Prevent duplicates
      if (current.some(s => s.id === spell.id)) {
        return current.filter(s => s.id !== spell.id);
      }
      
      // Enforce max prepared spells limit
      if (current.length < maxPreparedSpells) {
        return [...current, spell];
      }
      
      return current;
    });
  };

  const handlePrepareSspells = () => {
    try {
      const updatedCharacter = SpellPreparationSystem.prepareSpells(
        character, 
        selectedSpells
      );
      onSpellsPrepared(updatedCharacter);
      onClose();
    } catch (error) {
      // Handle preparation errors
      console.error('Spell Preparation Error:', error);
    }
  };

  // Filter spells by character's class
  const classSpells = useMemo(() => 
    availableSpells.filter(spell => 
      spell.classes.includes(character.class)
    ), 
    [availableSpells, character.class]
  );

  // Group spells by level
  const spellsByLevel = useMemo(() => {
    return classSpells.reduce((acc, spell) => {
      if (!acc[spell.level]) acc[spell.level] = [];
      acc[spell.level].push(spell);
      return acc;
    }, {} as Record<number, Spell[]>);
  }, [classSpells]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          Prepare Spells for {character.name}
        </h2>
        
        <div className="mb-4">
          <p className="font-semibold">
            Spells Prepared: {selectedSpells.length} / {maxPreparedSpells}
          </p>
        </div>

        {Object.entries(spellsByLevel).map(([level, spells]) => (
          <div key={level} className="mb-6">
            <h3 className="text-xl font-semibold mb-2">
              Level {level} Spells
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {spells.map(spell => (
                <button
                  key={spell.id}
                  onClick={() => handleSpellSelection(spell)}
                  className={`p-2 border rounded text-left ${
                    selectedSpells.some(s => s.id === spell.id)
                      ? 'bg-blue-500 text-white'
                      : 'bg-white hover:bg-blue-100'
                  } ${
                    selectedSpells.length >= maxPreparedSpells &&
                    !selectedSpells.some(s => s.id === spell.id)
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                  disabled={
                    selectedSpells.length >= maxPreparedSpells &&
                    !selectedSpells.some(s => s.id === spell.id)
                  }
                >
                  <div className="font-bold">{spell.name}</div>
                  <div className="text-sm">{spell.school} Spell</div>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handlePrepareSspells}
            disabled={selectedSpells.length === 0}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            Prepare Spells
          </button>
        </div>
      </div>
    </div>
  );
};
