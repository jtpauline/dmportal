import { useState } from 'react';
import { LoaderFunction, ActionFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { SpellSynergyInterface } from '~/components/SpellSynergyInterface';
import { SpellSynergySystem } from '~/modules/utils/spell-synergy-system';
import { MockDataGenerator } from '~/modules/utils/mock-data-generator';
import { Character } from '~/modules/characters';

export const loader: LoaderFunction = async ({ params }) => {
  // Generate mock character with consistent ID
  const character = MockDataGenerator.generateMockCharacter({
    id: params.characterId,
    name: `Character ${params.characterId}`
  });

  return json({ character });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get('_action');

  switch (action) {
    case 'execute-spell-synergy':
      const synergyId = formData.get('synergyId') as string;
      const character = MockDataGenerator.generateMockCharacter();
      
      const synergyResult = SpellSynergySystem.generateAdvancedDynamicSynergy(
        character, 
        character.spells || []
      );

      return json({ 
        success: true, 
        synergyResult 
      });
    default:
      return json({ success: false, error: 'Invalid action' });
  }
};

export default function SpellSynergiesPage() {
  const { character } = useLoaderData<{ character: Character }>();
  const [synergyExecutionResult, setSynergyExecutionResult] = useState<any>(null);

  const handleSynergyExecute = async (synergyId: string) => {
    try {
      const response = await fetch(`/campaigns/${character.campaignId}/characters/${character.id}/spell-synergies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          _action: 'execute-spell-synergy',
          synergyId,
          characterId: character.id
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setSynergyExecutionResult(result.synergyResult);
      } else {
        console.error('Spell synergy execution failed');
      }
    } catch (error) {
      console.error('Error executing spell synergy:', error);
    }
  };

  return (
    <div className="spell-synergies-page p-6">
      <h1 className="text-3xl font-bold mb-6">
        Spell Synergies: {character.name}
      </h1>

      <SpellSynergyInterface 
        character={character}
        onSynergyExecute={handleSynergyExecute}
      />

      {synergyExecutionResult && (
        <div className="synergy-execution-result mt-6 p-4 bg-green-50 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Synergy Execution Result
          </h2>
          
          <div className="result-details">
            <h3 className="text-xl font-bold mb-2">Synergy Details</h3>
            <div className="bg-white p-3 rounded mb-4">
              <strong>Name:</strong> {synergyExecutionResult.name}
              <br />
              <strong>Type:</strong> {synergyExecutionResult.type}
              <br />
              <strong>Complexity:</strong> {synergyExecutionResult.complexity}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
