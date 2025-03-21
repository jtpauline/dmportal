import { useParams } from '@remix-run/react';

export default function CampaignEncountersIndex() {
  const { campaignId } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Encounters for Campaign {campaignId}</h1>
      <p>View and manage encounters for this campaign.</p>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="p-4 bg-red-100 text-red-800">
      <h1 className="text-xl font-bold">Error Loading Encounters</h1>
      <p>Unable to load encounters for this campaign. Please try again later.</p>
    </div>
  );
}
