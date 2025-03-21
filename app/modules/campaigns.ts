// Simplified campaign management without authentication
export interface Campaign {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

export class CampaignManager {
  // Removed user-specific filtering
  static getAllCampaigns(): Campaign[] {
    // Implement open access to all campaigns
    return [
      {
        id: '1',
        name: 'Sample Campaign',
        description: 'An example campaign for demonstration',
        createdAt: new Date()
      }
    ];
  }

  // Simplified campaign creation
  static createCampaign(campaignData: Omit<Campaign, 'id' | 'createdAt'>): Campaign {
    return {
      id: Math.random().toString(36).substr(2, 9),
      ...campaignData,
      createdAt: new Date()
    };
  }
}
