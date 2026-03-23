// client/src/components/PublicNavbar.jsx
import { Link, NavLink } from "react-router-dom";

const PublicNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top py-3 shadow">
      <div className="container">
        {/* Brand */}
        <Link
          className="navbar-brand fw-bold text-uppercase d-flex align-items-center gap-2"
          to="/"
        >
          🚀 Elevate Humanity
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#publicNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="publicNav">
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About Us
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/services">
                Our Services
              </NavLink>
            </li>

            {/* Dropdown for Applications */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                Get Involved
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/volunteer-apply">
                    Join as Volunteer
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/membership-apply">
                    Church Membership
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                Contact
              </NavLink>
            </li>

            <li className="d-none d-lg-block text-white-50">|</li>

            {/* Action Buttons */}
            <li className="nav-item">
              <Link
                to="/login"
                className="btn btn-outline-light btn-sm px-4 rounded-pill"
              >
                Staff Login
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/donate"
                className="btn btn-warning btn-sm px-4 fw-bold rounded-pill shadow-sm text-dark"
              >
                Donate Now
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
