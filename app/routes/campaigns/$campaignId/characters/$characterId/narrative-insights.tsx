import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { CharacterNarrativeSystem } from '~/modules/utils/character-narrative-system';
import { NarrativeInteractionSystem } from '~/modules/utils/narrative-interaction-system';
import { Campaign } from '~/modules/campaigns';
import { Character } from '~/modules/characters';

export const loader: LoaderFunction = async ({ params }) => {
  // Fetch campaign and character data
  const campaign = {} as Campaign; // Replace with actual data fetching
  const character = {} as Character; // Replace with actual data fetching

  // Generate narrative insights
  const characterNarrativeForecast = CharacterNarrativeSystem.generateCharacterNarrativeForecast(
    character, 
    campaign
  );

  const narrativeInteractionPrediction = NarrativeInteractionSystem.predictNarrativeInteractionOutcome({
    campaign,
    characters: [character]
  });

  return json({
    characterNarrativeForecast,
    narrativeInteractionPrediction
  });
};

export default function NarrativeInsightsPage() {
  const { 
    characterNarrativeForecast, 
    narrativeInteractionPrediction 
  } = useLoaderData();

  return (
    <div className="narrative-insights">
      <h1>Narrative Insights</h1>
      
      <section className="character-arcs">
        <h2>Potential Character Arcs</h2>
        <ul>
          {characterNarrativeForecast.potentialCharacterArcs.map((arc, index) => (
            <li key={index}>{arc}</li>
          ))}
        </ul>
      </section>

      <section className="personal-challenges">
        <h2>Personal Challenges</h2>
        <ul>
          {characterNarrativeForecast.personalChallenges.map((challenge, index) => (
            <li key={index}>{challenge}</li>
          ))}
        </ul>
      </section>

      <section className="growth-opportunities">
        <h2>Growth Opportunities</h2>
        <ul>
          {characterNarrativeForecast.growthOpportunities.map((opportunity, index) => (
            <li key={index}>{opportunity}</li>
          ))}
        </ul>
      </section>

      <section className="narrative-prediction">
        <h2>Narrative Interaction Prediction</h2>
        <p>Probability of Positive Outcome: {narrativeInteractionPrediction.probabilityOfPositiveOutcome.toFixed(2)}</p>
        
        <h3>Potential Narrative Trajectories</h3>
        <ul>
          {narrativeInteractionPrediction.potentialNarrativeTrajectories.map((trajectory, index) => (
            <li key={index}>{trajectory}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
