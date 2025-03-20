import React, { useState } from 'react';
import { LoaderFunction, ActionFunction } from '@remix-run/node';
import { useLoaderData, useParams } from '@remix-run/react';
import { SpellInteractionVisualizationCard } from '../../../../components/SpellInteractionVisualizationCard';
import { SpellInteractionAnalysisModal } from '../../../../components/SpellInteractionAnalysisModal';
import { getCharacterSpells } from '../../../../modules/characters';
import { getSpellById } from '../../../../modules/spells';

export const loader: LoaderFunction = async ({ params }) => {
  const { characterId } = params;
  const spells = await getCharacterSpells(characterId);
  return { spells };
};

export default function SpellInteractionAnalysisPage() {
  const { spells } = useLoaderData();
  const { characterId, campaignId } = useParams();

  const [selectedPrimarySpell, setSelectedPrimarySpell] = useState(null);
  const [selectedSecondarySpell, setSelectedSecondarySpell] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSpellSelection = (spell, isPrimary) => {
    if (isPrimary) {
      setSelectedPrimarySpell(spell);
    } else {
      setSelectedSecondarySpell(spell);
    }
  };

  const openInteractionAnalysisModal = () => {
    if (selectedPrimarySpell && selectedSecondarySpell) {
      setIsModalOpen(true);
    }
  };

  const renderSpellSelector = (isPrimary) => {
    const selectedSpell = isPrimary ? selectedPrimarySpell : selectedSecondarySpell;
    
    return (
      <div className="spell-selector">
        <h3 className="text-lg font-bold mb-2">
          {isPrimary ? 'Primary' : 'Secondary'} Spell
        </h3>
        <select 
          value={selectedSpell?.id || ''}
          onChange={(e) => {
            const spell = spells.find(s => s.id === e.target.value);
            handleSpellSelection(spell, isPrimary);
          }}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a Spell</option>
          {spells.map(spell => (
            <option key={spell.id} value={spell.id}>
              {spell.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="spell-interaction-analysis-page p-6">
      <h1 className="text-3xl font-bold mb-6">Spell Interaction Analysis</h1>

      <div className="spell-selection grid grid-cols-2 gap-4 mb-6">
        {renderSpellSelector(true)}
        {renderSpellSelector(false)}
      </div>

      {selectedPrimarySpell && selectedSecondarySpell && (
        <div>
          <SpellInteractionVisualizationCard 
            primarySpell={selectedPrimarySpell}
            secondarySpell={selectedSecondarySpell}
            character={character}  // You'll need to pass the actual character object
            context={{
              terrain: 'forest',  // Example terrain, should be dynamic
              combatDifficulty: 'medium'  // Example difficulty, should be dynamic
            }}
          />

          <button 
            onClick={openInteractionAnalysisModal}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Open Interaction Analysis Modal
          </button>

          {isModalOpen && (
            <SpellInteractionAnalysisModal 
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              primarySpell={selectedPrimarySpell}
              secondarySpell={selectedSecondarySpell}
              character={character}  // You'll need to pass the actual character object
              context={{
                terrain: 'forest',  // Example terrain, should be dynamic
                combatDifficulty: 'medium'  // Example difficulty, should be dynamic
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
