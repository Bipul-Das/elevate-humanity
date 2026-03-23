// client/src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layouts
import PublicLayout from "./components/PublicLayout"; // <--- Import this
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/auth/Login";
import Dashboard from "./pages/admin/Dashboard";
import Inventory from "./pages/admin/Inventory";
import Campaigns from "./pages/admin/Campaigns";
import CaseManager from "./pages/admin/CaseManager";
import Home from "./pages/public/Home";
import Donate from "./pages/public/Donate";
import VolunteerApply from "./pages/public/VolunteerApply";
import About from "./pages/public/About";
import Services from "./pages/public/Services";
import Contact from "./pages/public/Contact";
import MembershipApply from "./pages/public/MembershipApply";
import VolunteerManager from "./pages/admin/VolunteerManager";
import StaffManager from './pages/admin/StaffManager'; // Import new page
import PrivateLayout from './components/PrivateLayout'; // Import Layout



function App() {
  return (
    <Router>
      <Toaster position="top-right" />

      <Routes>
        {/* === PUBLIC PAGES (Wrapped in Layout) === */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/donate" element={<Donate />} />
          <Route path="/volunteer-apply" element={<VolunteerApply />} />
          <Route path="/membership-apply" element={<MembershipApply />} />

          <Route path="/login" element={<Login />} />
        </Route>

        {/* === PRIVATE ADMIN PAGES === */}
        <Route element={<ProtectedRoute />}>
          <Route element={<PrivateLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/staff" element={<StaffManager />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/cases" element={<CaseManager />} />
            <Route path="/volunteers" element={<VolunteerManager />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
