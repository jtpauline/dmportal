import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { MLTrainingDataCollector } from '~/modules/utils/ml-training-data-collector';
import { SpellInteractionMLTrainingOptimizer } from '~/modules/utils/spell-interaction-ml-training-optimizer';

export const loader: LoaderFunction = async ({ params }) => {
  // Generate synthetic training data
  const syntheticTrainingData = MLTrainingDataCollector.generateSyntheticTrainingData();

  // Optimize training dataset
  const optimizedDataset = SpellInteractionMLTrainingOptimizer.optimizeTrainingDataset(
    syntheticTrainingData
  );

  // Generate dataset quality report
  const datasetQualityReport = SpellInteractionMLTrainingOptimizer.generateDatasetQualityReport(
    optimizedDataset
  );

  return json({ 
    optimizedDataset,
    datasetQualityReport
  });
};

export default function SpellMLTrainingPage() {
  const { optimizedDataset, datasetQualityReport } = useLoaderData<{
    optimizedDataset: any[];
    datasetQualityReport: {
      totalDataPoints: number;
      interactionTypeDistribution: Record<string, number>;
      uniqueSpellCombinations: number;
      uniqueCharacterClasses: number;
    };
  }>();

  return (
    <div className="spell-ml-training-page p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Spell Interaction Machine Learning Training
      </h1>

      <div className="dataset-quality-report bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Dataset Quality Report</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Total Data Points:</p>
            <p>{datasetQualityReport.totalDataPoints}</p>
          </div>
          
          <div>
            <p className="font-medium">Interaction Type Distribution:</p>
            <ul>
              {Object.entries(datasetQualityReport.interactionTypeDistribution).map(([type, count]) => (
                <li key={type}>
                  {type}: {count}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <p className="font-medium">Unique Spell Combinations:</p>
            <p>{datasetQualityReport.uniqueSpellCombinations}</p>
          </div>
          
          <div>
            <p className="font-medium">Unique Character Classes:</p>
            <p>{datasetQualityReport.uniqueCharacterClasses}</p>
          </div>
        </div>
      </div>

      <details className="bg-white rounded-lg shadow-md">
        <summary className="p-4 cursor-pointer font-semibold">
          View Optimized Training Dataset
        </summary>
        <pre className="p-4 overflow-x-auto text-xs bg-gray-100">
          {JSON.stringify(optimizedDataset, null, 2)}
        </pre>
      </details>
    </div>
  );
}
