import { useParams } from '@remix-run/react';

export default function CampaignCharactersIndex() {
  const { campaignId } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Characters for Campaign {campaignId}</h1>
      <p>Select or create a character for this campaign.</p>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="p-4 bg-red-100 text-red-800">
      <h1 className="text-xl font-bold">Error Loading Characters</h1>
      <p>Unable to load characters for this campaign. Please try again later.</p>
    </div>
  );
}
