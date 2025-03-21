import { Campaign, CampaignCore } from './campaign-core';

export class CampaignOrchestrator {
  private campaigns: Campaign[] = [];

  addCampaign(name: string, description?: string): Campaign {
    const newCampaign = CampaignCore.createCampaign(name, description);
    this.campaigns.push(newCampaign);
    return newCampaign;
  }

  getAllCampaigns(): Campaign[] {
    return [...this.campaigns];
  }
}

export default CampaignOrchestrator;
