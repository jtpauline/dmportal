import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { SpellInteractionInsightsDisplay } from '~/components/SpellInteractionInsightsDisplay';
import { getCharacterSpells } from '~/modules/characters';
import { getSpellById } from '~/modules/spells';

export const loader: LoaderFunction = async ({ params }) => {
  const { characterId, campaignId } = params;
  
  // Fetch character's spells
  const characterSpells = await getCharacterSpells(characterId);
  
  // You might want to implement more sophisticated spell selection logic
  const primarySpell = characterSpells[0];
  const secondarySpell = characterSpells[1];
  
  return json({
    primarySpell: await getSpellById(primarySpell.id),
    secondarySpell: await getSpellById(secondarySpell.id),
    campaignId,
    characterId
  });
};

export default function SpellInteractionInsightsPage() {
  const { primarySpell, secondarySpell, campaignId, characterId } = useLoaderData();
  
  // Mock environmental context (in a real app, this would be dynamic)
  const mockContext = {
    terrain: 'forest',
    combatDifficulty: 'medium'
  };
  
  // Mock character (in a real app, fetch from database)
  const mockCharacter = {
    id: characterId,
    name: 'Sample Character',
    class: 'wizard',
    level: 5
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Spell Interaction Insights for {mockCharacter.name}
      </h1>
      
      <SpellInteractionInsightsDisplay
        primarySpell={primarySpell}
        secondarySpell={secondarySpell}
        character={mockCharacter}
        context={mockContext}
      />
    </div>
  );
}
