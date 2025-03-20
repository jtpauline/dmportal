import { Spell } from '../spells';
import { Character } from '../characters';
import { EnvironmentalContext } from './spell-interaction-analyzer';
import { SpellInteractionPrediction } from './spell-interaction-ml-advanced-predictor';

export class SpellInteractionMLCache {
  private static cache: Map<string, {
    prediction: SpellInteractionPrediction;
    timestamp: number;
  }> = new Map();

  private static CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Generate unique cache key for spell interaction
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
      primarySpell: {
        name: primarySpell.name,
        school: primarySpell.school,
        level: primarySpell.level
      },
      secondarySpell: {
        name: secondarySpell.name,
        school: secondarySpell.school,
        level: secondarySpell.level
      },
      characterClass: character.class,
      terrain: context.terrain,
      combatDifficulty: context.combatDifficulty
    });
  }

  /**
   * Check if prediction is cached and valid
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @param character Casting character
   * @param context Environmental context
   * @returns Cached prediction or null
   */
  static getCachedPrediction(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character,
    context: EnvironmentalContext
  ): SpellInteractionPrediction | null {
    const cacheKey = this.generateCacheKey(
      primarySpell, 
      secondarySpell, 
      character, 
      context
    );

    const cachedEntry = this.cache.get(cacheKey);

    if (cachedEntry) {
      // Check if cache is still valid
      const currentTime = Date.now();
      if (currentTime - cachedEntry.timestamp < this.CACHE_EXPIRATION_TIME) {
        return cachedEntry.prediction;
      }
      
      // Remove expired cache entry
      this.cache.delete(cacheKey);
    }

    return null;
  }

  /**
   * Cache spell interaction prediction
   * @param primarySpell Primary spell
   * @param secondarySpell Secondary spell
   * @param character Casting character
   * @param context Environmental context
   * @param prediction Spell interaction prediction
   */
  static cachePrediction(
    primarySpell: Spell,
    secondarySpell: Spell,
    character: Character,
    context: EnvironmentalContext,
    prediction: SpellInteractionPrediction
  ): void {
    const cacheKey = this.generateCacheKey(
      primarySpell, 
      secondarySpell, 
      character, 
      context
    );

    this.cache.set(cacheKey, {
      prediction,
      timestamp: Date.now()
    });
  }

  /**
   * Get cache statistics
   * @returns Cache statistics
   */
  static getCacheStats(): {
    totalEntries: number;
    activeEntries: number;
    oldestEntryAge: number;
  } {
    const currentTime = Date.now();
    const activeEntries = Array.from(this.cache.entries())
      .filter(([_, entry]) => 
        currentTime - entry.timestamp < this.CACHE_EXPIRATION_TIME
      );

    const oldestEntry = Array.from(this.cache.values())
      .reduce((oldest, current) => 
        current.timestamp < oldest ? current.timestamp : oldest, 
        currentTime
      );

    return {
      totalEntries: this.cache.size,
      activeEntries: activeEntries.length,
      oldestEntryAge: currentTime - oldestEntry
    };
  }

  /**
   * Clear expired cache entries
   */
  static clearExpiredEntries(): void {
    const currentTime = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (currentTime - entry.timestamp >= this.CACHE_EXPIRATION_TIME) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Manually clear entire cache
   */
  static clearCache(): void {
    this.cache.clear();
  }
}
