import React from 'react';
import { Link } from '@remix-run/react';

export default function CharacterDetailIndex() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Character Management</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Link 
          to="spell-casting" 
          className="bg-blue-100 hover:bg-blue-200 p-6 rounded-lg shadow-md transition-colors"
        >
          <h2 className="text-xl font-semibold mb-4">Spell Casting</h2>
          <p className="text-gray-700">Manage and analyze spell capabilities</p>
        </Link>

        <Link 
          to="spell-combos" 
          className="bg-green-100 hover:bg-green-200 p-6 rounded-lg shadow-md transition-colors"
        >
          <h2 className="text-xl font-semibold mb-4">Spell Combinations</h2>
          <p className="text-gray-700">Explore and create spell synergies</p>
        </Link>

        <Link 
          to="spell-preparation" 
          className="bg-purple-100 hover:bg-purple-200 p-6 rounded-lg shadow-md transition-colors"
        >
          <h2 className="text-xl font-semibold mb-4">Spell Preparation</h2>
          <p className="text-gray-700">Prepare and optimize spell lists</p>
        </Link>

        <Link 
          to="encounter-narrative" 
          className="bg-red-100 hover:bg-red-200 p-6 rounded-lg shadow-md transition-colors"
        >
          <h2 className="text-xl font-semibold mb-4">Encounter Narrative</h2>
          <p className="text-gray-700">Generate dynamic encounter stories</p>
        </Link>

        <Link 
          to="encounter-design" 
          className="bg-yellow-100 hover:bg-yellow-200 p-6 rounded-lg shadow-md transition-colors"
        >
          <h2 className="text-xl font-semibold mb-4">Encounter Design</h2>
          <p className="text-gray-700">Create and analyze encounters</p>
        </Link>

        <Link 
          to="spell-synergies" 
          className="bg-indigo-100 hover:bg-indigo-200 p-6 rounded-lg shadow-md transition-colors"
        >
          <h2 className="text-xl font-semibold mb-4">Spell Synergies</h2>
          <p className="text-gray-700">Discover magical interaction patterns</p>
        </Link>
      </div>
    </div>
  );
}
