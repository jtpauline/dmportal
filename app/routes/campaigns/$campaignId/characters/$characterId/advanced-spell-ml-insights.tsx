import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { SpellInteractionAdvancedMLPredictor } from '../../../../modules/utils/spell-interaction-ml-advanced-predictor';
import SpellInteractionAdvancedVisualization from '../../../../components/SpellInteractionAdvancedVisualization';

export const loader: LoaderFunction = async () => {
  // Mock data for demonstration
  const mockPrimarySpell = {
    name: 'Fireball',
    school: 'evocation',
    level: 3,
    tags: ['damage', 'aoe']
  };

  const mockSecondarySpell = {
    name: 'Mage Armor',
    school: 'abjuration',
    level: 1,
    tags: ['defense', 'buff']
  };

  const mockCharacter = {
    class: 'wizard',
    level: 5,
    abilityScores: { 
      intelligence: 16,
      wisdom: 12
    }
  };

  const mockContext = {
    terrain: 'dungeon',
    combatDifficulty: 'moderate',
    partyComposition: ['wizard', 'fighter', 'rogue']
  };

  // Predict spell interaction
  const spellInteractionPrediction = SpellInteractionAdvancedMLPredictor.predictSpellInteraction(
    mockPrimarySpell,
    mockSecondarySpell,
    mockCharacter,
    mockContext
  );

  return json({
    prediction: spellInteractionPrediction,
    primarySpellName: mockPrimarySpell.name,
    secondarySpellName: mockSecondarySpell.name
  });
};

export default function AdvancedSpellMLInsightsPage() {
  const { prediction, primarySpellName, secondarySpellName } = useLoaderData();

  return (
    <div className="advanced-spell-ml-insights-page p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Advanced Spell Interaction ML Insights</h1>
      
      <SpellInteractionAdvancedVisualization 
        prediction={prediction}
        primarySpellName={primarySpellName}
        secondarySpellName={secondarySpellName}
      />
    </div>
  );
}
