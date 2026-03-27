// client/src/components/PublicLayout.jsx
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";

const PublicLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Safely check if a user is logged in
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Public Page Links
  const publicNavLinks = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Our Services", path: "/services" },
    { label: "Apply", path: "/apply" },
  ];

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* ========================================= */}
      {/* TOP NAVBAR (Fixed) */}
      {/* ========================================= */}
      <nav
        className="navbar fixed-top bg-white border-bottom shadow-sm px-3 px-md-4 d-flex justify-content-between align-items-center"
        style={{ height: "70px", zIndex: 1030, marginBottom: "0px" }}
      >
        {/* LEFT SIDE: Brand Logo */}
        <div
          className="d-flex align-items-center"
          style={{ marginLeft: "50px" }}
        >
          <Link to="/" className="text-decoration-none">
            <Logo scale={0.7} />
          </Link>
        </div>

        {/* CENTER: Top Horizontal Navbar Links (Perfectly Centered) */}
        <div className="d-none d-lg-flex position-absolute top-50 start-50 translate-middle align-items-center justify-content-center gap-5">
          {publicNavLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-decoration-none fw-bold ${
                  isActive
                    ? "text-primary border-bottom border-2 border-primary pb-1"
                    : "text-secondary hover-text-primary"
                }`}
                style={{ transition: "color 0.2s ease", fontSize: "0.95rem" }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* RIGHT SIDE: Auth Area (Dynamic based on login status) */}
        <div
          className="d-flex align-items-center gap-3"
          style={{ marginRight: "50px" }}
        >
          {isLoggedIn ? (
            // --- LOGGED IN VIEW (Matches Private Navbar exactly) ---
            <>
              <Link to="/dashboard" className="text-decoration-none text-dark">
                <div
                  className="d-flex align-items-center border border-2 rounded-pill p-1 shadow-sm bg-white"
                  style={{ borderColor: "#1E293B" }}
                >
                  <div className="text-end d-none d-sm-block px-3 lh-1">
                    <div
                      className="fw-bold text-dark"
                      style={{ fontSize: "0.9rem" }}
                    >
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
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-light border-0 p-2 text-dark fs-5 d-flex align-items-center justify-content-center"
                title="Logout"
              >
                [→
              </button>
            </>
          ) : (
            // --- LOGGED OUT VIEW ---
            <>
              <Link
                to="/login"
                className="btn btn-light fw-bold text-dark border-0 px-3"
              >
                Staff Login
              </Link>
              <Link
                to="/donate"
                className="btn btn-primary fw-bold px-4 rounded-3 shadow-sm"
              >
                Donate
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ========================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================= */}
      <main className="flex-grow-1" style={{ marginTop: "70px" }}>
        <Outlet />
      </main>

      {/* ========================================= */}
      {/* FOOTER */}
      {/* ========================================= */}
      <footer
        style={{ backgroundColor: "#060A23", color: "#A0ABC0" }}
        className="pt-5 pb-3"
      >
        <div className="container px-4">
          <div className="row g-5 mb-5">
            {/* Column 1: Brand & Description */}
            <div className="col-lg-5 pe-lg-5">
              <div className="mb-4 bg-white d-inline-block p-2 rounded">
                <Logo scale={0.8} />
              </div>
              <p className="small lh-lg text-light text-opacity-75">
                An enterprise-grade platform dedicated to elevating humanity by
                connecting resources, volunteers, and organizations with
                communities in need.
              </p>
            </div>

            {/* Column 2: Platform Links */}
            <div className="col-lg-3 col-md-6">
              <h6
                className="fw-bold mb-4"
                style={{
                  color: "#4ADE80",
                  letterSpacing: "1px",
                  fontSize: "0.8rem",
                }}
              >
                PLATFORM
              </h6>
              <ul className="list-unstyled d-flex flex-column gap-3 small">
                <li>
                  <Link
                    to="/about"
                    className="text-decoration-none text-light text-opacity-75 hover-text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="text-decoration-none text-light text-opacity-75 hover-text-white transition-colors"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/donate"
                    className="text-decoration-none text-light text-opacity-75 hover-text-white transition-colors"
                  >
                    Contribute
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Support Links */}
            <div className="col-lg-4 col-md-6">
              <h6
                className="fw-bold mb-4"
                style={{
                  color: "#4ADE80",
                  letterSpacing: "1px",
                  fontSize: "0.8rem",
                }}
              >
                SUPPORT
              </h6>
              <ul className="list-unstyled d-flex flex-column gap-3 small">
                <li>
                  <Link
                    to="/apply"
                    className="text-decoration-none text-light text-opacity-75 hover-text-white transition-colors"
                  >
                    Submit Application
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-decoration-none text-light text-opacity-75 hover-text-white transition-colors"
                  >
                    Staff Portal
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-decoration-none fw-bold text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright Divider */}
          <div className="border-top border-secondary border-opacity-25 pt-4 text-center">
            <p className="small mb-0 text-light text-opacity-50">
              © {new Date().getFullYear()} Elevate Humanity Management System.
              All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
