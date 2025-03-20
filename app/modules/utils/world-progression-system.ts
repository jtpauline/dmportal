import { Campaign } from '../campaigns';
import { Character } from '../characters';
import { Encounter } from '../encounters';
import { NarrativeComplexityAnalyzer } from './narrative-complexity-analyzer';

export interface WorldProgressionEvent {
  description: string;
  globalImpact: number;
  affectedRegions: string[];
  potentialConsequences: string[];
}

export class WorldProgressionSystem {
  /**
   * Generate World Progression Event
   */
  static generateWorldProgressionEvent(
    campaign: Campaign, 
    characters: Character[]
  ): WorldProgressionEvent {
    const complexityMetrics = NarrativeComplexityAnalyzer.analyzeNarrativeComplexity(
      campaign, 
      characters
    );

    // Determine progression intensity based on narrative complexity
    const progressionIntensity = this.calculateProgressionIntensity(complexityMetrics);

    // Generate world event based on campaign type and complexity
    const worldEvent = this.createWorldEvent(campaign, progressionIntensity);

    return {
      description: worldEvent.description,
      globalImpact: progressionIntensity,
      affectedRegions: worldEvent.affectedRegions,
      potentialConsequences: worldEvent.potentialConsequences
    };
  }

  /**
   * Integrate World Progression Event
   */
  static integrateWorldProgressionEvent(
    campaign: Campaign, 
    progressionEvent: WorldProgressionEvent
  ): void {
    // Update campaign world history
    campaign.worldHistory.push(`[WORLD PROGRESSION] ${progressionEvent.description}`);

    // Adjust campaign global state
    campaign.globalState = {
      ...campaign.globalState,
      lastProgressionImpact: progressionEvent.globalImpact,
      affectedRegions: progressionEvent.affectedRegions
    };

    // Trigger potential long-term consequences
    this.applyLongTermConsequences(campaign, progressionEvent);
  }

  /**
   * Calculate Progression Intensity
   */
  private static calculateProgressionIntensity(complexityMetrics: any): number {
    return (
      complexityMetrics.narrativeDepth * 0.4 +
      complexityMetrics.plotDynamism * 0.3 +
      complexityMetrics.characterInterconnectedness * 0.2 +
      complexityMetrics.thematicCoherence * 0.1
    );
  }

  /**
   * Create World Event
   */
  private static createWorldEvent(
    campaign: Campaign, 
    progressionIntensity: number
  ): {
    description: string;
    affectedRegions: string[];
    potentialConsequences: string[];
  } {
    const eventTemplates = {
      'Dungeon Crawl': [
        {
          description: 'A powerful artifact is discovered, shifting the balance of power',
          affectedRegions: ['Dungeon Realm', 'Nearby Settlements'],
          potentialConsequences: [
            'Increased monster activity',
            'Political tensions rise',
            'New factions emerge'
          ]
        },
        {
          description: 'An ancient seal is broken, releasing long-dormant magical energies',
          affectedRegions: ['Underground Caverns', 'Surrounding Wilderness'],
          potentialConsequences: [
            'Magical anomalies appear',
            'Creatures from deep realms emerge',
            'Arcane balance disrupted'
          ]
        }
      ],
      'Wilderness Adventure': [
        {
          description: 'A massive ecological shift transforms the landscape',
          affectedRegions: ['Wilderness Frontier', 'Bordering Kingdoms'],
          potentialConsequences: [
            'Migration of magical creatures',
            'Climate and terrain changes',
            'New survival challenges'
          ]
        },
        {
          description: 'An ancient nature spirit awakens, challenging existing power structures',
          affectedRegions: ['Primeval Forests', 'Druidic Territories'],
          potentialConsequences: [
            'Magical nature restoration',
            'Conflict with civilization',
            'Emergence of new magical guardians'
          ]
        }
      ],
      'Urban Campaign': [
        {
          description: 'A political coup reshapes the city\'s governance',
          affectedRegions: ['Urban Center', 'Surrounding Districts'],
          potentialConsequences: [
            'Social upheaval',
            'Economic restructuring',
            'Emergence of new power brokers'
          ]
        },
        {
          description: 'A hidden magical network is exposed, changing urban dynamics',
          affectedRegions: ['Magical Quarters', 'Merchant Districts'],
          potentialConsequences: [
            'Magical regulation changes',
            'Underground power shifts',
            'New magical economy emerges'
          ]
        }
      ]
    };

    // Select event template based on campaign type
    const campaignEvents = eventTemplates[campaign.setting.type] || [];
    const selectedEvent = campaignEvents[Math.floor(Math.random() * campaignEvents.length)];

    // Adjust event based on progression intensity
    return {
      ...selectedEvent,
      description: `[Intensity: ${progressionIntensity.toFixed(2)}] ${selectedEvent.description}`
    };
  }

  /**
   * Apply Long-Term Consequences
   */
  private static applyLongTermConsequences(
    campaign: Campaign, 
    progressionEvent: WorldProgressionEvent
  ): void {
    // Implement long-term world state modifications
    progressionEvent.potentialConsequences.forEach(consequence => {
      // Add consequence to world history for future reference
      campaign.worldHistory.push(`[CONSEQUENCE] ${consequence}`);
    });

    // Potential additional game mechanics triggered by world progression
    if (progressionEvent.globalImpact > 0.7) {
      // Significant world-changing event
      campaign.globalState.majorEventOccurred = true;
    }
  }

  /**
   * Generate World Progression Forecast
   */
  static generateWorldProgressionForecast(
    campaign: Campaign, 
    characters: Character[]
  ): {
    shortTermForecast: string[];
    longTermPotentials: string[];
    risksAndOpportunities: string[];
  } {
    const complexityMetrics = NarrativeComplexityAnalyzer.analyzeNarrativeComplexity(
      campaign, 
      characters
    );

    return {
      shortTermForecast: this.generateShortTermForecast(complexityMetrics),
      longTermPotentials: this.generateLongTermPotentials(campaign),
      risksAndOpportunities: this.assessRisksAndOpportunities(complexityMetrics)
    };
  }

  /**
   * Generate Short-Term Forecast
   */
  private static generateShortTermForecast(complexityMetrics: any): string[] {
    const forecastTemplates = [
      'Emerging tensions suggest imminent political shifts',
      'Magical undercurrents indicate potential supernatural events',
      'Economic indicators point to significant market transformations',
      'Social dynamics hint at upcoming cultural revolutions'
    ];

    // Select forecasts based on complexity
    const forecastCount = Math.ceil(complexityMetrics.narrativeDepth * 3);
    return forecastTemplates.slice(0, forecastCount);
  }

  /**
   * Generate Long-Term Potentials
   */
  private static generateLongTermPotentials(campaign: Campaign): string[] {
    const potentialTemplates = [
      'Emergence of a new magical paradigm',
      'Potential inter-kingdom conflict',
      'Technological or magical breakthrough',
      'Significant societal transformation'
    ];

    // Consider campaign history and current state
    return potentialTemplates.filter(() => 
      Math.random() < (campaign.worldHistory.length / 100)
    );
  }

  /**
   * Assess Risks and Opportunities
   */
  private static assessRisksAndOpportunities(complexityMetrics: any): string[] {
    const riskOpportunityTemplates = [
      {
        type: 'risk',
        templates: [
          'Potential magical destabilization',
          'Emerging political volatility',
          'Increasing inter-faction tensions'
        ]
      },
      {
        type: 'opportunity',
        templates: [
          'Unique magical research possibilities',
          'Diplomatic breakthrough potential',
          'Unexplored economic frontiers'
        ]
      }
    ];

    const risks = riskOpportunityTemplates[0].templates
      .slice(0, Math.ceil(complexityMetrics.plotDynamism * 3));
    
    const opportunities = riskOpportunityTemplates[1].templates
      .slice(0, Math.ceil(complexityMetrics.characterInterconnectedness * 3));

    return [...risks, ...opportunities];
  }
}
