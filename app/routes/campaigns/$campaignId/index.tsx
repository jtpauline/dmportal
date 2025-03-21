import { useParams, Outlet, Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { CampaignManager } from "~/modules/campaign/campaign-core";
import { Campaign } from "~/modules/campaign/campaign-core";

export default function CampaignDetailPage() {
  const { campaignId } = useParams();
  const [campaign, setCampaign] = useState<Campaign | undefined>(undefined);
  const campaignManager = new CampaignManager();

  useEffect(() => {
    async function loadCampaign() {
      if (campaignId) {
        const fetchedCampaign = await campaignManager.fetchCampaignById(campaignId);
        setCampaign(fetchedCampaign);
      }
    }
    loadCampaign();
  }, [campaignId]);

  if (!campaign) {
    return <div>Loading campaign...</div>;
  }

  return (
    <div className="campaign-detail">
      <h1>{campaign.name}</h1>
      <p>{campaign.description}</p>
      
      <nav className="campaign-sections">
        <Link to={`/campaigns/${campaignId}/characters`}>Characters</Link>
        <Link to={`/campaigns/${campaignId}/encounters`}>Encounters</Link>
        <Link to={`/campaigns/${campaignId}/monsters`}>Monsters</Link>
        <Link to={`/campaigns/${campaignId}/initiatives`}>Initiatives</Link>
      </nav>

      <Outlet context={{ campaign, campaignManager }} />
    </div>
  );
}
