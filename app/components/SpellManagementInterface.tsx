import React, { useState, useMemo } from 'react';
import { Character } from '~/modules/characters';
import { Spell, SpellSystem } from '~/modules/utils/spell-system';

interface SpellManagementProps {
  character: Character;
  onSpellSelect: (spell: Spell) => void;
}

export const SpellManagementInterface: React.FC<SpellManagementProps> = ({ 
  character, 
  onSpellSelect 
}) => {
  const [selectedSpells, setSelectedSpells] = useState<Spell[]>([]);
  const [availableSpells, setAvailableSpells] = useState<Spell[]>([]);
  const [selectedSpellLevel, setSelectedSpellLevel] = useState<number | null>(null);
  const [spellValidationErrors, setSpellValidationErrors] = useState<Record<string, string[]>>({});

  // Initialize available spells on component mount
  React.useEffect(() => {
    if (SpellSystem.isSpellcaster(character.class)) {
      const spells = SpellSystem.getAvailableSpells(character);
      setAvailableSpells(spells);
    }
  }, [character]);

  const handleSpellSelect = (spell: Spell) => {
    // Validate spell requirements
    const validationResult = SpellSystem.validateSpellRequirements(character, spell);
    
    if (validationResult.isEligible) {
      // Prevent duplicate spell selection
      if (!selectedSpells.find(s => s.id === spell.id)) {
        const newSelectedSpells = [...selectedSpells, spell];
        setSelectedSpells(newSelectedSpells);
        onSpellSelect(spell);
        
        // Clear any previous errors for this spell
        const newValidationErrors = { ...spellValidationErrors };
        delete newValidationErrors[spell.id];
        setSpellValidationErrors(newValidationErrors);
      }
    } else {
      // Store validation errors
      setSpellValidationErrors(prev => ({
        ...prev,
        [spell.id]: validationResult.errors
      }));
    }
  };

  const removeSpell = (spellId: string) => {
    const updatedSpells = selectedSpells.filter(spell => spell.id !== spellId);
    setSelectedSpells(updatedSpells);
    
    // Remove any associated validation errors
    const newValidationErrors = { ...spellValidationErrors };
    delete newValidationErrors[spellId];
    setSpellValidationErrors(newValidationErrors);
  };

  // Spell slot information
  const spellSlots = useMemo(() => 
    SpellSystem.calculateSpellSlots(character), 
    [character]
  );

  // Filtered spells by level
  const filteredSpells = useMemo(() => {
    return availableSpells.filter(spell => 
      selectedSpellLevel === null || spell.level === selectedSpellLevel
    );
  }, [availableSpells, selectedSpellLevel]);

  if (!SpellSystem.isSpellcaster(character.class)) {
    return <div>This character cannot cast spells.</div>;
  }

  return (
    <div className="spell-management-interface p-6 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Spell Management</h2>

      <div className="spell-slots mb-6">
        <h3 className="text-xl font-semibold mb-4">Spell Slots</h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(spellSlots).map(([level, slots]) => (
            <div 
              key={level} 
              className="bg-white p-4 rounded shadow"
            >
              <p className="font-bold">Level {level} Spells</p>
              <p>Slots: {slots}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="spell-level-filter mb-4">
        <label className="block mb-2 font-semibold">Filter Spell Level</label>
        <select 
          value={selectedSpellLevel || ''} 
          onChange={(e) => setSelectedSpellLevel(
            e.target.value ? parseInt(e.target.value) : null
          )}
          className="w-full p-2 border rounded"
        >
          <option value="">All Spell Levels</option>
          {Object.keys(spellSlots).map(level => (
            <option key={level} value={level}>
              Level {level} Spells
            </option>
          ))}
        </select>
      </div>

      <div className="spell-selection grid grid-cols-2 gap-6">
        <div className="available-spells">
          <h3 className="text-xl font-semibold mb-4">Available Spells</h3>
          <div className="space-y-2">
            {filteredSpells.map(spell => (
              <div 
                key={spell.id}
                className="bg-white p-3 rounded shadow flex flex-col"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">{spell.name}</span>
                  <span className="text-sm text-gray-600">
                    Level {spell.level} {spell.school}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  {spell.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm">
                    {spell.concentration ? 'Concentration' : 'Instantaneous'}
                  </span>
                  <button 
                    onClick={() => handleSpellSelect(spell)}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Add Spell
                  </button>
                </div>
                
                {/* Spell Requirement Errors */}
                {spellValidationErrors[spell.id] && (
                  <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded">
                    {spellValidationErrors[spell.id].map((error, index) => (
                      <p key={index} className="text-xs">{error}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="selected-spells">
          <h3 className="text-xl font-semibold mb-4">Selected Spells</h3>
          <div className="space-y-2">
            {selectedSpells.map(spell => (
              <div 
                key={spell.id}
                className="bg-white p-3 rounded shadow flex justify-between items-center"
              >
                <div>
                  <span className="font-bold">{spell.name}</span>
                  <span className="ml-2 text-sm text-gray-600">
                    Level {spell.level} {spell.school}
                  </span>
                </div>
                <button 
                  onClick={() => removeSpell(spell.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
