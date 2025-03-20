import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { SpellInteractionVisualizer } from '~/modules/utils/spell-interaction-visualization';
import { SpellInteractionComplexityDisplay } from '~/components/SpellInteractionComplexityDisplay';
import { SpellInteractionVisualizationCard } from '~/components/SpellInteractionVisualizationCard';
import { getCharacterSpells } from '~/modules/characters';
import { getEnvironmentalContext } from '~/modules/utils/environmental-context-analyzer';

export const loader: LoaderFunction = async ({ params }) => {
  const { characterId, campaignId } = params;
  
  // Fetch character's spells
  const characterSpells = await getCharacterSpells(characterId);
  
  // Get environmental context
  const environmentalContext = await getEnvironmentalContext(campaignId);

  // Generate spell interaction data for top spell combinations
  const spellInteractions = characterSpells.slice(0, 5).flatMap((primarySpell, index) => 
    characterSpells.slice(index + 1).map(secondarySpell => ({
      primarySpell,
      secondarySpell,
      visualizationData: SpellInteractionVisualizer.generateVisualizationData(
        primarySpell, 
        secondarySpell, 
        { id: characterId }, // Simplified character object
        environmentalContext
      )
    }))
  );

  return json({
    spellInteractions,
    characterId,
    campaignId
  });
};

export default function SpellInteractionComplexityPage() {
  const { spellInteractions } = useLoaderData();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Spell Interaction Complexity Analysis</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {spellInteractions.map(({ primarySpell, secondarySpell, visualizationData }, index) => (
          <div key={index} className="space-y-2">
            <SpellInteractionComplexityDisplay 
              primarySpell={primarySpell}
              secondarySpell={secondarySpell}
            />
            <SpellInteractionVisualizationCard 
              visualizationData={visualizationData}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
