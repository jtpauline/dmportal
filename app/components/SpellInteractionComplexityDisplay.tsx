import React from 'react';
import { SpellInteractionComplexityAnalyzer } from '~/modules/utils/spell-interaction-complexity-analyzer';
import { Spell } from '~/modules/spells';
import { Character } from '~/modules/characters';

interface SpellInteractionComplexityDisplayProps {
  primarySpell: Spell;
  secondarySpell?: Spell;
  character?: Character;
}

export const SpellInteractionComplexityDisplay: React.FC<SpellInteractionComplexityDisplayProps> = ({
  primarySpell,
  secondarySpell,
  character
}) => {
  const complexityAnalysis = SpellInteractionComplexityAnalyzer.analyzeSpellInteractionComplexity(
    primarySpell,
    secondarySpell,
    character
  );

  const getComplexityColor = (score: number) => {
    if (score >= 8) return 'text-red-600';
    if (score >= 6) return 'text-orange-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="spell-interaction-complexity-display bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Spell Interaction Complexity</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold">Complexity Score</h4>
          <p className={`
            text-lg font-bold ${getComplexityColor(complexityAnalysis.complexityScore)}
          `}>
            {complexityAnalysis.complexityScore.toFixed(2)}/10
          </p>
        </div>

        <div>
          <h4 className="font-semibold">Primary Spell</h4>
          <p>{primarySpell.name} (Level {primarySpell.level} {primarySpell.school})</p>
        </div>

        {secondarySpell && (
          <div>
            <h4 className="font-semibold">Secondary Spell</h4>
            <p>{secondarySpell.name} (Level {secondarySpell.level} {secondarySpell.school})</p>
          </div>
        )}
      </div>

      <div className="mt-4">
        <h4 className="font-semibold mb-2">Interaction Risks</h4>
        <ul className="list-disc list-inside text-red-700">
          {complexityAnalysis.interactionRisks.map((risk, index) => (
            <li key={index}>{risk}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h4 className="font-semibold mb-2">Strategic Potential</h4>
        <ul className="list-disc list-inside text-green-700">
          {complexityAnalysis.strategicPotential.map((strategy, index) => (
            <li key={index}>{strategy}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
