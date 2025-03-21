import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { CampaignList } from "~/components/CampaignList";

export const meta: MetaFunction = () => {
  return [
    { title: "Campaigns - DM Platform" },
    { name: "description", content: "Browse and manage your campaigns" }
  ];
};

export default function CampaignsIndex() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Campaigns</h1>
      <CampaignList />
      <div className="mt-4">
        <Link 
          to="/campaigns/new" 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create New Campaign
        </Link>
      </div>
    </div>
  );
}
