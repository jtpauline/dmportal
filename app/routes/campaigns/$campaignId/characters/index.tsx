import { useOutletContext, Link } from "@remix-run/react";
import { Campaign, CampaignManager } from "~/modules/campaign/campaign-core";

export default function CampaignCharactersPage() {
  const { campaign, campaignManager } = useOutletContext<{
    campaign: Campaign;
    campaignManager: CampaignManager;
  }>();

  return (
    <div className="campaign-characters">
      <h2>Characters in {campaign.name}</h2>
      {campaign.characters.length === 0 ? (
        <p>No characters in this campaign yet.</p>
      ) : (
        <ul>
          {campaign.characters.map(character => (
            <li key={character.id}>
              <Link to={`/campaigns/${campaign.id}/characters/${character.id}`}>
                {character.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link to={`/campaigns/${campaign.id}/characters/new`}>
        Add New Character
      </Link>
    </div>
  );
}
