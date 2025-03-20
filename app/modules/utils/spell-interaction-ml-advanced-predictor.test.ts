import { describe, it, expect } from 'vitest';
import { AdvancedSpellInteractionMLPredictor } from './spell-interaction-ml-advanced-predictor';
import { Spell } from '../spells';
import { Character } from '../characters';

describe('AdvancedSpellInteractionMLPredictor', () => {
  const mockSpells: Spell[] = [
    { 
      name: 'Fireball', 
      school: 'Evocation', 
      level: 3, 
      type: 'Damage',
      tags: ['offensive', 'area-of-effect']
    },
    { 
      name: 'Shield', 
      school: 'Abjuration', 
      level: 1, 
      type: 'Protection',
      tags: ['defensive', 'self-buff']
    }
  ];

  const mockCharacter: Character = {
    id: 'wizard-test',
    name: 'Test Wizard',
    class: 'Wizard',
    level: 5,
    intelligence: 16,
    wisdom: 14
  };

  it('should create a singleton instance', () => {
    const predictor1 = AdvancedSpellInteractionMLPredictor.getInstance();
    const predictor2 = AdvancedSpellInteractionMLPredictor.getInstance();
    
    expect(predictor1).toBe(predictor2);
  });

  it('should generate synthetic training data', () => {
    const predictor = AdvancedSpellInteractionMLPredictor.getInstance();
    
    const syntheticTrainingData = [
      {
        spellCombination: ['Fireball', 'Shield'],
        interactionOutcome: {
          effectivness: 0.8,
          synergyScore: 0.7,
          unexpectedEffects: []
        },
        contextualFactors: {
          characterClass: 'Wizard',
          environmentType: 'Dungeon',
          combatDifficulty: 0.6
        }
      }
    ];

    predictor.trainModel(syntheticTrainingData);

    const performanceMetrics = predictor.evaluateModelPerformance();
    
    expect(performanceMetrics.trainingDatasetSize).toBe(1);
    expect(performanceMetrics.performanceMetrics.averageCompatibilityPrediction).toBeGreaterThan(0);
  });

  it('should predict spell interaction', () => {
    const predictor = AdvancedSpellInteractionMLPredictor.getInstance();
    
    const prediction = predictor.predictSpellInteraction(
      mockSpells, 
      mockCharacter, 
      'Dungeon'
    );

    expect(prediction).toHaveProperty('spellCombination');
    expect(prediction).toHaveProperty('predictedCompatibility');
    expect(prediction).toHaveProperty('potentialSynergyEffects');
    expect(prediction).toHaveProperty('riskFactors');
    expect(prediction).toHaveProperty('confidenceScore');

    expect(prediction.predictedCompatibility).toBeGreaterThanOrEqual(0);
    expect(prediction.predictedCompatibility).toBeLessThanOrEqual(1);
    expect(prediction.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(prediction.confidenceScore).toBeLessThanOrEqual(1);
  });
});
