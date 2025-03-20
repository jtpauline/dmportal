import { useState } from 'react';
import { 
  MagicItemSystem, 
  MagicItem 
} from '~/modules/utils/magic-item-system';
import { 
  CharacterExportSystem 
} from '~/modules/utils/character-export';
import { 
  SpellCastingInterface 
} from '~/components/SpellCastingInterface';

// Mock character for demonstration
const mockCharacter = {
  id: 'demo-character-1',
  name: 'Eldrin Stormweaver',
  race: 'High Elf',
  class: 'Wizard',
  level: 5,
  inventory: [],
  skills: {},
  specialAbilities: []
};

export default function Dashboard() {
  const [magicItems, setMagicItems] = useState<MagicItem[]>([]);
  const [exportedCharacter, setExportedCharacter] = useState<string | null>(null);

  const generateMagicItems = () => {
    const rarities: MagicItem['rarity'][] = ['Common', 'Uncommon', 'Rare'];
    const newItems = rarities
      .map(rarity => MagicItemSystem.generateMagicItemForCharacter(mockCharacter, rarity))
      .filter(Boolean) as MagicItem[];
    
    setMagicItems(newItems);
  };

  const exportCharacter = () => {
    const result = CharacterExportSystem.exportCharacter(mockCharacter);
    if (result.success && result.data) {
      setExportedCharacter(result.data as unknown as string);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">
        DMPortal Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Magic Item Generator</h2>
          <button 
            onClick={generateMagicItems}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Generate Magic Items
          </button>
          {magicItems.length > 0 && (
            <div>
              <h3 className="text-xl mb-2">Generated Items:</h3>
              {magicItems.map(item => (
                <div key={item.id} className="bg-gray-700 p-3 rounded mb-2">
                  <p>{item.name} (Rarity: {item.rarity})</p>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Character Export</h2>
          <button 
            onClick={exportCharacter}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Export Character
          </button>
          {exportedCharacter && (
            <div>
              <h3 className="text-xl mb-2">Exported Data:</h3>
              <pre className="bg-gray-700 p-3 rounded text-xs overflow-x-auto">
                {exportedCharacter}
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Spell Casting Interface</h2>
        <SpellCastingInterface 
          character={mockCharacter} 
          preparedSpells={[]} 
        />
      </div>
    </div>
  );
}
