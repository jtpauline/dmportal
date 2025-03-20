import { useState } from 'react';
import { json } from '@remix-run/node';
import { useLoaderData, Outlet, Link } from '@remix-run/react';
import { CampaignManager } from '~/modules/campaigns';

export const loader = async ({ params }) => {
  const campaignManager = new CampaignManager();
  const campaign = campaignManager.getCampaignById(params.campaignId);

  if (!campaign) {
    throw new Response('Campaign not found', { status: 404 });
  }

  return json({ campaign });
};

export default function CampaignDetailLayout() {
  const { campaign } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{campaign.name}</h1>

      {/* Campaign Navigation */}
      <div className="flex mb-6">
        <Link 
          to={`/campaigns/${campaign.id}/overview`} 
          className={`px-4 py-2 ${activeTab === 'overview' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Overview
        </Link>
        <Link 
          to={`/campaigns/${campaign.id}/characters`} 
          className={`px-4 py-2 ${activeTab === 'characters' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Characters
        </Link>
        <Link 
          to={`/campaigns/${campaign.id}/encounters`} 
          className={`px-4 py-2 ${activeTab === 'encounters' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Encounters
        </Link>
      </div>

      {/* Dynamic Content Area */}
      <Outlet context={{ campaign, activeTab }} />
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="container mx-auto p-6 bg-red-100">
      <h1 className="text-2xl font-bold text-red-800">Campaign Not Found</h1>
      <p>The campaign you are looking for does not exist.</p>
    </div>
  );
}
