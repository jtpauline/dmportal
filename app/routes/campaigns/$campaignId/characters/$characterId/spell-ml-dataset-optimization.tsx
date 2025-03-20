import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import SpellInteractionDatasetOptimizationReport from '../../../../components/SpellInteractionDatasetOptimizationReport';
import { SpellInteractionMLTrainer } from '../../../../modules/utils/spell-interaction-ml-training';

export const loader: LoaderFunction = async () => {
  // Export current training dataset
  const trainingDataset = JSON.parse(
    SpellInteractionMLTrainer.exportTrainingDataset()
  ).dataset;

  return json({
    trainingDataset
  });
};

export default function SpellMLDatasetOptimizationPage() {
  const { trainingDataset } = useLoaderData();

  return (
    <div className="spell-ml-dataset-optimization-page p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">
        Spell Interaction ML Dataset Optimization
      </h1>
      
      <SpellInteractionDatasetOptimizationReport 
        trainingDataset={trainingDataset} 
      />
    </div>
  );
}
