import React from 'react';
import { Link } from '@remix-run/react';
import { CharacterValidator } from '~/modules/utils/validation/character-validator';
import { Modal } from '~/components/ui/Modal';

export default function CharacterDetailIndex() {
  const [isValidationModalOpen, setIsValidationModalOpen] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);

  const performPreventativeValidation = () => {
    try {
      // Simulated character data for preventative validation
      const mockCharacter = {
        name: '',  // Intentionally empty to trigger validation
        race: 'Human',
        class: 'Fighter',
        level: 1
      };

      const validationResult = CharacterValidator.validate(mockCharacter);

      if (!validationResult.isValid) {
        setValidationErrors(validationResult.errors);
        setIsValidationModalOpen(true);
      }
    } catch (error) {
      console.error('Validation check failed', error);
      setValidationErrors(['Unexpected validation error occurred']);
      setIsValidationModalOpen(true);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Character Management</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { 
            to: "spell-casting", 
            title: "Spell Casting", 
            description: "Manage and analyze spell capabilities",
            bgColor: "bg-blue-100 hover:bg-blue-200"
          },
          { 
            to: "spell-combos", 
            title: "Spell Combinations", 
            description: "Explore and create spell synergies",
            bgColor: "bg-green-100 hover:bg-green-200"
          },
          { 
            to: "spell-preparation", 
            title: "Spell Preparation", 
            description: "Prepare and optimize spell lists",
            bgColor: "bg-purple-100 hover:bg-purple-200"
          },
          { 
            to: "encounter-narrative", 
            title: "Encounter Narrative", 
            description: "Generate dynamic encounter stories",
            bgColor: "bg-red-100 hover:bg-red-200"
          },
          { 
            to: "encounter-design", 
            title: "Encounter Design", 
            description: "Create and analyze encounters",
            bgColor: "bg-yellow-100 hover:bg-yellow-200"
          },
          { 
            to: "spell-synergies", 
            title: "Spell Synergies", 
            description: "Discover magical interaction patterns",
            bgColor: "bg-indigo-100 hover:bg-indigo-200"
          }
        ].map((section) => (
          <Link 
            key={section.to}
            to={section.to} 
            className={`${section.bgColor} p-6 rounded-lg shadow-md transition-colors relative`}
          >
            <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
            <p className="text-gray-700">{section.description}</p>
          </Link>
        ))}
      </div>

      <Modal 
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
        title="Validation Errors"
      >
        <div className="text-red-600">
          {validationErrors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      </Modal>

      <div className="mt-6">
        <button 
          onClick={performPreventativeValidation}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Run Validation Check
        </button>
      </div>
    </div>
  );
}
