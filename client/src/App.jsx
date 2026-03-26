// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layouts
import PublicLayout from "./components/PublicLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PrivateLayout from "./components/PrivateLayout";

// Public Pages
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Services from "./pages/public/Services";
import Contact from "./pages/public/Contact";
import Donate from "./pages/public/Donate";
import Apply from "./pages/public/Apply"; // NEW: Consolidated Apply page
import Login from "./pages/auth/Login";

// Private/Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import StaffManager from "./pages/admin/StaffManager";
import Inventory from "./pages/admin/Inventory";
import Campaigns from "./pages/admin/Campaigns";
import CaseManager from "./pages/admin/CaseManager";
import CreateRequest from "./pages/admin/CreateRequest";
import Applications from "./pages/admin/Applications"; // NEW: Application processing queue

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

        {/* === PRIVATE ADMIN PAGES === */}
        <Route element={<ProtectedRoute />}>
          <Route element={<PrivateLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/staff" element={<StaffManager />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/cases" element={<CaseManager />} />
            
            <Route path="/create-request" element={<CreateRequest />} />
            <Route path="/applications" element={<Applications />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
