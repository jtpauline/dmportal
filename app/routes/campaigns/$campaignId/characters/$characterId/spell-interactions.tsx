import React from 'react';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { SpellInteractionInterface } from '~/app/components/SpellInteractionAnalyzer';

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

export default function SpellInteractionsPage() {
  const { character, availableSpells } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{character.name}'s Spell Interactions</h1>
      
      <SpellInteractionInterface 
        availableSpells={availableSpells}
        character={character}
      />
    </div>
  );
}
