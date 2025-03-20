import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { 
  SpellInteractionComplexityAnalyzer, 
  SpellInteractionComplexityMetrics 
} from '~/modules/utils/spell-interaction-complexity-analyzer';
import SpellInteractionComplexityDisplay from '~/components/SpellInteractionComplexityDisplay';
import { Spell } from '~/modules/spells';
import { Character } from '~/modules/characters';

export const loader: LoaderFunction = async ({ params }) => {
  // Placeholder for actual data fetching
  const character: Character = {
    id: params.characterId,
    name: 'Sample Character',
    class: 'Wizard',
    level: 10,
    intelligence: 18,
    wisdom: 16
  };

  const spells: Spell[] = [
    { 
      name: 'Fireball', 
      school: 'Evocation', 
      level: 3, 
      type: 'Damage' 
    },
    { 
      name: 'Shield', 
      school: 'Abjuration', 
      level: 1, 
      type: 'Protection' 
    },
    { 
      name: 'Haste', 
      school: 'Transmutation', 
      level: 3, 
      type: 'Buff' 
    }
  ];

  const complexityMetrics = SpellInteractionComplexityAnalyzer.analyzeSpellInteractionComplexity(
    spells, 
    {
      character,
      environment: 'Dungeon',
      combatDifficulty: 0.7
    }
  );

  return json({ 
    complexityMetrics,
    spells,
    character
  });
};

export default function SpellInteractionComplexityPage() {
  const { complexityMetrics, spells, character } = useLoaderData<{
    complexityMetrics: SpellInteractionComplexityMetrics,
    spells: Spell[],
    character: Character
  }>();

  return (
    <div className="spell-interaction-complexity-page">
      <h1 className="text-2xl font-bold mb-4">
        Spell Interaction Complexity for {character.name}
      </h1>

      <div className="spell-list mb-4">
        <h2 className="text-xl font-semibold">Selected Spells:</h2>
        <ul className="list-disc pl-5">
          {spells.map(spell => (
            <li key={spell.name}>
              {spell.name} (Level {spell.level}, {spell.school} School)
            </li>
          ))}
        </ul>
      </div>

      <SpellInteractionComplexityDisplay 
        complexityMetrics={complexityMetrics} 
      />
    </div>
  );
}
