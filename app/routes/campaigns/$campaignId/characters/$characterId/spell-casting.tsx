import { useState } from 'react';
import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { SpellCastingInterface } from '~/components/SpellCastingInterface';
import { getCharacterById } from '~/modules/campaign-storage';
import { SpellSystem } from '~/modules/utils/spell-system';

export const loader: LoaderFunction = async ({ params }) => {
  const character = await getCharacterById(params.characterId);
  
  // Get prepared spells for the character
  const preparedSpells = character.preparedSpells
    ?.filter(slot => slot.prepared)
    .map(slot => slot.spell) || [];
  
  return json({ 
    character,
    preparedSpells
  });
};

export default function SpellCastingPage() {
  const { character, preparedSpells } = useLoaderData();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Spell Casting</h2>
      
      <SpellCastingInterface 
        character={character}
        preparedSpells={preparedSpells}
      />
    </div>
  );
}
