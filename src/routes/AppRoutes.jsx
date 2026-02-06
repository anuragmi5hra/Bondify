import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import CreateProfile from "../pages/Profile/CreateProfile";
import EditProfile from "../pages/Profile/EditProfile";
import Dashboard from "../pages/Dashboard";
import BondSummary from "../pages/BondSummary";
import CharityPage from "../pages/Charity";
import SendPoints from "../pages/SendPoints";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/create-profile" element={<CreateProfile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/bond-summary" element={<BondSummary />} />
      <Route path="/charity" element={<CharityPage />} />
      <Route path="/send-points" element={<SendPoints />} />
      <Route path="/edit-profile" element={<EditProfile />} />
    </Routes>
  );
};

export default AppRoutes;
