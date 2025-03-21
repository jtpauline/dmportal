import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "DM Platform - Home" },
    { name: "description", content: "Welcome to the DM Platform" }
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to DM Platform
        </h1>
        <p className="text-xl text-gray-600">
          Your Adventure Management Tool
        </p>
        <div className="mt-6">
          <Link 
            to="/campaigns" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            View Campaigns
          </Link>
        </div>
      </div>
    </div>
  );
}
