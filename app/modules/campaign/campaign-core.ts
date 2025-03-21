import { IdGenerator } from "~/modules/utils/id-generator";

// Centralized exports for campaign core functionality
export interface Campaign {
  id: string;
  name: string;
  description?: string;
  startDate?: Date;
}

export class CampaignCore {
  static createCampaign(name: string, description?: string): Campaign {
    return {
      id: IdGenerator.generatePrefixedId('campaign'),
      name,
      description,
      startDate: new Date()
    };
  }

  static validateCampaign(campaign: Campaign): boolean {
    return !!(campaign.name && campaign.name.trim().length > 0);
  }
}

export default CampaignCore;
