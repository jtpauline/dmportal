import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the type for a campaign
export interface Campaign {
  id: string;
  name: string;
  description?: string;
  characters?: string[];
  encounters?: string[];
}

// Define the store interface
interface CampaignStore {
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
  removeCampaign: (campaignId: string) => void;
  updateCampaign: (campaignId: string, updates: Partial<Campaign>) => void;
}

// Create the Zustand store with persistence
const useCampaignStore = create<CampaignStore>()(
  persist(
    (set) => ({
      campaigns: [],
      
      addCampaign: (campaign) => 
        set((state) => ({ 
          campaigns: [...state.campaigns, campaign] 
        })),
      
      removeCampaign: (campaignId) => 
        set((state) => ({ 
          campaigns: state.campaigns.filter(c => c.id !== campaignId) 
        })),
      
      updateCampaign: (campaignId, updates) => 
        set((state) => ({
          campaigns: state.campaigns.map(campaign => 
            campaign.id === campaignId 
              ? { ...campaign, ...updates } 
              : campaign
          )
        })),
    }),
    {
      name: 'campaign-storage', // unique name
      // Optional: customize storage (default is localStorage)
    }
  )
);

export default useCampaignStore;
