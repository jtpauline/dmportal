import { useLoaderData } from "@remix-run/react";
import { CampaignCore, Campaign } from "~/modules/campaign/campaign-core";

export const loader = async () => {
  // Example of creating a campaign
  const newCampaign = CampaignCore.createCampaign(
    "Epic Adventure", 
    "A thrilling journey through mystical lands"
  );

  return {
    campaigns: [newCampaign]
  };
};

export default function CampaignsPage() {
  const { campaigns } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Campaigns</h1>
      {campaigns.map((campaign) => (
        <div key={campaign.id} className="border p-2 mb-2">
          <h2>{campaign.name}</h2>
          <p>{campaign.description}</p>
        </div>
      ))}
    </div>
  );
}
