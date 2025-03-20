import React, { useState } from 'react';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Card } from '~/app/components/ui/Modal';
import { TacticalInsightsDisplay } from '~/app/components/TacticalInsightsDisplay';
import { MachineLearningNarrativeGenerator } from '~/app/modules/utils/machine-learning-narrative-generator';
import { PredictiveEncounterDesigner } from '~/app/modules/utils/predictive-encounter-design';
import { EncounterComplexityAnalyzer } from '~/app/modules/utils/encounter-complexity-analyzer';

export const loader = async ({ params }) => {
  // Mock data - in real implementation, fetch from actual campaign/character data
  const characters = [
    { 
      name: 'Aria Stormwind', 
      class: 'Wizard', 
      level: 5, 
      multiclassLevels: ['Rogue'] 
    }
  ];

  const monsters = [
    { 
      name: 'Shadow Wraith', 
      challengeRating: 3, 
      type: 'Undead',
      hitPoints: 45,
      actions: [{ 
        name: 'Spectral Drain', 
        damage: [{ averageDamage: 15 }] 
      }]
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

  // Generate narrative
  const encounterNarrative = MachineLearningNarrativeGenerator.generateEncounterNarrative({
    characters,
    monsters: predictiveEncounter.encounter.monsters,
    terrain: 'Underground',
    environmentalFactors: ['Dim Lighting', 'Narrow Passages'],
    campaignStage: 2
  });

  // Analyze encounter complexity
  const complexityAnalysis = EncounterComplexityAnalyzer.analyzeEncounterComplexity(
    predictiveEncounter.encounter.monsters,
    characters
  );

  return json({
    predictiveEncounter,
    encounterNarrative,
    complexityAnalysis
  });
};

export default function EncounterNarrativePage() {
  const { 
    predictiveEncounter, 
    encounterNarrative,
    complexityAnalysis 
  } = useLoaderData<typeof loader>();

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const renderNarrativeSection = (title: string, content: string | string[]) => {
    const isExpanded = expandedSection === title;
    
    return (
      <div className="mb-4 border rounded-lg p-4 bg-gray-50">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setExpandedSection(isExpanded ? null : title)}
        >
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <span className="text-sm text-gray-600">
            {isExpanded ? '▼' : '►'}
          </span>
        </div>
        
        {isExpanded && (
          <div className="mt-2 text-gray-700">
            {Array.isArray(content) ? (
              <ul className="list-disc list-inside">
                {content.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>{content}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Encounter Narrative Generation</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Encounter Narrative</h2>
          
          {renderNarrativeSection('Encounter Setup', encounterNarrative.encounterSetup)}
          {renderNarrativeSection('Initial Description', encounterNarrative.initialDescription)}
          {renderNarrativeSection('Potential Plot Twists', encounterNarrative.potentialPlotTwists)}
          {renderNarrativeSection('Narrative Challenges', encounterNarrative.narrativeChallenges)}
          {renderNarrativeSection('Emotional Tone', encounterNarrative.emotionalTone)}
        </Card>

        <div>
          <TacticalInsightsDisplay 
            tacticalInsights={predictiveEncounter.strategicInsights.potentialTactics}
            potentialChallenges={predictiveEncounter.strategicInsights.encounterChallenges}
          />

          <Card className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Encounter Complexity</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Overall Complexity', value: complexityAnalysis.overallComplexity },
                { label: 'Monster Diversity', value: complexityAnalysis.monsterDiversity },
                { label: 'Ability Complexity', value: complexityAnalysis.abilityComplexity },
                { label: 'Environmental Impact', value: complexityAnalysis.environmentalImpact },
                { label: 'Character Synergy', value: complexityAnalysis.characterSynergyPotential }
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">{label}</p>
                  <p className="text-lg font-bold">{value.toFixed(2)}/10</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
