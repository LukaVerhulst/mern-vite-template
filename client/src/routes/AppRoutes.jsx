import React from 'react'
import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
{/*
import AdminLayout from "../layouts/AdminLayout";
*/}
{/*
import Home from "../pages/Home";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import NotFound from "../pages/NotFound";
*/}
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Public routes */}
      {/* <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Route> */}

      {/* Protected admin routes */}
      {/* <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
      </Route> */}

      {/* 404 */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AppRoutes;
