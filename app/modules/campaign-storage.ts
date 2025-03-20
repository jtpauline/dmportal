import { Campaign } from './campaigns';

export class CampaignStorage {
  private static campaigns: { [key: string]: Campaign } = {};

  static saveCampaign(campaign: Campaign): void {
    this.campaigns[campaign.id] = campaign;
  }

  static getCampaignById(campaignId: string): Campaign | undefined {
    return this.campaigns[campaignId];
  }

  static updateCampaign(campaign: Campaign): void {
    if (!this.campaigns[campaign.id]) {
      throw new Error('Campaign not found');
    }
    this.campaigns[campaign.id] = campaign;
  }

  static getAllCampaigns(): Campaign[] {
    return Object.values(this.campaigns);
  }

  static deleteCampaign(campaignId: string): void {
    delete this.campaigns[campaignId];
  }
}
