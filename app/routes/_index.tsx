import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "DM Platform" },
    { name: "description", content: "Welcome to the D&D Campaign Management Platform" }
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to DM Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your comprehensive D&D Campaign Management Solution
        </p>
        <div className="space-x-4">
          <Link 
            to="/campaigns" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            View Campaigns
          </Link>
          <Link 
            to="/characters" 
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Manage Characters
          </Link>
        </div>
      </div>
    </div>
  );
}
