import { useParams } from '@remix-run/react';

export default function CampaignAnalyticsIndex() {
  const { campaignId } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Campaign Analytics for {campaignId}</h1>
      <p>Detailed insights and statistics for this campaign.</p>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="p-4 bg-red-100 text-red-800">
      <h1 className="text-xl font-bold">Error Loading Analytics</h1>
      <p>Unable to load campaign analytics. Please try again later.</p>
    </div>
  );
}
