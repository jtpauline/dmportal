import { useOutletContext } from '@remix-run/react';

export default function CampaignOverviewRoute() {
  const { campaign } = useOutletContext();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Campaign Details</h2>
        <p>Name: {campaign.name}</p>
        <p>Status: {campaign.status}</p>
        <p>Difficulty: {campaign.difficulty}</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Campaign Statistics</h2>
        <div className="grid grid-cols-2 gap-2">
          <div>Characters: {campaign.characters.length}</div>
          <div>Encounters: {campaign.encounters.length}</div>
          <div>Notes: {campaign.notes.length}</div>
          <div>Locations: {campaign.locations.length}</div>
        </div>
      </div>
    </div>
  );
}
