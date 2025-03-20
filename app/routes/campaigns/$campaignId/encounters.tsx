import React, { useState } from 'react';
import { useParams } from '@remix-run/react';
import { TacticalInsightsDisplay } from '~/components/TacticalInsightsDisplay';
import { EncounterGenerator } from '~/modules/utils/encounter-generator';
import { AdaptiveDifficultySystem } from '~/modules/utils/adaptive-difficulty-system';
import { MachineLearningNarrativeGenerator } from '~/modules/utils/machine-learning-narrative-generator';
import { TacticalInsightsGenerator } from '~/modules/utils/tactical-insights-generator';
import { EnvironmentalInteractionSystem } from '~/modules/utils/environmental-interaction-system';
import { Character } from '~/modules/characters';
import { Monster } from '~/modules/monsters';

export default function EncountersPage() {
  const { campaignId } = useParams();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentEncounter, setCurrentEncounter] = useState<{
    monsters: Monster[];
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Deadly';
  } | null>(null);
  const [tacticalInsights, setTacticalInsights] = useState<{
    characterStrengths: string[];
    monsterWeaknesses: string[];
    strategicApproaches: string[];
    potentialRisks: string[];
    recommendedTactics: string[];
  }>({
    characterStrengths: [],
    monsterWeaknesses: [],
    strategicApproaches: [],
    potentialRisks: [],
    recommendedTactics: []
  });
  const [encounterNarrative, setEncounterNarrative] = useState<{
    encounterSetup: string;
    initialDescription: string;
    potentialPlotTwists: string[];
    narrativeChallenges: string[];
    emotionalTone: string;
  } | null>(null);
  const [environmentalInteractions, setEnvironmentalInteractions] = useState<{
    description: string;
    mechanicalEffects: {
      characterAdvantages?: string[];
      monsterDisadvantages?: string[];
      terrainModifications?: string[];
    };
    potentialTactics: string[];
  } | null>(null);

  const generateEncounter = () => {
    // Simulate character and encounter generation
    const generatedCharacters: Character[] = [
      { 
        id: '1', 
        name: 'Warrior', 
        class: 'Fighter', 
        level: 5,
        multiclassLevels: []
      },
      { 
        id: '2', 
        name: 'Mage', 
        class: 'Wizard', 
        level: 5,
        multiclassLevels: []
      }
    ];

    const baseEncounter = EncounterGenerator.generatePredictiveEncounter(
      generatedCharacters, 
      { difficultyPreference: 'Medium' }
    );

    // Apply adaptive difficulty
    const adaptedEncounter = AdaptiveDifficultySystem.adjustDifficulty({
      characters: generatedCharacters,
      currentEncounter: {
        monsters: baseEncounter.encounter.monsters,
        difficulty: 'Medium'
      },
      campaignContext: {
        progressionStage: 1
      }
    });

    // Generate narrative context
    const encounterNarrative = MachineLearningNarrativeGenerator.generateEncounterNarrative({
      characters: generatedCharacters,
      monsters: adaptedEncounter.adjustedMonsters,
      terrain: 'Forest',
      environmentalFactors: ['Difficult Terrain'],
      campaignStage: 1
    });

    // Generate tactical insights
    const tacticalInsights = TacticalInsightsGenerator.generateTacticalInsights({
      characters: generatedCharacters,
      monsters: adaptedEncounter.adjustedMonsters,
      terrain: 'Forest',
      environmentalFactors: ['Difficult Terrain']
    });

    // Generate environmental interactions
    const environmentalInteractions = EnvironmentalInteractionSystem.analyzeEnvironmentalInteractions({
      characters: generatedCharacters,
      monsters: adaptedEncounter.adjustedMonsters,
      terrain: 'Forest',
      environmentalFactors: ['Difficult Terrain']
    });

    setCharacters(generatedCharacters);
    setCurrentEncounter({
      monsters: adaptedEncounter.adjustedMonsters,
      difficulty: 'Medium'
    });
    setTacticalInsights(tacticalInsights);
    setEncounterNarrative(encounterNarrative);
    setEnvironmentalInteractions(environmentalInteractions);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Encounter Generator</h1>
      
      <div className="mb-4">
        <button 
          onClick={generateEncounter}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Generate Encounter
        </button>
      </div>

      {currentEncounter && encounterNarrative && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section>
            <h2 className="text-xl font-semibold mb-2">Encounter Narrative</h2>
            <div className="bg-gray-100 p-4 rounded">
              <p className="mb-2"><strong>Setup:</strong> {encounterNarrative.encounterSetup}</p>
              <p className="mb-2"><strong>Initial Description:</strong> {encounterNarrative.initialDescription}</p>
              <p className="mb-2"><strong>Emotional Tone:</strong> {encounterNarrative.emotionalTone}</p>
              
              {encounterNarrative.potentialPlotTwists.length > 0 && (
                <div className="mt-2">
                  <strong>Potential Plot Twists:</strong>
                  <ul className="list-disc list-inside">
                    {encounterNarrative.potentialPlotTwists.map((twist, index) => (
                      <li key={index}>{twist}</li>
                    ))}
                  </ul>
                </div>
              )}

              {encounterNarrative.narrativeChallenges.length > 0 && (
                <div className="mt-2">
                  <strong>Narrative Challenges:</strong>
                  <ul className="list-disc list-inside">
                    {encounterNarrative.narrativeChallenges.map((challenge, index) => (
                      <li key={index}>{challenge}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <h2 className="text-xl font-semibold mt-4 mb-2">Monsters</h2>
            <ul className="list-disc list-inside">
              {currentEncounter.monsters.map((monster, index) => (
                <li key={index}>
                  {monster.name} (CR: {monster.challengeRating})
                </li>
              ))}
            </ul>
          </section>

          <div>
            <TacticalInsightsDisplay 
              tacticalInsights={tacticalInsights.recommendedTactics}
              potentialChallenges={tacticalInsights.potentialRisks}
            />

            {environmentalInteractions && (
              <div className="mt-4 bg-gray-100 p-4 rounded">
                <h3 className="text-lg font-semibold mb-2">Environmental Interactions</h3>
                <p className="mb-2">{environmentalInteractions.description}</p>

                {environmentalInteractions.mechanicalEffects.characterAdvantages && (
                  <div>
                    <strong>Character Advantages:</strong>
                    <ul className="list-disc list-inside">
                      {environmentalInteractions.mechanicalEffects.characterAdvantages.map((advantage, index) => (
                        <li key={index}>{advantage}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {environmentalInteractions.mechanicalEffects.monsterDisadvantages && (
                  <div className="mt-2">
                    <strong>Monster Disadvantages:</strong>
                    <ul className="list-disc list-inside">
                      {environmentalInteractions.mechanicalEffects.monsterDisadvantages.map((disadvantage, index) => (
                        <li key={index}>{disadvantage}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {environmentalInteractions.potentialTactics && (
                  <div className="mt-2">
                    <strong>Potential Environmental Tactics:</strong>
                    <ul className="list-disc list-inside">
                      {environmentalInteractions.potentialTactics.map((tactic, index) => (
                        <li key={index}>{tactic}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
