import { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { CampaignManager } from "~/modules/campaign/campaign-core";

export const meta: MetaFunction = () => {
  return [
    { title: "Campaigns - DM Platform" },
    { name: "description", content: "Browse and manage your campaigns" }
  ];
};

export async function loader() {
  const campaignManager = new CampaignManager();
  const campaigns = campaignManager.listCampaigns();
  return { campaigns };
}

export default function CampaignsIndex() {
  const { campaigns } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Campaigns</h1>
      
      {campaigns.length === 0 ? (
        <p className="text-gray-600">No campaigns created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign) => (
            <div 
              key={campaign.id} 
              className="bg-white shadow rounded p-4 hover:shadow-lg transition-shadow"
            >
              <Link to={`/campaigns/${campaign.id}`}>
                <h2 className="text-xl font-semibold mb-2">{campaign.name}</h2>
                <p className="text-gray-600">{campaign.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  Created: {typeof campaign.createdAt === 'string' 
                    ? new Date(campaign.createdAt).toLocaleDateString() 
                    : campaign.createdAt.toLocaleDateString()}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <Link 
          to="/campaigns/new" 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create New Campaign
        </Link>
      </div>
    </div>
  );
}
