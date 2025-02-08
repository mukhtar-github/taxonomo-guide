
import React from "react";
import { Nav } from "./Nav";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-secondary">
      <Nav />
      <main className="container mx-auto px-4 py-8 animate-fadeIn">
        {children}
      </main>
    </div>
  );
};
