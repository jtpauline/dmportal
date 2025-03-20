import React from 'react';
import { SpellInteractionAnalyzer, EnvironmentalContext } from '~/modules/utils/spell-interaction-analyzer';
import { Spell } from '~/modules/spells';
import { Character } from '~/modules/characters';

interface SpellInteractionAnalysisDisplayProps {
  primarySpell: Spell;
  secondarySpell: Spell;
  character: Character;
  context: EnvironmentalContext;
}

export const SpellInteractionAnalysisDisplay: React.FC<SpellInteractionAnalysisDisplayProps> = ({
  primarySpell,
  secondarySpell,
  character,
  context
}) => {
  const interactionAnalysis = SpellInteractionAnalyzer.analyzeSpellInteraction(
    primarySpell,
    secondarySpell,
    character,
    context
  );

  const getInteractionTypeColor = (type: string) => {
    switch (type) {
      case 'synergy': return 'text-green-600';
      case 'conflict': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="spell-interaction-analysis-display bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Spell Interaction Analysis</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-semibold">Primary Spell</h4>
          <p>{primarySpell.name} (Level {primarySpell.level} {primarySpell.school})</p>
        </div>
        <div>
          <h4 className="font-semibold">Secondary Spell</h4>
          <p>{secondarySpell.name} (Level {secondarySpell.level} {secondarySpell.school})</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <h4 className="font-semibold">Compatibility Score</h4>
          <p className={`
            text-lg font-bold ${getCompatibilityColor(interactionAnalysis.compatibilityScore)}
          `}>
            {interactionAnalysis.compatibilityScore.toFixed(2)}/10
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Interaction Type</h4>
          <p className={`
            font-bold uppercase ${getInteractionTypeColor(interactionAnalysis.interactionType)}
          `}>
            {interactionAnalysis.interactionType}
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Environment</h4>
          <p>{context.environment} ({context.combatDifficulty} difficulty)</p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold mb-2">Environmental Factors</h4>
        <ul className="list-disc list-inside text-gray-700">
          {interactionAnalysis.environmentalFactors.map((factor, index) => (
            <li key={index}>{factor}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Potential Outcomes</h4>
        <ul className="list-disc list-inside text-gray-700">
          {interactionAnalysis.potentialOutcomes.map((outcome, index) => (
            <li key={index}>{outcome}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
