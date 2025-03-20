import { Link, useOutletContext } from '@remix-run/react';

export default function CampaignCharactersRoute() {
  const { campaign } = useOutletContext();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Campaign Characters</h2>
      <div className="grid grid-cols-3 gap-4">
        {campaign.characters.map(character => (
          <Link 
            key={character.id} 
            to={`/campaigns/${campaign.id}/characters/${character.id}`}
            className="bg-white shadow rounded p-4"
          >
            <h3 className="font-semibold">{character.name}</h3>
            <p>Level: {character.level}</p>
            <p>Class: {character.class}</p>
          </Link>
        ))}
      </div>
      <Link 
        to={`/campaigns/${campaign.id}/characters/new`} 
        className="btn btn-primary mt-4"
      >
        Create New Character
      </Link>
    </div>
  );
}
