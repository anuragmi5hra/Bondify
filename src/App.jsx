import { Routes, Route } from "react-router-dom";

import Auth from "./pages/Auth";
import CreateProfile from "./pages/CreateProfile";
import Dashboard from "./pages/Dashboard";
import BondSummary from "./pages/BondSummary";
import Charity from "./pages/Charity";
import EditProfile from "./pages/EditProfile";
import SendPoints from "./pages/SendPoints";
import CreateBonds from "./pages/CreateBonds";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />

      <Route
        path="/create-profile"
        element={
          <ProtectedRoute>
            <CreateProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-bonds"
        element={
          <ProtectedRoute>
            <CreateBonds />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/bonds"
        element={
          <ProtectedRoute>
            <BondSummary />
          </ProtectedRoute>
        }
      />

      <Route
        path="/charity"
        element={
          <ProtectedRoute>
            <Charity />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-profile"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/send"
        element={
          <ProtectedRoute>
            <SendPoints />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}