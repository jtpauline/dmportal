import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { SpellInteractionAdvancedMLPredictor } from '../../../../modules/utils/spell-interaction-ml-advanced-predictor';
import { SpellInteractionMLVisualization } from '../../../../components/SpellInteractionMLVisualization';

export const loader: LoaderFunction = async () => {
  const datasetStats = SpellInteractionAdvancedMLPredictor.getTrainingDatasetStats();
  
  return json({
    datasetStats,
    timestamp: Date.now()
  });
};

export default function SpellMLInsightsPage() {
  const { datasetStats, timestamp } = useLoaderData();

  return (
    <div className="spell-ml-insights-page container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">
        Spell Interaction Machine Learning Insights
      </h1>

      <SpellInteractionMLVisualization />

      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">
          Advanced ML Prediction Insights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-medium mb-2">Prediction Capabilities</h3>
            <ul className="list-disc list-inside text-blue-700">
              <li>Spell Compatibility Scoring</li>
              <li>Effectiveness Rating</li>
              <li>Unexpected Result Probability</li>
              <li>Synergy Combination Ranking</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded">
            <h3 className="font-medium mb-2">Contextual Modifiers</h3>
            <ul className="list-disc list-inside text-green-700">
              <li>Terrain Impact</li>
              <li>Party Composition Influence</li>
              <li>Combat Difficulty Adjustment</li>
            </ul>
          </div>

          <div className="bg-purple-50 p-4 rounded col-span-full">
            <h3 className="font-medium mb-2">Last Updated</h3>
            <p className="text-purple-700">
              {new Date(timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
