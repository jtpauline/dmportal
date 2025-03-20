import { useState } from 'react';
import { LoaderFunction, ActionFunction, json } from '@remix-run/node';
import { useLoaderData, Form } from '@remix-run/react';
import { SpellPreparationModal } from '~/components/SpellPreparationModal';
import { SpellPreparationSystem } from '~/modules/utils/spell-preparation-system';
import { Character } from '~/modules/characters';
import { Spell } from '~/modules/utils/spell-system';

export const loader: LoaderFunction = async ({ params }) => {
  // Fetch character and available spells
  const character = await fetchCharacter(params.characterId);
  const availableSpells = await fetchAvailableSpells(character);

  return json({ character, availableSpells });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get('_action');

  switch (action) {
    case 'prepare-spells':
      const preparedSpells = JSON.parse(formData.get('preparedSpells') as string);
      const updatedCharacter = await updateCharacterSpells(preparedSpells);
      return json({ success: true, character: updatedCharacter });
    default:
      return json({ success: false, error: 'Invalid action' });
  }
};

export default function SpellPreparationPage() {
  const { character, availableSpells } = useLoaderData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSpellsPrepared = async (updatedCharacter: Character) => {
    // Submit prepared spells to server
    const response = await fetch('/campaigns/${campaignId}/characters/${characterId}/spell-preparation', {
      method: 'POST',
      body: JSON.stringify({
        _action: 'prepare-spells',
        preparedSpells: updatedCharacter.preparedSpells
      })
    });

    if (response.ok) {
      // Update character state or trigger refresh
      // Potentially use a state management solution or Remix's data revalidation
    }
  };

  return (
    <div className="spell-preparation-page p-6">
      <h1 className="text-3xl font-bold mb-6">
        Spell Preparation: {character.name}
      </h1>

      <div className="spell-preparation-summary mb-4">
        <p>
          Max Preparable Spells: {SpellPreparationSystem.calculateMaxPreparedSpells(character)}
        </p>
        <p>
          Current Prepared Spells: {character.preparedSpells?.filter(slot => slot.prepared).length || 0}
        </p>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Prepare Spells
      </button>

      {isModalOpen && (
        <SpellPreparationModal
          character={character}
          availableSpells={availableSpells}
          onSpellsPrepared={handleSpellsPrepared}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Prepared Spells List */}
      <div className="prepared-spells-list mt-6">
        <h2 className="text-2xl font-semibold mb-4">Currently Prepared Spells</h2>
        {character.preparedSpells?.filter(slot => slot.prepared).map(slot => (
          <div 
            key={slot.spell?.id} 
            className="bg-gray-100 p-3 rounded mb-2"
          >
            <div className="font-bold">{slot.spell?.name}</div>
            <div className="text-sm">{slot.spell?.school} Spell</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Placeholder functions - replace with actual implementation
async function fetchCharacter(characterId: string): Promise<Character> {
  // Fetch character data
  return {} as Character;
}

async function fetchAvailableSpells(character: Character): Promise<Spell[]> {
  // Fetch available spells for the character's class
  return [];
}

async function updateCharacterSpells(preparedSpells: any): Promise<Character> {
  // Update character's prepared spells
  return {} as Character;
}
