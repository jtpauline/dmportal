import React, { useState } from 'react';
import useCampaignStore from '~/stores/campaign-store';
import Button from './ui/Button';
import Card from './ui/Card';
import Modal from './ui/Modal';
import Input from './ui/Input';

const CampaignList: React.FC = () => {
  const { campaigns, addCampaign, removeCampaign } = useCampaignStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: '', description: '' });

  const handleAddCampaign = () => {
    if (newCampaign.name) {
      addCampaign({
        id: Date.now().toString(),
        name: newCampaign.name,
        description: newCampaign.description
      });
      setNewCampaign({ name: '', description: '' });
      setIsModalOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Campaigns</h1>
      
      <Button 
        onClick={() => setIsModalOpen(true)}
        className="mb-4"
      >
        Create New Campaign
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map(campaign => (
          <Card key={campaign.id} variant="elevated">
            <h2 className="text-xl font-semibold mb-2">{campaign.name}</h2>
            <p className="text-gray-600 mb-4">{campaign.description}</p>
            <div className="flex space-x-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => {/* Edit logic */}}
              >
                Edit
              </Button>
              <Button 
                variant="danger" 
                size="sm"
                onClick={() => removeCampaign(campaign.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Create New Campaign"
      >
        <div className="space-y-4">
          <Input 
            label="Campaign Name"
            value={newCampaign.name}
            onChange={(e) => setNewCampaign({
              ...newCampaign, 
              name: e.target.value
            })}
            placeholder="Enter campaign name"
            required
          />
          <Input 
            label="Description"
            value={newCampaign.description}
            onChange={(e) => setNewCampaign({
              ...newCampaign, 
              description: e.target.value
            })}
            placeholder="Optional campaign description"
          />
          <div className="flex justify-end space-x-2">
            <Button 
              variant="secondary" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleAddCampaign}
            >
              Create Campaign
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CampaignList;
