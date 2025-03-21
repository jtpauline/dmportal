import { CampaignManager } from '~/modules/campaigns';

export function CampaignList() {
  const campaigns = CampaignManager.getAllCampaigns();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => (
        <div 
          key={campaign.id} 
          className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold mb-2">{campaign.name}</h2>
          <p className="text-gray-600">{campaign.description}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Created: {campaign.createdAt.toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
