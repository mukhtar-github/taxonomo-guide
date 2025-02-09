
import React from "react";
import { Navigate } from "react-router-dom";
import { Nav } from "./Nav";
import { useAuth } from "@/providers/AuthProvider";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Nav />
      <main className="container mx-auto px-4 py-8 animate-fadeIn">
        {children}
      </main>
    </div>
  );
};
