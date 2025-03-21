import { Form, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { CampaignManager } from "~/modules/campaign/campaign-core";

export default function NewCampaignPage() {
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const navigate = useNavigate();
  const campaignManager = new CampaignManager();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCampaign = campaignManager.createCampaign({
      name: campaignName,
      description: campaignDescription,
      characters: [],
      encounters: [],
      narrativeContext: {
        overarchingStory: "",
        majorPlotPoints: [],
        currentChapter: 1
      }
    });

    // Navigate to the newly created campaign
    navigate(`/campaigns/${newCampaign.id}`);
  };

  return (
    <div className="new-campaign-form">
      <h2>Create New Campaign</h2>
      <Form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Campaign Name" 
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          required 
        />
        <textarea 
          placeholder="Campaign Description" 
          value={campaignDescription}
          onChange={(e) => setCampaignDescription(e.target.value)}
        />
        <button type="submit">Create Campaign</button>
      </Form>
    </div>
  );
}
