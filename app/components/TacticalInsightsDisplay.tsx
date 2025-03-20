import React from 'react';
import { Card } from './ui/Card';

interface TacticalInsightsDisplayProps {
  tacticalInsights: string[];
  potentialChallenges: string[];
}

export function TacticalInsightsDisplay({ 
  tacticalInsights, 
  potentialChallenges 
}: TacticalInsightsDisplayProps) {
  return (
    <Card>
      <div className="grid grid-cols-1 gap-4">
        <section>
          <h4 className="font-bold text-lg mb-2">Tactical Insights</h4>
          <ul className="list-disc list-inside">
            {tacticalInsights.map((insight, index) => (
              <li key={index} className="mb-1">{insight}</li>
            ))}
          </ul>
        </section>

        <section>
          <h4 className="font-bold text-lg mb-2">Potential Challenges</h4>
          <ul className="list-disc list-inside text-red-600">
            {potentialChallenges.map((challenge, index) => (
              <li key={index} className="mb-1">{challenge}</li>
            ))}
          </ul>
        </section>
      </div>
    </Card>
  );
}
