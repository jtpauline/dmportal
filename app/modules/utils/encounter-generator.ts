// Existing imports...
import { PredictiveEncounterDesigner } from './predictive-encounter-design';

// Add a method to support predictive design integration
export class EncounterGenerator {
  // ... existing methods ...

  /**
   * Generate an encounter with predictive design capabilities
   * @param characters Player characters
   * @param options Encounter generation options
   * @returns Predictive encounter design
   */
  static generatePredictiveEncounter(
    characters: Character[], 
    options: any = {}
  ) {
    return PredictiveEncounterDesigner.designEncounter({
      characters,
      ...options
    });
  }
}
