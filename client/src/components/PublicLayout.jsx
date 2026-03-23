// client/src/components/PublicLayout.jsx
import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";

const PublicLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* 1. The Header */}
      <PublicNavbar />

      {/* 2. The Page Content (Home, Donate, etc. renders here) */}
      <div className="flex-grow-1">
        <Outlet />
      </div>

      {/* 3. The Shared Footer */}
      <footer className="bg-dark text-white text-center py-4 mt-auto">
        <div className="container">
          <p className="mb-0">
            &copy; 2026 Elevate Humanity. All Rights Reserved.
          </p>
          <small className="text-white-50">
            Built with ❤ by the Lead Developer
          </small>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
