import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import CreateProfile from "./pages/CreateProfile";
import Dashboard from "./pages/Dashboard";
import BondSummary from "./pages/BondSummary";
import Charity from "./pages/Charity";
import EditProfile from "./pages/EditProfile";
import SendPoints from "./pages/SendPoints";


export default function App() {
return (
<BrowserRouter>
<Routes>
<Route path="/" element={<Auth />} />
<Route path="/create-profile" element={<CreateProfile />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/bonds" element={<BondSummary />} />
<Route path="/charity" element={<Charity />} />
<Route path="/edit-profile" element={<EditProfile />} />
<Route path="/send" element={<SendPoints />} />
</Routes>
</BrowserRouter>
);
}