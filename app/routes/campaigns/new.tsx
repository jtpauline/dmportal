import { ActionFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { CampaignManager } from "~/modules/campaign/campaign-core";
import Button from "~/components/ui/Button";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Create New Campaign - DM Platform" },
    { name: "description", content: "Create a new Dungeons & Dragons campaign" }
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get('name')?.toString().trim();
  const description = formData.get('description')?.toString().trim();

  // Basic validation
  if (!name || name.length < 3) {
    return { 
      error: "Campaign name must be at least 3 characters long",
      fields: { name, description }
    };
  }

  // Create campaign with default empty arrays
  const campaignManager = new CampaignManager();
  const newCampaign = campaignManager.createCampaign({ 
    name, 
    description: description || "A new adventure awaits!",
    characters: [],
    encounters: [],
    narrativeContext: {
      overarchingStory: '',
      majorPlotPoints: [],
      currentChapter: 1
    }
  });

  // Redirect to the newly created campaign
  return redirect(`/campaigns/${newCampaign.id}`);
};

export default function NewCampaignPage() {
  const actionData = useActionData<typeof action>();
  const [name, setName] = useState(actionData?.fields?.name || '');
  const [description, setDescription] = useState(actionData?.fields?.description || '');

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Create New Campaign</h1>
      
      <Form method="post" className="space-y-4">
        {actionData?.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            {actionData.error}
          </div>
        )}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Campaign Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
            placeholder="Enter campaign name"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Campaign Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
            placeholder="Describe your campaign (optional)"
            rows={4}
          />
        </div>
        
        <div className="flex space-x-4">
          <Button type="submit" variant="primary">
            Create Campaign
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}
