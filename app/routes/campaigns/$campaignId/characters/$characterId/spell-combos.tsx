import { useState } from 'react';
import { LoaderFunction, ActionFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { SpellComboInterface } from '~/components/SpellComboInterface';
import { SpellComboSystem } from '~/modules/utils/spell-combo-system';
import { Character } from '~/modules/characters';

export const loader: LoaderFunction = async ({ params }) => {
  // Fetch character details
  const character = await fetchCharacter(params.characterId);

  return json({ character });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get('_action');

  switch (action) {
    case 'execute-spell-combo':
      const comboId = formData.get('comboId') as string;
      const character = await fetchCharacter(formData.get('characterId') as string);
      
      const comboResult = SpellComboSystem.executeSpellCombo(
        character, 
        comboId
      );

      return json({ 
        success: comboResult.success, 
        comboResult 
      });
    default:
      return json({ success: false, error: 'Invalid action' });
  }
};

export default function SpellCombosPage() {
  const { character } = useLoaderData();
  const [comboExecutionResult, setComboExecutionResult] = useState<any>(null);

  const handleComboExecute = async (comboId: string) => {
    try {
      const response = await fetch(`/campaigns/${character.campaignId}/characters/${character.id}/spell-combos`, {
        method: 'POST',
        body: JSON.stringify({
          _action: 'execute-spell-combo',
          comboId,
          characterId: character.id
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setComboExecutionResult(result.comboResult);
      } else {
        // Handle execution failure
        console.error('Spell combo execution failed');
      }
    } catch (error) {
      console.error('Error executing spell combo:', error);
    }
  };

  return (
    <div className="spell-combos-page p-6">
      <h1 className="text-3xl font-bold mb-6">
        Spell Combos: {character.name}
      </h1>

      <SpellComboInterface 
        character={character}
        onComboExecute={handleComboExecute}
      />

      {comboExecutionResult && (
        <div className="combo-execution-result mt-6 p-4 bg-green-50 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Combo Execution Result
          </h2>
          
          <div className="result-details">
            <h3 className="text-xl font-bold mb-2">Combined Effects</h3>
            {comboExecutionResult.combinedEffects.map((effect, index) => (
              <div 
                key={index} 
                className="mb-2 p-2 bg-white rounded"
              >
                <strong>{effect.type}</strong>: {effect.value}
              </div>
            ))}

            <h3 className="text-xl font-bold mt-4 mb-2">Resource Cost</h3>
            <div className="bg-white p-2 rounded">
              <strong>Spell Slots Used:</strong>
              <pre>{JSON.stringify(comboExecutionResult.resourceCost.spellSlots, null, 2)}</pre>
              
              <strong>Material Components:</strong>
              <pre>{comboExecutionResult.resourceCost.materialComponents.join(', ')}</pre>
            </div>

            {comboExecutionResult.potentialRisks && (
              <div className="potential-risks mt-4">
                <h3 className="text-xl font-bold mb-2">Potential Risks</h3>
                {comboExecutionResult.potentialRisks.map((risk, index) => (
                  <div 
                    key={index} 
                    className="bg-yellow-100 p-2 rounded mb-2"
                  >
                    {risk}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Placeholder functions - replace with actual implementation
async function fetchCharacter(characterId: string): Promise<Character> {
  // Fetch character data
  return {} as Character;
}
