import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { NarrativeInteractionMLPredictor } from '~/modules/utils/narrative-interaction-ml-predictor';
import { Campaign } from '~/modules/campaigns';
import { Character } from '~/modules/characters';

export const loader: LoaderFunction = async ({ params }) => {
  // Fetch campaign and character data
  const campaign = {} as Campaign; // Replace with actual data fetching
  const character = {} as Character; // Replace with actual data fetching

  // Generate ML-powered narrative insights
  const narrativeInteractionInsights = NarrativeInteractionMLPredictor.generateNarrativeInteractionInsights(
    campaign,
    [character]
  );

  // Evaluate model performance
  const modelPerformance = NarrativeInteractionMLPredictor.evaluateModelPerformance();

  return json({
    narrativeInteractionInsights,
    modelPerformance
  });
};

export default function MLNarrativeInsightsPage() {
  const { 
    narrativeInteractionInsights, 
    modelPerformance 
  } = useLoaderData();

  return (
    <div className="ml-narrative-insights">
      <h1>Machine Learning Narrative Insights</h1>
      
      <section className="narrative-complexity">
        <h2>Narrative Complexity</h2>
        <p>Complexity Score: {narrativeInteractionInsights.narrativeComplexityScore.toFixed(2)}</p>
      </section>

      <section className="potential-trajectories">
        <h2>Potential Narrative Trajectories</h2>
        <ul>
          {narrativeInteractionInsights.potentialNarrativeTrajectories.map((trajectory, index) => (
            <li key={index}>{trajectory}</li>
          ))}
        </ul>
      </section>

      <section className="character-interaction-dynamics">
        <h2>Character Interaction Dynamics</h2>
        <ul>
          {narrativeInteractionInsights.characterInteractionDynamics.map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </ul>
      </section>

      <section className="model-performance">
        <h2>Model Performance</h2>
        <dl>
          <dt>Accuracy Score</dt>
          <dd>{modelPerformance.accuracyScore.toFixed(2)}</dd>
          
          <dt>Prediction Variance</dt>
          <dd>{modelPerformance.predictionVariance.toFixed(2)}</dd>
          
          <dt>Complexity Adaptability</dt>
          <dd>{modelPerformance.complexityAdaptability.toFixed(2)}</dd>
        </dl>
      </section>
    </div>
  );
}
