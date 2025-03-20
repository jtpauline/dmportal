import { useOutletContext } from '@remix-run/react';

export default function CampaignEncountersRoute() {
  const { campaign } = useOutletContext();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Campaign Encounters</h2>
      <div className="grid grid-cols-3 gap-4">
        {campaign.encounters.map(encounter => (
          <div key={encounter.id} className="bg-white shadow rounded p-4">
            <h3 className="font-semibold">{encounter.name}</h3>
            <p>Difficulty: {encounter.difficulty}</p>
            <p>Monsters: {encounter.monsters.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
