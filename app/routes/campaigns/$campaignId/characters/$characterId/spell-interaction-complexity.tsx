import React, { useState } from 'react';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { SpellInteractionComplexityDisplay } from '~/app/components/SpellInteractionComplexityDisplay';

export const loader = async ({ params }) => {
  // Mock data - in real implementation, fetch from actual character data
  const character = {
    name: 'Aria Stormwind',
    class: 'Wizard',
    level: 5,
    abilityScores: {
      intelligence: 16
    }
  };

  // Mock available spells
  const availableSpells = [
    { 
      id: 'fireball',
      name: 'Fireball', 
      level: 3, 
      school: 'Evocation', 
      tags: ['damage', 'offensive'] 
    },
    { 
      id: 'misty-step',
      name: 'Misty Step', 
      level: 2, 
      school: 'Conjuration', 
      tags: ['utility', 'movement'] 
    },
    { 
      id: 'shield',
      name: 'Shield', 
      level: 1, 
      school: 'Abjuration', 
      tags: ['defense', 'protection'] 
    },
    { 
      id: 'magic-missile',
      name: 'Magic Missile', 
      level: 1, 
      school: 'Evocation', 
      tags: ['damage', 'offensive'] 
    },
    { 
      id: 'detect-magic',
      name: 'Detect Magic', 
      level: 1, 
      school: 'Divination', 
      tags: ['utility', 'information'] 
    }
  ];

  return json({
    character,
    availableSpells
  });
};

export default function SpellInteractionComplexityPage() {
  const { character, availableSpells } = useLoaderData<typeof loader>();
  const [primarySpell, setPrimarySpell] = useState<any>(null);
  const [secondarySpell, setSecondarySpell] = useState<any>(null);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{character.name}'s Spell Interaction Complexity</h1>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Primary Spell</h3>
          <select 
            value={primarySpell?.id || ''}
            onChange={(e) => {
              const selected = availableSpells.find(
                spell => spell.id === e.target.value
              );
              setPrimarySpell(selected || null);
            }}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="">Select Primary Spell</option>
            {availableSpells.map(spell => (
              <option key={spell.id} value={spell.id}>
                {spell.name} (Level {spell.level} {spell.school})
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Secondary Spell (Optional)</h3>
          <select 
            value={secondarySpell?.id || ''}
            onChange={(e) => {
              const selected = availableSpells.find(
                spell => spell.id === e.target.value
              );
              setSecondarySpell(selected || null);
            }}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="">Select Secondary Spell (Optional)</option>
            {availableSpells.map(spell => (
              <option key={spell.id} value={spell.id}>
                {spell.name} (Level {spell.level} {spell.school})
              </option>
            ))}
          </select>
        </div>
      </div>

      {primarySpell && (
        <div className="mt-6">
          <SpellInteractionComplexityDisplay
            primarySpell={primarySpell}
            secondarySpell={secondarySpell || undefined}
            character={character}
          />
        </div>
      )}
    </div>
  );
}
