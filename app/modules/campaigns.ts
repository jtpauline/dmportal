// Updated to include more robust campaign creation
export interface Campaign {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  // Optional additional fields
  players?: string[];
  status?: 'planning' | 'active' | 'completed';
}

export class CampaignManager {
  // In-memory storage for campaigns (will be replaced with persistent storage later)
  private static campaigns: Campaign[] = [
    {
      id: '1',
      name: 'Sample Campaign',
      description: 'An example campaign for demonstration',
      createdAt: new Date(),
      players: [],
      status: 'planning'
    }
  ];

  static getAllCampaigns(): Campaign[] {
    return this.campaigns;
  }

  static getCampaignById(id: string): Campaign | undefined {
    return this.campaigns.find(campaign => campaign.id === id);
  }

  static createCampaign(campaignData: Omit<Campaign, 'id' | 'createdAt'>): Campaign {
    const newCampaign: Campaign = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      ...campaignData,
      status: campaignData.status || 'planning'
    };

    this.campaigns.push(newCampaign);
    return newCampaign;
  }
}
