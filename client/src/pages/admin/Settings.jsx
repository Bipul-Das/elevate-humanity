// client/src/pages/admin/Settings.jsx
import { useState, useEffect, useRef } from "react";
import {
  updateProfile,
  updatePassword,
  uploadPhoto,
  getProfile,
} from "../../services/userService";
import toast from "react-hot-toast";

const Settings = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  // UI States
  const [isVisible, setIsVisible] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUpdatingSecurity, setIsUpdatingSecurity] = useState(false);

  // Photo Upload State & Ref
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  // Profile State
  const [profile, setProfile] = useState({
    name: user.name || "",
    phoneSuffix: user.phone ? user.phone.replace(/^10/, "") : "", // Stripping the '10' prefix
    city: user.city || "",
    area: user.area || "",
  });

  // Password State
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setIsVisible(true);
    const fetchFreshProfile = async () => {
      try {
        const res = await getProfile();
        const freshUser = res.data;

        // 1. Update our local storage and main user state
        localStorage.setItem("user", JSON.stringify(freshUser));
        setUser(freshUser);

        // 2. Populate the form fields with the database values!
        setProfile({
          name: freshUser.name || "",
          phoneSuffix: freshUser.phone
            ? freshUser.phone.replace(/^10/, "")
            : "",
          city: freshUser.city || "",
          area: freshUser.area || freshUser.address || "", // Fallback to 'address' just in case your DB uses that word
        });
      } catch (error) {
        console.error("Failed to load fresh profile data.");
      }
    };

    fetchFreshProfile();
  }, []);

  // --- PHOTO UPLOAD HANDLER ---
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2000000) {
      return toast.error("File is too large. Max size is 2MB.");
    }

    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);
    try {
      const res = await uploadPhoto(formData);

      // Update local storage and state so the UI updates instantly
      const updatedUser = { ...user, profileImage: res.imageUrl };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success("Profile photo updated!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to upload image");
    } finally {
      setIsUploading(false);
      // Reset the input so the user can upload the same file again if they want
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // --- PROFILE UPDATE HANDLER ---
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (profile.phoneSuffix.length !== 5) {
      return toast.error("Phone suffix must be exactly 5 digits.");
    }

    setIsSyncing(true);
    try {
      const payload = {
        ...profile,
        phone: `10${profile.phoneSuffix}`,
      };

      const res = await updateProfile(payload);

      // Update local storage with fresh data
      localStorage.setItem("user", JSON.stringify({ ...user, ...res.data }));
      setUser({ ...user, ...res.data });

      toast.success("Profile Synchronized Successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to sync profile");
    } finally {
      setIsSyncing(false);
    }
  };

  // --- SECURITY KEY HANDLER ---
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (security.newPassword !== security.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    if (security.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    setIsUpdatingSecurity(true);
    try {
      await updatePassword({
        currentPassword: security.currentPassword,
        newPassword: security.newPassword,
      });
      toast.success("Security Key Updated!");
      setSecurity({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }); // Clear form
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update security key");
    } finally {
      setIsUpdatingSecurity(false);
    }
  };

  // Enterprise-Grade Custom Styles
  const customStyles = `
    .hover-lift-card {
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .hover-lift-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08) !important;
    }

    .animate-fade-up {
      opacity: 0;
      transform: translateY(20px);
      animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes fadeUp {
      to { opacity: 1; transform: translateY(0); }
    }

    .form-control-custom {
      background-color: #F8FAFC;
      border: 1px solid #E2E8F0;
      padding: 0.8rem 1rem;
      border-radius: 0.5rem;
      transition: all 0.3s ease;
      color: #0F172A;
    }

    .form-control-custom:focus {
      background-color: #FFFFFF;
      border-color: #2563EB;
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
      outline: none;
    }
  `;

  return (
    <div className="container-fluid p-4 p-md-5 bg-light min-vh-100">
      <style>{customStyles}</style>

      {/* Header Section */}
      <div
        className={`mb-5 animate-fade-up ${isVisible ? "" : "d-none"}`}
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        <h2 className="fw-bolder text-dark mb-2 d-flex align-items-center gap-3">
          <div
            className="bg-primary bg-opacity-10 text-primary p-2 rounded-3 fs-4 d-flex align-items-center justify-content-center"
            style={{ width: "45px", height: "45px" }}
          >
            ⚙️
          </div>
          System Preferences
        </h2>
        <p className="text-muted ms-1">
          Manage your identity, contact telemetry, and security protocols within
          the network.
        </p>
      </div>

      <div
        className="row g-4 justify-content-center"
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        {/* LEFT COLUMN: Identity Configuration */}
        <div
          className={`col-lg-7 animate-fade-up ${isVisible ? "" : "d-none"}`}
          style={{ animationDelay: "0.1s" }}
        >
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 h-100 bg-white hover-lift-card">
            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
              <span
                className="bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-pill small fw-bold text-uppercase"
                style={{ letterSpacing: "1px" }}
              >
                Identity Configuration
              </span>
            </div>

            {/* INTERACTIVE Profile Photo Section */}
            <div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-start gap-4 mb-5 pb-5 border-bottom">
              <div className="position-relative">
                <img
                  src={
                    user?.profileImage
                      ? `http://localhost:5000${user.profileImage}`
                      : `https://ui-avatars.com/api/?name=${
                          user?.name || "U"
                        }&background=1E293B&color=fff&size=120&bold=true`
                  }
                  alt="Profile"
                  className="rounded-circle shadow-sm object-fit-cover border border-4 border-white"
                  width="100"
                  height="100"
                />
                {isUploading && (
                  <div className="position-absolute top-0 start-0 w-100 h-100 rounded-circle bg-dark bg-opacity-50 d-flex align-items-center justify-content-center">
                    <span className="spinner-border spinner-border-sm text-white"></span>
                  </div>
                )}
              </div>

              <div className="text-center text-sm-start">
                <h6 className="fw-bold text-dark mb-1">Visual Identifier</h6>
                <p
                  className="text-muted small mb-3 lh-lg"
                  style={{ maxWidth: "350px" }}
                >
                  This image represents you across the operational network.
                  Standard formats accepted (JPG, PNG, WebP). Maximum payload:
                  2MB.
                </p>

                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />

                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary fw-bold px-3 py-2 rounded-pill"
                  onClick={() => fileInputRef.current.click()}
                  disabled={isUploading}
                >
                  ↑ Upload New Image
                </button>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleProfileSubmit}>
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <label
                    className="fw-bold small text-muted mb-2 text-uppercase"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Registered Entity Name
                  </label>
                  <input
                    type="text"
                    className="form-control-custom w-100"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label
                    className="fw-bold small text-muted mb-2 text-uppercase"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Official Phone
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted fw-bold border-end-0">
                      📞 +880 10
                    </span>
                    <input
                      type="text"
                      className="form-control-custom border-start-0 w-50"
                      maxLength="5"
                      value={profile.phoneSuffix}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          phoneSuffix: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label
                  className="fw-bold small text-muted mb-2 text-uppercase"
                  style={{ letterSpacing: "0.5px" }}
                >
                  Operational City
                </label>
                <input
                  type="text"
                  className="form-control-custom w-100"
                  value={profile.city}
                  onChange={(e) =>
                    setProfile({ ...profile, city: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-5">
                <label
                  className="fw-bold small text-muted mb-2 text-uppercase"
                  style={{ letterSpacing: "0.5px" }}
                >
                  Detailed Geographic Coordinates
                </label>
                <textarea
                  className="form-control-custom w-100"
                  rows="3"
                  value={profile.area}
                  onChange={(e) =>
                    setProfile({ ...profile, area: e.target.value })
                  }
                  required
                ></textarea>
              </div>

              <div className="text-end border-top pt-4">
                <button
                  type="submit"
                  disabled={isSyncing}
                  className="btn btn-primary px-5 py-3 fw-bold rounded-pill shadow-sm d-inline-flex align-items-center gap-2"
                  style={{ transition: "all 0.3s ease" }}
                >
                  {isSyncing ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                      ></span>
                      Synchronizing...
                    </>
                  ) : (
                    "Synchronize Telemetry →"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Security Protocol */}
        <div
          className={`col-lg-5 animate-fade-up ${isVisible ? "" : "d-none"}`}
          style={{ animationDelay: "0.2s" }}
        >
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 h-100 bg-white hover-lift-card border-top border-4 border-danger">
            <div className="d-flex align-items-center gap-3 mb-5 pb-3 border-bottom">
              <span
                className="bg-danger bg-opacity-10 text-danger px-3 py-1 rounded-pill small fw-bold text-uppercase"
                style={{ letterSpacing: "1px" }}
              >
                Security Protocol
              </span>
            </div>

            <form
              onSubmit={handlePasswordSubmit}
              className="d-flex flex-column h-100"
            >
              <div className="mb-4">
                <label className="fw-bold small text-dark mb-2">
                  Current Master Key
                </label>
                <input
                  type="password"
                  className="form-control-custom w-100"
                  value={security.currentPassword}
                  onChange={(e) =>
                    setSecurity({
                      ...security,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label className="fw-bold small text-dark mb-2">
                  New Security Key
                </label>
                <input
                  type="password"
                  className="form-control-custom w-100"
                  value={security.newPassword}
                  onChange={(e) =>
                    setSecurity({ ...security, newPassword: e.target.value })
                  }
                  required
                  minLength="6"
                />
              </div>

              <div className="mb-5">
                <label className="fw-bold small text-dark mb-2">
                  Verify New Key
                </label>
                <input
                  type="password"
                  className="form-control-custom w-100"
                  value={security.confirmPassword}
                  onChange={(e) =>
                    setSecurity({
                      ...security,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  minLength="6"
                />
              </div>

              <div className="mt-auto border-top pt-4">
                <button
                  type="submit"
                  disabled={isUpdatingSecurity}
                  className="btn btn-danger w-100 py-3 fw-bold rounded-pill shadow-sm d-flex justify-content-center align-items-center gap-2"
                  style={{ transition: "all 0.3s ease" }}
                >
                  {isUpdatingSecurity ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                      ></span>
                      Encrypting...
                    </>
                  ) : (
                    "Update Security Matrix 🔒"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
