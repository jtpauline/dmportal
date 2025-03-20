import { useState } from 'react';
import { LoaderFunction, ActionFunction, json } from '@remix-run/node';
import { useLoaderData, Form } from '@remix-run/react';
import { MulticlassSelector } from '~/components/MulticlassSelector';
import { CharacterProgressionSystem } from '~/modules/utils/character-progression';
import { getCharacterById, updateCharacter } from '~/modules/campaign-storage';

export const loader: LoaderFunction = async ({ params }) => {
  const character = await getCharacterById(params.characterId);
  return json({ character });
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const newClass = formData.get('newClass') as string;
  const characterId = params.characterId;

  try {
    const character = await getCharacterById(characterId);
    const multiclassResult = CharacterProgressionSystem.handleMulticlassing(
      character, 
      newClass
    );

    if (multiclassResult.success) {
      await updateCharacter(characterId, multiclassResult.character);
      return json({ success: true, character: multiclassResult.character });
    } else {
      return json({ 
        success: false, 
        errors: multiclassResult.errors 
      }, { status: 400 });
    }
  } catch (error) {
    return json({ 
      success: false, 
      errors: [error.message] 
    }, { status: 500 });
  }
};

export default function MulticlassPage() {
  const { character } = useLoaderData();
  const [selectedClass, setSelectedClass] = useState(null);

  const handleMulticlassSelect = (newClass) => {
    setSelectedClass(newClass);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Multiclass Your Character</h2>
      
      <MulticlassSelector 
        character={character} 
        onMulticlassSelect={handleMulticlassSelect} 
      />

      {selectedClass && (
        <Form method="post" className="mt-6">
          <input 
            type="hidden" 
            name="newClass" 
            value={selectedClass} 
          />
          <button 
            type="submit" 
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Confirm Multiclass to {selectedClass}
          </button>
        </Form>
      )}
    </div>
  );
}
