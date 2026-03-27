// client/src/components/PrivateLayout.jsx
import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";

const PrivateLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = ["Lead Developer", "Admin"].includes(user?.role);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // --- STRICT ROLE-BASED NAVIGATION (Sidebar - All Links) ---
  const navLinks = [
    { label: "Dashboard", path: "/dashboard", allowed: true },
    { label: "My Requests", path: "/my-requests", allowed: true },
    { label: "Create Request", path: "/create-request", allowed: true },
    { label: "Edit Profile", path: "/settings", allowed: true },
    { label: "Events", path: "/events", allowed: true },
    { label: "Create Event", path: "/create-event", allowed: isAdmin },
    // { label: "Applications", path: "/applications", allowed: isAdmin },
    { label: "Staff Portal", path: "/staff", allowed: isAdmin },
    { label: "Campaigns", path: "/campaigns", allowed: true },
    // { label: "Inventory", path: "/inventory", allowed: isAdmin },
    // { label: "Cases", path: "/cases", allowed: isAdmin },
  ];

  const allowedLinks = navLinks.filter((link) => link.allowed);

  // --- TOP NAVBAR STRICT 4-LINK POLICY ---
  const topNavLinks = isAdmin
    ? [
        { label: "Home", path: "/" },
        { label: "Dashboard", path: "/dashboard" },
        { label: "All Inventories", path: "/inventory" },
        { label: "All Requests", path: "/cases" },
        { label: "Applications", path: "/applications" },
      ]
    : [
        { label: "Home", path: "/" },
        { label: "My Requests", path: "/my-requests" },
        { label: "Request Help", path: "/create-request" },
        { label: "Events", path: "/events" },
      ];

  return (
    <div
      className="d-flex"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      {/* ========================================= */}
      {/* TOP NAVBAR (Fixed) */}
      {/* ========================================= */}
      <nav
        className="navbar fixed-top bg-white border-bottom shadow-sm px-3 px-md-4 d-flex justify-content-between align-items-center"
        style={{ height: "70px", zIndex: 1030 }}
      >
        {/* LEFT SIDE: Hamburger & Logo */}
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-light border-0 p-2 d-flex align-items-center justify-content-center"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{ width: "40px", height: "40px" }}
          >
            <span
              className="fs-4 lh-1"
              style={{ transform: "translateY(-2px)" }}
            >
              ☰
            </span>
          </button>

          <div className="d-none d-sm-block">
            <Logo scale={0.65} />
          </div>
        </div>

        {/* CENTER: Top Horizontal Navbar Links (Perfectly Centered) */}
        <div className="d-none d-xl-flex position-absolute top-50 start-50 translate-middle align-items-center justify-content-center gap-5">
          {topNavLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-decoration-none fw-bold ${
                  isActive
                    ? "text-primary border-bottom border-2 border-primary pb-1"
                    : "text-secondary"
                }`}
                style={{ transition: "color 0.2s ease", fontSize: "0.95rem" }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* RIGHT SIDE: User Profile Area */}
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center border border-2 rounded-pill p-1 shadow-sm bg-white"
            style={{ borderColor: "#1E293B" }}
          >
            <div className="text-end d-none d-sm-block px-3 lh-1">
              <div className="fw-bold text-dark" style={{ fontSize: "0.9rem" }}>
                {user?.name || "User"}
              </div>
              <div
                className="fw-bold"
                style={{
                  fontSize: "0.65rem",
                  color: "#63A0E8",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {user?.role === "Lead Developer"
                  ? "DEV MODE"
                  : user?.role || "MEMBER"}
              </div>
            </div>
            <img
              src={
                user?.profileImage
                  ? `http://localhost:5000${user.profileImage}`
                  : `https://ui-avatars.com/api/?name=${
                      user?.name || "U"
                    }&background=1E293B&color=fff&bold=true`
              }
              className="rounded-circle object-fit-cover"
              width="36"
              height="36"
              alt="avatar"
            />
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-light border-0 p-2 text-dark fs-5 d-flex align-items-center justify-content-center"
            title="Logout"
          >
            [→
          </button>
        </div>
      </nav>

      {/* ========================================= */}
      {/* SIDEBAR (Collapsible) */}
      {/* ========================================= */}
      <div
        className="bg-white border-end shadow-sm"
        style={{
          width: "250px",
          position: "fixed",
          top: "70px",
          bottom: 0,
          left: isSidebarOpen ? "0" : "-250px",
          transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 1020,
          overflowY: "auto",
        }}
      >
        <div className="d-flex flex-column py-3">
          {allowedLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-decoration-none px-4 py-3 fw-bold ${
                  isActive
                    ? "bg-primary bg-opacity-10 text-primary border-end border-4 border-primary"
                    : "text-secondary hover-bg-light"
                }`}
                style={{ transition: "background-color 0.2s ease" }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ========================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================= */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: isSidebarOpen && window.innerWidth >= 992 ? "250px" : "0",
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          marginTop: "70px",
          minHeight: "calc(100vh - 70px)",
        }}
      >
        {isSidebarOpen && window.innerWidth < 992 && (
          <div
            className="position-fixed top-0 bottom-0 start-0 end-0 bg-dark bg-opacity-50"
            style={{ zIndex: 1010 }}
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <Outlet />
      </div>
    </div>
  );
};

export default PrivateLayout;
