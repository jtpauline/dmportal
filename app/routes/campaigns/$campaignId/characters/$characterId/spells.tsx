import { useState } from 'react';
import { LoaderFunction, ActionFunction, json } from '@remix-run/node';
import { useLoaderData, Form } from '@remix-run/react';
import { SpellManagementInterface } from '~/components/SpellManagementInterface';
import { getCharacterById, updateCharacter } from '~/modules/campaign-storage';
import { Spell } from '~/modules/utils/spell-system';

export const loader: LoaderFunction = async ({ params }) => {
  const character = await getCharacterById(params.characterId);
  return json({ character });
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const spellData = formData.get('spells');
  const characterId = params.characterId;

  try {
    const character = await getCharacterById(characterId);
    
    // Parse and validate spell data
    const selectedSpells = spellData ? JSON.parse(spellData.toString()) : [];

    // Update character's spell list
    character.spells = selectedSpells;

    await updateCharacter(characterId, character);
    return json({ success: true, character });
  } catch (error) {
    return json({ 
      success: false, 
      errors: [error.message] 
    }, { status: 500 });
  }
};

export default function SpellManagementPage() {
  const { character } = useLoaderData();
  const [selectedSpells, setSelectedSpells] = useState<Spell[]>([]);

  const handleSpellSelect = (spell: Spell) => {
    setSelectedSpells(prev => [...prev, spell]);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Spell Management</h2>
      
      <SpellManagementInterface 
        character={character} 
        onSpellSelect={handleSpellSelect} 
      />

      {selectedSpells.length > 0 && (
        <Form method="post" className="mt-6">
          <input 
            type="hidden" 
            name="spells" 
            value={JSON.stringify(selectedSpells)} 
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Save Selected Spells
          </button>
        </Form>
      )}
    </div>
  );
}
