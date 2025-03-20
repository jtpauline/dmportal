import React, { useState } from 'react';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Card } from '~/app/components/ui/Modal';
import { SpellSynergySystem } from '~/app/modules/utils/spell-synergy-system';
import { SpellCastingSystem } from '~/app/modules/utils/spell-casting-system';

export const loader = async ({ params }) => {
  // Mock data - in real implementation, fetch from actual character data
  const character = {
    name: 'Aria Stormwind',
    class: 'Wizard',
    level: 5,
    spells: [
      { name: 'Fireball', level: 3, school: 'Evocation' },
      { name: 'Misty Step', level: 2, school: 'Conjuration' },
      { name: 'Shield', level: 1, school: 'Abjuration' }
    ]
  };

  // Analyze spell synergies
  const spellSynergies = SpellSynergySystem.analyzeSpellSynergies(character.spells);

  // Calculate spell casting capabilities
  const spellCastingAnalysis = SpellCastingSystem.analyzeSpellCastingCapabilities(character);

  return json({
    character,
    spellSynergies,
    spellCastingAnalysis
  });
};

export default function SpellsPage() {
  const { 
    character, 
    spellSynergies,
    spellCastingAnalysis 
  } = useLoaderData<typeof loader>();

  const [selectedSpell, setSelectedSpell] = useState(null);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{character.name}'s Spellbook</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Spell List</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {character.spells.map((spell, index) => (
              <div 
                key={index} 
                className={`p-3 border rounded-lg cursor-pointer ${
                  selectedSpell === spell 
                    ? 'bg-blue-100 border-blue-500' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedSpell(spell)}
              >
                <p className="font-semibold">{spell.name}</p>
                <p className="text-sm text-gray-600">
                  Level {spell.level} {spell.school}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Spell Details</h2>
          
          {selectedSpell ? (
            <div className="space-y-4">
              <h3 className="font-bold">{selectedSpell.name} Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Spell Level</p>
                  <p className="font-bold">{selectedSpell.level}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">School</p>
                  <p className="font-bold">{selectedSpell.school}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Select a spell to view details</p>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Spell Synergies</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-2">Potential Synergies</h3>
              <ul className="list-disc list-inside text-gray-700">
                {spellSynergies.potentialSynergies.map((synergy, index) => (
                  <li key={index}>{synergy}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">Recommended Combinations</h3>
              <ul className="list-disc list-inside text-gray-700">
                {spellSynergies.recommendedCombinations.map((combo, index) => (
                  <li key={index}>{combo}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Spell Casting Analysis</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Spell Versatility', value: spellCastingAnalysis.spellVersatility },
              { label: 'Casting Potential', value: spellCastingAnalysis.castingPotential },
              { label: 'School Diversity', value: spellCastingAnalysis.schoolDiversity },
              { label: 'Spell Level Range', value: spellCastingAnalysis.spellLevelRange }
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm text-gray-600">{label}</p>
                <p className="text-lg font-bold">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
