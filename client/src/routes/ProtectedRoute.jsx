{/* 
    Example for a protected route
    Protected routes are auth-protected pages, ex. /login
    We do this to split logic up to not make one complex routes file
*/}

import React from 'react'
import { Navigate } from "react-router-dom";
{/* import { useAuth } from "../hooks/useAuth"; */}

const ProtectedRoute = ({ children }) => {
  {/* const { user } = useAuth(); */}

  {/* if (!user) {
    return <Navigate to="/login" replace />;
  } */}

  return children;
};

export default ProtectedRoute;
