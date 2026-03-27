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
    }
  };

  return (
    <div className="container p-4 p-md-5" style={{ maxWidth: "1200px" }}>
      <div className="mb-5">
        <h2 className="fw-bold text-dark mb-1">Settings & Preferences</h2>
        <p className="text-muted small">
          Manage your identity and security protocols within the network.
        </p>
      </div>

      <div className="row g-4">
        {/* LEFT COLUMN: Identity Configuration */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 h-100">
            <h6
              className="fw-bold text-primary mb-4 text-uppercase"
              style={{ letterSpacing: "1px", fontSize: "0.85rem" }}
            >
              👤 Identity Configuration
            </h6>

            {/* INTERACTIVE Profile Photo Section */}
            <div className="d-flex align-items-center gap-4 mb-5 pb-4 border-bottom">
              <img
                src={
                  user?.profileImage
                    ? `http://localhost:5000${user.profileImage}`
                    : `https://ui-avatars.com/api/?name=${
                        user?.name || "U"
                      }&background=1E293B&color=fff&size=100&bold=true`
                }
                alt="Profile"
                className="rounded-circle shadow-sm object-fit-cover"
                width="80"
                height="80"
              />
              <div>
                <h6 className="fw-bold mb-1">Profile Photo</h6>
                <p
                  className="text-muted small mb-2"
                  style={{ maxWidth: "400px" }}
                >
                  This image will be visible to other nodes in the network. We
                  recommend a clear, high-contrast image. (JPG, PNG, WebP. Max
                  2MB).
                </p>

                {/* Hidden File Input */}
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />

                {/* Trigger Button */}
                <button
                  type="button"
                  className="btn btn-sm btn-light border fw-bold"
                  onClick={() => fileInputRef.current.click()}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "↑ Upload New Image"}
                </button>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit}>
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <label
                    className="fw-bold small text-muted mb-2 text-uppercase"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Name / Contact Person
                  </label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <label
                    className="fw-bold small text-muted mb-2 text-uppercase"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Official Phone
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted fw-bold">
                      📞 10
                    </span>
                    <input
                      type="text"
                      className="form-control bg-light"
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
                  style={{ fontSize: "0.75rem" }}
                >
                  City
                </label>
                <input
                  type="text"
                  className="form-control bg-light"
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
                  style={{ fontSize: "0.75rem" }}
                >
                  Address Details
                </label>
                <textarea
                  className="form-control bg-light"
                  rows="3"
                  value={profile.area}
                  onChange={(e) =>
                    setProfile({ ...profile, area: e.target.value })
                  }
                  required
                ></textarea>
              </div>

              <div className="text-end">
                <button
                  type="submit"
                  className="btn btn-primary px-5 py-2 fw-bold rounded-3"
                >
                  Synchronize Profile
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Security Protocol */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 h-100">
            <h6
              className="fw-bold text-danger mb-4 text-uppercase"
              style={{ letterSpacing: "1px", fontSize: "0.85rem" }}
            >
              🛡️ Security Protocol
            </h6>

            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label className="fw-bold small text-dark mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  className="form-control bg-light"
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
                  New Password
                </label>
                <input
                  type="password"
                  className="form-control bg-light"
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
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="form-control bg-light"
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

              <button
                type="submit"
                className="btn btn-danger w-100 py-2 fw-bold rounded-3"
              >
                Update Security Key
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
