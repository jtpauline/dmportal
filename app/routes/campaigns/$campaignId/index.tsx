import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, Link, useParams, useLocation } from "@remix-run/react";
import { CampaignOrchestrator } from "~/modules/campaign/campaign-orchestrator";
import { CampaignManager } from "~/modules/campaign/campaign-core";

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    console.log("Loader Params:", params);
    
    const campaignManager = new CampaignManager();
    const campaignOrchestrator = new CampaignOrchestrator();

    // Validate campaign ID
    if (!params.campaignId) {
      console.error("No campaign ID provided");
      throw new Response("Campaign ID is required", { status: 400 });
    }

    // Fetch campaign data
    const campaign = await campaignManager.fetchCampaignById(params.campaignId);
    
    // If no campaign found, throw a not found response
    if (!campaign) {
      console.error(`Campaign with ID ${params.campaignId} not found`);
      throw new Response("Campaign not found", { status: 404 });
    }

    // Generate dynamic campaign insights
    const campaignDynamics = campaignOrchestrator.orchestrateCampaignDynamics(campaign);

    return json({
      campaign,
      campaignDynamics
    });
  } catch (error) {
    console.error("Campaign Detail Loader Error:", error);
    throw new Response("Error loading campaign", { status: 500 });
  }
}

export default function CampaignDetailPage() {
  const { campaign, campaignDynamics } = useLoaderData<typeof loader>();
  const params = useParams();
  const location = useLocation();

  // Extensive logging for debugging
  console.log("Current Location:", location);
  console.log("Campaign ID from params:", params.campaignId);
  console.log("Loaded Campaign:", campaign);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{campaign.name}</h1>
      
      <section className="grid grid-cols-3 gap-4">
        {/* Campaign Overview */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Campaign Overview</h2>
          <p>{campaign.description}</p>
          <div className="mt-2">
            <p>Current Chapter: {campaign.narrativeContext.currentChapter}</p>
            <p>Average Party Level: {campaign.progressionData.averagePartyLevel}</p>
          </div>
        </div>

        {/* Narrative Insights */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Narrative Progression</h2>
          <ul>
            {campaignDynamics.narrativeProgression.updatedNarrativeContext.majorPlotPoints.map((plotPoint, index) => (
              <li key={index}>{plotPoint}</li>
            ))}
          </ul>
        </div>

        {/* Campaign Analytics */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Campaign Analytics</h2>
          <div>
            <p>Completed Encounters: {campaign.progressionData.completedEncounters}</p>
            <p>Total XP: {campaign.progressionData.totalExperiencePoints}</p>
          </div>
        </div>
      </section>

      {/* Navigation Section */}
      <section className="mt-6 grid grid-cols-4 gap-4">
        <Link 
          to={`/campaigns/${campaign.id}/characters`} 
          className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600 text-center"
        >
          Manage Characters
        </Link>
        <Link 
          to={`/campaigns/${campaign.id}/encounters`} 
          className="bg-green-500 text-white p-4 rounded hover:bg-green-600 text-center"
        >
          Encounter Management
        </Link>
        <Link 
          to={`/campaigns/${campaign.id}/spells`} 
          className="bg-purple-500 text-white p-4 rounded hover:bg-purple-600 text-center"
        >
          Spell Interactions
        </Link>
        <Link 
          to={`/campaigns/${campaign.id}/analytics`} 
          className="bg-red-500 text-white p-4 rounded hover:bg-red-600 text-center"
        >
          Campaign Analytics
        </Link>
      </section>
    </div>
  );
}

// Comprehensive Error Boundary
export function ErrorBoundary() {
  const params = useParams();
  const location = useLocation();
  
  return (
    <div className="container mx-auto p-4 text-red-600">
      <h1 className="text-2xl font-bold">Campaign Not Found</h1>
      <p>Current Location: {location.pathname}</p>
      <p>Campaign ID from URL: "{params.campaignId}"</p>
      <p>The campaign could not be found or loaded.</p>
      <p>Possible reasons:</p>
      <ul>
        <li>Invalid campaign ID</li>
        <li>Campaign may have been deleted</li>
        <li>Routing configuration issue</li>
      </ul>
    </div>
  );
}
