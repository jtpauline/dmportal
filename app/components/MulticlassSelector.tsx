import React, { useState, useMemo } from 'react';
import { Character, CharacterClass } from '~/modules/characters';
import { MulticlassSystem } from '~/modules/utils/multiclass-system';
import { CharacterValidationSystem } from '~/modules/utils/character-validation';

interface MulticlassSelectorProps {
  character: Character;
  onMulticlassSelect: (newClass: CharacterClass) => void;
}

export const MulticlassSelector: React.FC<MulticlassSelectorProps> = ({ 
  character, 
  onMulticlassSelect 
}) => {
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const availableClasses: CharacterClass[] = useMemo(() => [
    'Fighter', 'Wizard', 'Rogue', 'Cleric', 
    'Barbarian', 'Ranger', 'Paladin', 'Druid', 
    'Monk', 'Warlock', 'Sorcerer', 'Bard'
  ].filter(cls => cls !== character.class), [character.class]);

  const handleClassSelection = (cls: CharacterClass) => {
    const validationResult = MulticlassSystem.validateMulticlassing(character, cls);
    
    if (validationResult.isEligible) {
      setSelectedClass(cls);
      setValidationErrors([]);
      onMulticlassSelect(cls);
    } else {
      setSelectedClass(null);
      setValidationErrors(validationResult.errors);
    }
  };

  return (
    <div className="multiclass-selector">
      <h3 className="text-xl font-bold mb-4">Multiclass Selection</h3>
      
      {validationErrors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {validationErrors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {availableClasses.map(cls => (
          <button
            key={cls}
            onClick={() => handleClassSelection(cls)}
            className={`
              px-4 py-2 rounded transition-all duration-200
              ${selectedClass === cls 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
              }
            `}
          >
            {cls}
          </button>
        ))}
      </div>
    </div>
  );
};
