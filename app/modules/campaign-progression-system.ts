import { Campaign } from './campaigns';
import { Character } from './characters';
import { Encounter } from './encounters';

export interface ProgressionEvent {
  type: 'level_up' | 'milestone' | 'story_achievement' | 'character_development';
  description: string;
  xpGained: number;
  date: Date;
}

export class CampaignProgressionSystem {
  /**
   * Advanced XP and Milestone Tracking System
   */
  static trackProgressionEvents(campaign: Campaign, event: ProgressionEvent): Campaign {
    // Update campaign XP tracker
    campaign.xpTracker.totalXP += event.xpGained;

    // Check for level progression
    const currentAverageLevel = campaign.metadata.averagePartyLevel;
    const nextLevelXP = campaign.xpTracker.xpThresholds[currentAverageLevel + 1] || Infinity;

    if (campaign.xpTracker.totalXP >= nextLevelXP) {
      this.handlePartyLevelUp(campaign);
    }

    // Log progression event
    campaign.worldHistory.push(`[${event.type.toUpperCase()}] ${event.description}`);

    return campaign;
  }

  /**
   * Handle Party-Wide Level Progression
   */
  private static handlePartyLevelUp(campaign: Campaign): void {
    // Increment average party level
    campaign.metadata.averagePartyLevel++;

    // Potential story progression or milestone
    campaign.metadata.sessionsPlayed++;

    // Trigger potential narrative events or world changes
    this.triggerWorldProgressionEvents(campaign);
  }

  /**
   * Dynamic World Progression Events
   */
  private static triggerWorldProgressionEvents(campaign: Campaign): void {
    const worldProgressionEvents = [
      () => this.generateNarrativeEvent(campaign),
      () => this.adjustWorldComplexity(campaign),
      () => this.updateMajorNPCs(campaign)
    ];

    // Randomly trigger one of the progression events
    const selectedEvent = worldProgressionEvents[
      Math.floor(Math.random() * worldProgressionEvents.length)
    ];

    selectedEvent();
  }

  /**
   * Generate Narrative Progression Event
   */
  private static generateNarrativeEvent(campaign: Campaign): void {
    const narrativeEvents = [
      'A new political faction emerges',
      'An ancient prophecy begins to unfold',
      'A major antagonist reveals their true motives',
      'A hidden threat awakens',
      'A significant geographical change occurs'
    ];

    const selectedEvent = narrativeEvents[
      Math.floor(Math.random() * narrativeEvents.length)
    ];

    campaign.worldHistory.push(`[NARRATIVE PROGRESSION] ${selectedEvent}`);
  }

  /**
   * Dynamically Adjust World Complexity
   */
  private static adjustWorldComplexity(campaign: Campaign): void {
    const complexityFactors = {
      'Dungeon Crawl': () => this.increaseDungeonComplexity(campaign),
      'Wilderness Adventure': () => this.expandWildernessScope(campaign),
      'Urban Campaign': () => this.introduceUrbanIntrigues(campaign),
      'Planar Adventure': () => this.shiftPlanarDynamics(campaign),
      'Political Intrigue': () => this.escalatePoliticalConflicts(campaign)
    };

    const adjustmentMethod = complexityFactors[campaign.setting.type];
    if (adjustmentMethod) {
      adjustmentMethod();
    }
  }

  /**
   * Increase Dungeon Complexity
   */
  private static increaseDungeonComplexity(campaign: Campaign): void {
    // Increase encounter challenge ratings
    campaign.encounters.forEach(encounter => {
      encounter.challengeRating += 0.5;
    });
  }

  /**
   * Expand Wilderness Adventure Scope
   */
  private static expandWildernessScope(campaign: Campaign): void {
    campaign.setting.primaryRegion = 'Expanded Wilderness Realm';
  }

  /**
   * Introduce Urban Intrigues
   */
  private static introduceUrbanIntrigues(campaign: Campaign): void {
    campaign.majorNPCs.push({
      name: 'New Urban Faction Leader',
      role: 'Emerging Political Power',
      alignment: 'Neutral',
      significance: 'major'
    });
  }

  /**
   * Shift Planar Dynamics
   */
  private static shiftPlanarDynamics(campaign: Campaign): void {
    campaign.setting.description += ' - Planar Boundaries Destabilizing';
  }

  /**
   * Escalate Political Conflicts
   */
  private static escalatePoliticalConflicts(campaign: Campaign): void {
    campaign.setting.primaryConflict = 'Intensifying Political Tensions';
  }

  /**
   * Update Major NPCs Based on Campaign Progression
   */
  private static updateMajorNPCs(campaign: Campaign): void {
    campaign.majorNPCs = campaign.majorNPCs.map(npc => ({
      ...npc,
      significance: Math.random() > 0.5 ? 'critical' : npc.significance
    }));
  }

  /**
   * Calculate Campaign Momentum
   * Provides a metric of campaign dynamism and progression
   */
  static calculateCampaignMomentum(campaign: Campaign): number {
    const xpProgressFactor = campaign.xpTracker.totalXP / 
      (campaign.xpTracker.xpThresholds[campaign.metadata.averagePartyLevel + 1] || 1);
    
    const sessionsProgressFactor = campaign.metadata.sessionsPlayed / 10;
    const characterProgressFactor = campaign.characters.reduce(
      (sum, char) => sum + (char.level / 20), 
      0
    ) / campaign.characters.length;

    return (xpProgressFactor + sessionsProgressFactor + characterProgressFactor) / 3;
  }
}
