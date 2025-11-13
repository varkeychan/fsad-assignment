import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Items from "./pages/Items";
import Requests from "./pages/Requests";
import AdminPanel from "./pages/AdminPanel";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
     <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/items"
    element={
      <ProtectedRoute>
        <Items />
      </ProtectedRoute>
    }
  />

  <Route
    path="/requests"
    element={
      <ProtectedRoute>
        <Requests />
      </ProtectedRoute>
    }
  />

  {/* ✅ Only admin can open Admin Panel */}
  <Route
    path="/admin"
    element={
      <ProtectedRoute role="admin">
        <AdminPanel />
      </ProtectedRoute>
    }
  />

  {/* fallback */}
  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>
    </BrowserRouter>
  );
}
