import React, { useState } from 'react';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Card } from '~/app/components/ui/Modal';
import { PredictiveEncounterDesigner } from '~/app/modules/utils/predictive-encounter-design';
import { EncounterScalingSystem } from '~/app/modules/utils/encounter-scaling-system';

export const loader = async ({ params }) => {
  // Mock data - in real implementation, fetch from actual campaign/character data
  const characters = [
    { 
      name: 'Aria Stormwind', 
      class: 'Wizard', 
      level: 5, 
      multiclassLevels: ['Rogue'] 
    },
    { 
      name: 'Thorne Ironheart', 
      class: 'Fighter', 
      level: 5 
    }
  ];

  // Generate predictive encounter
  const predictiveEncounter = PredictiveEncounterDesigner.generatePredictiveEncounter({
    characters,
    campaignStage: 2,
    difficultyPreference: 'Medium',
    terrainType: 'Underground',
    environmentalFactors: ['Dim Lighting', 'Narrow Passages']
  });

  // Scale encounter
  const scaledEncounter = EncounterScalingSystem.scaleEncounter({
    characters,
    baseEncounter: {
      monsters: predictiveEncounter.encounter.monsters,
      difficulty: 'Medium'
    },
    scalingFactors: {
      campaignProgressionStage: 2,
      previousEncounterOutcomes: 'Victory',
      playerExperience: 'Intermediate'
    }
  });

  return json({
    predictiveEncounter,
    scaledEncounter
  });
};

export default function EncounterDesignPage() {
  const { 
    predictiveEncounter, 
    scaledEncounter 
  } = useLoaderData<typeof loader>();

  const [selectedMonster, setSelectedMonster] = useState(null);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Encounter Design</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Encounter Composition</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-2">Character Synergies</h3>
              <ul className="list-disc list-inside text-gray-700">
                {predictiveEncounter.strategicInsights.characterSynergies.map((synergy, index) => (
                  <li key={index}>{synergy}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">Monsters</h3>
              <div className="grid grid-cols-2 gap-4">
                {scaledEncounter.scaledMonsters.map((monster, index) => (
                  <div 
                    key={index} 
                    className={`p-3 border rounded-lg cursor-pointer ${
                      selectedMonster === monster 
                        ? 'bg-blue-100 border-blue-500' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedMonster(monster)}
                  >
                    <p className="font-semibold">{monster.name}</p>
                    <p className="text-sm text-gray-600">CR: {monster.challengeRating}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Encounter Details</h2>
          
          {selectedMonster ? (
            <div className="space-y-4">
              <h3 className="font-bold">{selectedMonster.name} Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Challenge Rating</p>
                  <p className="font-bold">{selectedMonster.challengeRating}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hit Points</p>
                  <p className="font-bold">{selectedMonster.hitPoints}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monster Type</p>
                  <p className="font-bold">{selectedMonster.type}</p>
                </div>
              </div>

              {selectedMonster.specialAbilities && (
                <div>
                  <h4 className="font-semibold mb-2">Special Abilities</h4>
                  <ul className="list-disc list-inside text-gray-700">
                    {selectedMonster.specialAbilities.map((ability, index) => (
                      <li key={index}>{ability.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600">Select a monster to view details</p>
          )}
        </Card>

        <Card className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Strategic Insights</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold mb-2">Potential Tactics</h3>
              <ul className="list-disc list-inside text-gray-700">
                {predictiveEncounter.strategicInsights.potentialTactics.map((tactic, index) => (
                  <li key={index}>{tactic}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">Encounter Challenges</h3>
              <ul className="list-disc list-inside text-red-700">
                {predictiveEncounter.strategicInsights.encounterChallenges.map((challenge, index) => (
                  <li key={index}>{challenge}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
