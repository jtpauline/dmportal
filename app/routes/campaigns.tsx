import { Outlet } from "@remix-run/react";

export default function CampaignsLayout() {
  return (
    <div className="campaigns-layout">
      <Outlet />
    </div>
  );
}

export function meta() {
  return [
    { title: "Campaigns" },
    { name: "description", content: "Manage your D&D campaigns" }
  ];
}

// Remove any route-specific loader or actions to prevent conflicts
