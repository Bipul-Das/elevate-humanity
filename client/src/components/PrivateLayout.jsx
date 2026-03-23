// client/src/components/PrivateLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const PrivateLayout = () => {
  return (
    <div className="d-flex">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area (Offset by 250px to allow space for sidebar) */}
      <div
        className="flex-grow-1 bg-light"
        style={{ marginLeft: "250px", minHeight: "100vh" }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default PrivateLayout;
