// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layouts & Guards
import PublicLayout from "./components/PublicLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PrivateLayout from "./components/PrivateLayout";
import RoleGuard from "./components/RoleGuard"; // NEW: Import the Bouncer

// Public Pages
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Services from "./pages/public/Services";
import Contact from "./pages/public/Contact";
import Donate from "./pages/public/Donate";
import Apply from "./pages/public/Apply";
import Login from "./pages/auth/Login";
import Unauthorized from "./pages/public/Unauthorized"; // NEW: Import the Black Screen

// Private/Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import StaffManager from "./pages/admin/StaffManager";
import Inventory from "./pages/admin/Inventory";
import Campaigns from "./pages/admin/Campaigns";
import CaseManager from "./pages/admin/CaseManager";
import CreateRequest from "./pages/admin/CreateRequest";
import Applications from "./pages/admin/Applications";
import MyRequests from "./pages/admin/MyRequests";
import Events from "./pages/admin/Events";
import CreateEvent from "./pages/admin/CreateEvent";

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
          <Route path="/apply" element={<Apply />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* 403 Unauthorized Route - Standalone to ensure full black screen */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* === PRIVATE ADMIN PAGES === */}
        <Route element={<ProtectedRoute />}>
          <Route element={<PrivateLayout />}>
            {/* Routes Accessible to ALL Logged-in Users */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-request" element={<CreateRequest />} />
            <Route path="/my-requests" element={<MyRequests />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/events" element={<Events />} />

            {/* 🔥 STRICT ROUTES: Locked to Admins and Lead Devs Only */}
            <Route
              element={<RoleGuard allowedRoles={["Lead Developer", "Admin"]} />}
            >
              <Route path="/staff" element={<StaffManager />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/create-event" element={<CreateEvent />} />
              {/* <Route path="/campaigns" element={<Campaigns />} /> */}
              <Route path="/cases" element={<CaseManager />} />{" "}
              {/* Handle Requests */}
              <Route path="/applications" element={<Applications />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
