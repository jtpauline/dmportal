import { Link, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { CampaignManager } from '~/modules/campaigns';

export const loader = async () => {
  const campaignManager = new CampaignManager();
  const campaigns = campaignManager.getAllCampaigns();
  const analytics = campaignManager.getCampaignAnalytics();

  return json({ 
    campaigns, 
    analytics 
  });
};

export default function CampaignListRoute() {
  const { campaigns, analytics } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Campaigns</h1>
        <Link to="/campaigns/new" className="btn btn-primary">
          Create New Campaign
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold">{campaign.name}</h2>
            <p className="text-gray-600">{campaign.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <Link 
                to={`/campaigns/${campaign.id}`} 
                className="text-blue-500 hover:underline"
              >
                View Campaign
              </Link>
            </div>
          </div>
        ))}
      </div>

      {campaigns.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No campaigns found. Create your first campaign!</p>
        </div>
      )}
    </div>
  );
}
