import React, { useState, useEffect } from 'react';
import { SpellInteractionMLTrainingOptimizer } from '../modules/utils/spell-interaction-ml-training-optimizer';

interface OptimizationReportProps {
  trainingDataset: any[];  // Replace 'any' with actual MLTrainingDataPoint type
}

const SpellInteractionDatasetOptimizationReport: React.FC<OptimizationReportProps> = ({ 
  trainingDataset 
}) => {
  const [optimizationMetrics, setOptimizationMetrics] = useState(null);
  const [optimizationReport, setOptimizationReport] = useState('');

  useEffect(() => {
    if (trainingDataset && trainingDataset.length > 0) {
      // Analyze dataset
      const metrics = SpellInteractionMLTrainingOptimizer.analyzeTrainingDataset(trainingDataset);
      setOptimizationMetrics(metrics);

      // Generate optimization report
      const report = SpellInteractionMLTrainingOptimizer.exportOptimizationReport(trainingDataset);
      setOptimizationReport(report);
    }
  }, [trainingDataset]);

  const renderMetricsCard = () => {
    if (!optimizationMetrics) return null;

    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-bold mb-2">Dataset Size</h3>
          <p>{optimizationMetrics.datasetSize} data points</p>
        </div>
        <div className="bg-green-50 p-4 rounded">
          <h3 className="font-bold mb-2">Unique Spell Combinations</h3>
          <p>{optimizationMetrics.uniqueSpellCombinations}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded">
          <h3 className="font-bold mb-2">Diversity Score</h3>
          <p>{(optimizationMetrics.diversityScore * 100).toFixed(2)}%</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded">
          <h3 className="font-bold mb-2">Training Efficiency</h3>
          <p>{(optimizationMetrics.trainingEfficiency * 100).toFixed(2)}%</p>
        </div>
      </div>
    );
  };

  const renderOptimizationRecommendations = () => {
    if (!optimizationReport) return null;

    const parsedReport = JSON.parse(optimizationReport);

    return (
      <div className="mt-6 bg-gray-50 p-4 rounded">
        <h3 className="font-bold text-lg mb-3">Optimization Recommendations</h3>
        <ul className="list-disc pl-5">
          {parsedReport.recommendations.map((recommendation, index) => (
            <li key={index} className="mb-2">{recommendation}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="spell-interaction-dataset-optimization-report p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        Spell Interaction Dataset Optimization Report
      </h2>

      {renderMetricsCard()}
      {renderOptimizationRecommendations()}

      <details className="mt-6 bg-gray-100 p-4 rounded">
        <summary className="font-bold cursor-pointer">
          Full Optimization Report
        </summary>
        <pre className="text-xs overflow-x-auto">
          {optimizationReport}
        </pre>
      </details>
    </div>
  );
};

export default SpellInteractionDatasetOptimizationReport;
