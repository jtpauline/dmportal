import { Spell } from '../spells';
import { Character } from '../characters';
import { EnvironmentalContext } from './spell-interaction-analyzer';
import { SpellInteractionAnalysis } from './spell-interaction-analyzer';
import { SpellInteractionAnalyzer } from './spell-interaction-analyzer';
import { SpellInteractionPluginSystem } from './spell-interaction-plugin-system';

export class SpellInteractionCache {
  // In-memory cache for spell interactions
  private static cache: Map<string, SpellInteractionAnalysis> = new Map();

  /**
   * Generate a unique cache key for spell interaction
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @param character Casting character
   * @param context Environmental context
   * @returns Unique cache key
   */
  private static generateCacheKey(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character,
    context: EnvironmentalContext
  ): string {
    return JSON.stringify({
      primarySpell: primarySpell.name,
      secondarySpell: secondarySpell.name,
      characterId: character.id,
      terrain: context.terrain,
      combatDifficulty: context.combatDifficulty
    });
  }

  /**
   * Analyze spell interaction with caching mechanism
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @param character Casting character
   * @param context Environmental context
   * @returns Cached or newly computed spell interaction analysis
   */
  static analyzeSpellInteraction(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character,
    context: EnvironmentalContext
  ): SpellInteractionAnalysis {
    const cacheKey = this.generateCacheKey(
      primarySpell, 
      secondarySpell, 
      character, 
      context
    );

    // Check cache first
    const cachedAnalysis = this.cache.get(cacheKey);
    if (cachedAnalysis) {
      return cachedAnalysis;
    }

    // Compute new analysis
    const baseAnalysis = SpellInteractionAnalyzer.analyzeSpellInteraction(
      primarySpell,
      secondarySpell,
      character,
      context
    );

    // Apply plugins to enhance analysis
    const enhancedAnalysis = SpellInteractionPluginSystem.applyPlugins(
      primarySpell,
      secondarySpell,
      character,
      context,
      baseAnalysis
    );

    // Cache the result
    this.cache.set(cacheKey, enhancedAnalysis);

    return enhancedAnalysis;
  }

  /**
   * Clear the entire interaction cache
   */
  static clearCache(): void {
    this.cache.clear();
  }

  /**
   * Remove specific cache entry
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @param character Casting character
   * @param context Environmental context
   */
  static removeCacheEntry(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character,
    context: EnvironmentalContext
  ): void {
    const cacheKey = this.generateCacheKey(
      primarySpell, 
      secondarySpell, 
      character, 
      context
    );
    this.cache.delete(cacheKey);
  }

  /**
   * Get cache statistics
   * @returns Cache statistics
   */
  static getCacheStats(): {
    totalEntries: number;
    memorySizeEstimate: number;
  } {
    return {
      totalEntries: this.cache.size,
      memorySizeEstimate: Array.from(this.cache.entries()).reduce(
        (total, [key, value]) => total + JSON.stringify(key).length + JSON.stringify(value).length, 
        0
      )
    };
  }
}
