import { Spell } from '../spells';
import { Character } from '../characters';
import { EnvironmentalContext } from './spell-interaction-analyzer';

// Enhanced Plugin Interface
export interface SpellInteractionPlugin {
  name: string;
  version: string;
  priority: number;
  processInteraction(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character,
    context: EnvironmentalContext
  ): SpellInteractionPluginResult;
}

// Enhanced Plugin Result Structure
export interface SpellInteractionPluginResult {
  modified: boolean;
  compatibilityScoreAdjustment?: number;
  additionalInsights?: string[];
  warningMessages?: string[];
  recommendedCombos?: SpellComboRecommendation[];
}

// Spell Combo Recommendation Interface
export interface SpellComboRecommendation {
  primarySpell: Spell;
  secondarySpell: Spell;
  recommendationScore: number;
  rationale: string;
}

// Advanced Plugin Management System
export class SpellInteractionPluginManager {
  private static registeredPlugins: SpellInteractionPlugin[] = [];

  /**
   * Register a new spell interaction plugin
   * @param plugin Plugin to register
   */
  static registerPlugin(plugin: SpellInteractionPlugin): void {
    // Prevent duplicate plugin registration
    const existingPluginIndex = this.registeredPlugins.findIndex(
      p => p.name === plugin.name
    );

    if (existingPluginIndex !== -1) {
      this.registeredPlugins[existingPluginIndex] = plugin;
    } else {
      this.registeredPlugins.push(plugin);
    }

    // Sort plugins by priority (highest first)
    this.registeredPlugins.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Process spell interaction through all registered plugins
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @param character Casting character
   * @param context Environmental context
   * @returns Aggregated plugin results
   */
  static processSpellInteraction(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character,
    context: EnvironmentalContext
  ): SpellInteractionPluginResult[] {
    return this.registeredPlugins.map(plugin => 
      plugin.processInteraction(
        primarySpell, 
        secondarySpell, 
        character, 
        context
      )
    ).filter(result => result.modified);
  }

  /**
   * Get list of registered plugins
   * @returns Array of registered plugin names
   */
  static getRegisteredPlugins(): Array<{name: string, version: string}> {
    return this.registeredPlugins.map(plugin => ({
      name: plugin.name,
      version: plugin.version
    }));
  }

  /**
   * Clear all registered plugins
   */
  static clearPlugins(): void {
    this.registeredPlugins = [];
  }
}

// Example Plugin: Spell Combo Recommendation Plugin
export class SpellComboRecommendationPlugin implements SpellInteractionPlugin {
  name = 'Spell Combo Recommendation Plugin';
  version = '1.0.0';
  priority = 8;

  processInteraction(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character,
    context: EnvironmentalContext
  ): SpellInteractionPluginResult {
    const recommendationScore = this.calculateComboRecommendation(
      primarySpell, 
      secondarySpell, 
      character
    );

    return {
      modified: recommendationScore > 0.7,
      compatibilityScoreAdjustment: recommendationScore,
      recommendedCombos: this.generateRecommendations(recommendationScore),
      additionalInsights: this.generateInsights(recommendationScore)
    };
  }

  private calculateComboRecommendation(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character
  ): number {
    // Complex recommendation scoring logic
    let score = 0.5;

    // Spell school synergy
    const spellSchoolSynergyMatrix = {
      'evocation': { 'conjuration': 0.8, 'illusion': 0.6 },
      'conjuration': { 'evocation': 0.7, 'transmutation': 0.9 }
      // Expand with more interactions
    };

    if (spellSchoolSynergyMatrix[primarySpell.school]?.[secondarySpell.school]) {
      score += spellSchoolSynergyMatrix[primarySpell.school][secondarySpell.school];
    }

    // Character class affinity
    const classAffinityBonus = {
      'wizard': 0.2,
      'sorcerer': 0.15
    };

    if (classAffinityBonus[character.class]) {
      score += classAffinityBonus[character.class];
    }

    return Math.min(score, 1);
  }

  private generateRecommendations(
    score: number
  ): SpellComboRecommendation[] {
    // Generate contextual spell combo recommendations
    return score > 0.7 ? [
      {
        primarySpell: null, // Placeholder
        secondarySpell: null, // Placeholder
        recommendationScore: score,
        rationale: `High potential spell combination (Score: ${score.toFixed(2)})`
      }
    ] : [];
  }

  private generateInsights(score: number): string[] {
    return score > 0.7 
      ? [`Excellent spell combination potential detected`]
      : [];
  }
}

// Register the plugin
SpellInteractionPluginManager.registerPlugin(new SpellComboRecommendationPlugin());
