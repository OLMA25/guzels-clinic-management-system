
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();

  // If authenticated, redirect to dashboard, otherwise redirect to login
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default Index;
