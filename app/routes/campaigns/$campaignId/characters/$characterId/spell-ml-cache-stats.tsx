import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { SpellInteractionMLCache } from '../../../../modules/utils/spell-interaction-ml-cache';

export const loader: LoaderFunction = async () => {
  const cacheStats = SpellInteractionMLCache.getCacheStats();
  return json(cacheStats);
};

export default function SpellMLCacheStatsPage() {
  const { totalEntries, activeEntries, oldestEntryAge } = useLoaderData();

  // Convert milliseconds to human-readable format
  const formatAge = (ageMs: number) => {
    const hours = Math.floor(ageMs / (1000 * 60 * 60));
    const minutes = Math.floor((ageMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} hours, ${minutes} minutes`;
  };

  return (
    <div className="spell-ml-cache-stats-page container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">
        Spell Interaction ML Cache Statistics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Total Entries</h2>
          <p className="text-4xl font-bold text-blue-600">{totalEntries}</p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Active Entries</h2>
          <p className="text-4xl font-bold text-green-600">{activeEntries}</p>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Oldest Entry Age</h2>
          <p className="text-4xl font-bold text-purple-600">
            {formatAge(oldestEntryAge)}
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">
          Cache Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-yellow-50 p-4 rounded">
            <h3 className="font-medium mb-2">Cache Behavior</h3>
            <ul className="list-disc list-inside text-yellow-700">
              <li>Entries expire after 24 hours</li>
              <li>Automatic cache cleanup</li>
              <li>Intelligent caching strategy</li>
            </ul>
          </div>

          <div className="bg-red-50 p-4 rounded">
            <h3 className="font-medium mb-2">Performance Insights</h3>
            <ul className="list-disc list-inside text-red-700">
              <li>Reduces redundant ML computations</li>
              <li>Improves prediction response time</li>
              <li>Minimizes computational overhead</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
