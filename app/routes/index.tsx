import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix App" },
    { name: "description", content: "Welcome to Remix" }
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">
        Hello from Remix
      </h1>
    </div>
  );
}
