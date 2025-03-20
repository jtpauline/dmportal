import React, { useState, useEffect } from 'react';
import { SpellInteractionAdvancedMLPredictor } from '../modules/utils/spell-interaction-ml-advanced-predictor';

export const SpellInteractionMLVisualization: React.FC = () => {
  const [datasetStats, setDatasetStats] = useState({
    totalDataPoints: 0,
    uniqueSpellSchools: [],
    uniqueTerrains: []
  });

  useEffect(() => {
    const stats = SpellInteractionAdvancedMLPredictor.getTrainingDatasetStats();
    setDatasetStats(stats);
  }, []);

  return (
    <div className="spell-interaction-ml-visualization bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        Spell Interaction ML Training Dataset Insights
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-medium mb-2">Total Training Data Points</h3>
          <p className="text-3xl font-bold text-blue-600">
            {datasetStats.totalDataPoints}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded">
          <h3 className="font-medium mb-2">Unique Spell Schools</h3>
          <ul className="list-disc list-inside text-green-700">
            {datasetStats.uniqueSpellSchools.map(school => (
              <li key={school}>{school}</li>
            ))}
          </ul>
        </div>

        <div className="bg-purple-50 p-4 rounded">
          <h3 className="font-medium mb-2">Unique Terrain Types</h3>
          <ul className="list-disc list-inside text-purple-700">
            {datasetStats.uniqueTerrains.map(terrain => (
              <li key={terrain}>{terrain}</li>
            ))}
          </ul>
        </div>

        <div className="bg-yellow-50 p-4 rounded col-span-full">
          <h3 className="font-medium mb-2">Dataset Visualization</h3>
          <div className="flex space-x-4">
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => {
                // Placeholder for future visualization actions
                console.log('Visualize dataset');
              }}
            >
              Visualize Dataset
            </button>
            <button 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => {
                // Placeholder for future training actions
                console.log('Retrain Model');
              }}
            >
              Retrain Model
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
