import { Campaign } from '../campaigns';
import { Character } from '../characters';
import { Encounter } from '../encounters';

export interface NarrativeCacheEntry {
  campaignId: string;
  characterIds: string[];
  encounterType: string;
  narrativeOutcome: string;
  timestamp: number;
  complexity: number;
}

export class NarrativeInteractionCache {
  private static cache: Map<string, NarrativeCacheEntry> = new Map();
  private static MAX_CACHE_SIZE = 1000;

  /**
   * Generate Unique Cache Key
   */
  private static generateCacheKey(
    campaign: Campaign, 
    characters: Character[], 
    encounterType: string
  ): string {
    return `${campaign.id}-${characters.map(c => c.id).sort().join('-')}-${encounterType}`;
  }

  /**
   * Cache Narrative Interaction
   */
  static cacheNarrativeInteraction(
    campaign: Campaign, 
    characters: Character[], 
    encounter: Encounter,
    narrativeOutcome: string,
    complexity: number
  ): void {
    const cacheKey = this.generateCacheKey(campaign, characters, encounter.type);
    
    const cacheEntry: NarrativeCacheEntry = {
      campaignId: campaign.id,
      characterIds: characters.map(c => c.id),
      encounterType: encounter.type,
      narrativeOutcome,
      timestamp: Date.now(),
      complexity
    };

    // Manage cache size
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.pruneCache();
    }

    this.cache.set(cacheKey, cacheEntry);
  }

  /**
   * Retrieve Cached Narrative Interaction
   */
  static retrieveCachedNarrativeInteraction(
    campaign: Campaign, 
    characters: Character[], 
    encounterType: string
  ): NarrativeCacheEntry | undefined {
    const cacheKey = this.generateCacheKey(campaign, characters, encounterType);
    return this.cache.get(cacheKey);
  }

  /**
   * Prune Cache
   */
  private static pruneCache(): void {
    // Remove oldest entries if cache is full
    const sortedEntries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const entriesToRemove = sortedEntries.slice(0, Math.floor(this.cache.size * 0.2));
    
    entriesToRemove.forEach(([key]) => {
      this.cache.delete(key);
    });
  }

  /**
   * Check Cache Relevance
   */
  static isCacheRelevant(
    cachedEntry: NarrativeCacheEntry, 
    maxAgeMinutes: number = 60
  ): boolean {
    const currentTime = Date.now();
    const cacheAgeMinutes = (currentTime - cachedEntry.timestamp) / (1000 * 60);
    
    return cacheAgeMinutes <= maxAgeMinutes;
  }

  /**
   * Generate Cache Statistics
   */
  static generateCacheStatistics(): {
    totalEntries: number;
    averageComplexity: number;
    mostFrequentEncounterTypes: string[];
  } {
    const entries = Array.from(this.cache.values());

    return {
      totalEntries: entries.length,
      averageComplexity: entries.reduce((sum, entry) => sum + entry.complexity, 0) / entries.length,
      mostFrequentEncounterTypes: this.findMostFrequentEncounterTypes(entries)
    };
  }

  /**
   * Find Most Frequent Encounter Types
   */
  private static findMostFrequentEncounterTypes(entries: NarrativeCacheEntry[]): string[] {
    const encounterTypeFrequency = entries.reduce((freq, entry) => {
      freq[entry.encounterType] = (freq[entry.encounterType] || 0) + 1;
      return freq;
    }, {});

    return Object.entries(encounterTypeFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);
  }
}
