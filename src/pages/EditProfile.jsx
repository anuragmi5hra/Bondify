import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const API_URL = "https://bondify-hu7v.onrender.com";

export default function EditProfile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [dob, setDob] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  /* =========================
     GET PROFILE
  ========================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(res.data);
        setUsername(res.data.username || "");
        setBio(res.data.bio || "");
        setDob(res.data.dob ? new Date(res.data.dob).toISOString().slice(0, 10) : "");

        if (res.data.profilePic) {
          setPreview(`${API_URL}/uploads/${res.data.profilePic}`);
        }

      } catch (err) {
        console.log(err);
      }
    };

    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${API_URL}/api/charity/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setTransactions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };

    Promise.all([fetchProfile(), fetchTransactions()]).finally(() => setLoading(false));
  }, [token]);

  const myId = profile?._id;
  const sentPoints = transactions.reduce((sum, t) => {
    const senderId = typeof t.sender === "string" ? t.sender : t.sender?._id;
    return senderId && myId && senderId === myId ? sum + (t.points || 0) : sum;
  }, 0);
  const receivedPoints = transactions.reduce((sum, t) => {
    const receiverId = typeof t.receiver === "string" ? t.receiver : t.receiver?._id;
    return receiverId && myId && receiverId === myId ? sum + (t.points || 0) : sum;
  }, 0);

  /* =========================
     UPDATE PROFILE
  ========================= */
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${API_URL}/api/profile/me`,
        { username, bio, dob },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile updated successfully ✅");
      // Refresh read-only profile view
      try {
        const res = await axios.get(`${API_URL}/api/profile/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
      } catch {
        // ignore
      }

    } catch (err) {
      console.log(err);
      alert("Update failed ❌");
    }
  };

  /* =========================
     UPLOAD PROFILE PHOTO
  ========================= */
  const handlePhotoUpload = async () => {
    if (!profilePic) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", profilePic);

    try {
      const res = await axios.post(
        `${API_URL}/api/profile/photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Photo updated successfully 📸");

      setPreview(`${API_URL}/uploads/${res.data.profilePic}`);
      try {
        const refreshed = await axios.get(`${API_URL}/api/profile/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(refreshed.data);
      } catch {
        // ignore
      }

    } catch (err) {
      console.log(err);
      alert("Photo upload failed");
    }
  };

  /* =========================
   DELETE ACCOUNT
========================= */
const handleDeleteAccount = async () => {

  const confirmDelete = window.confirm("Are you sure you want to delete your account?");

  if (!confirmDelete) return;

  try {

    const res = await fetch(`${API_URL}/api/profile/delete`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await res.json();

    alert(data.message);

    if (res.ok) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }

  } catch (err) {
    console.error(err);
    alert("Error deleting account");
  }
};

  return (
    <>
      <Navbar profile={profile} />

      <div className="page">
        <div className="container grid" style={{ gap: 16 }}>
          <div className="card card-pad">
            <div className="card-header">
              <div>
                <h2 className="title">Profile</h2>
                 
                <p className="subtle">Your identity, wallet stats, and account settings.</p>
              </div>
              <div className="pill" title="Account email">
                <span className="pill-dot" />
                <span>{profile?.email || "—"}</span>
              </div>
            </div>

            <div className="divider" />

            <div className="stats-grid">
              <div className="card stat-card">
                <p className="stat-label">Total Points</p>
                <div className="stat-row">
                  <p className="stat-value">{profile?.points ?? "—"}</p>
                  <span className="badge">
                    <span className="badge-dot" /> Wallet
                  </span>
                </div>
              </div>
              <div className="card stat-card">
                <p className="stat-label">Sent</p>
                <div className="stat-row">
                  <p className="stat-value">{loading ? "—" : sentPoints}</p>
                  <span className="badge badge-danger">
                    <span className="badge-dot" /> Outgoing
                  </span>
                </div>
              </div>
              <div className="card stat-card">
                <p className="stat-label">Received</p>
                <div className="stat-row">
                  <p className="stat-value">{loading ? "—" : receivedPoints}</p>
                  <span className="badge badge-success">
                    <span className="badge-dot" /> Incoming
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid-2">
            <div className="card card-pad">
              <div className="card-header">
                <div>
                  <h3 className="title" style={{ fontSize: 16 }}>Your details</h3>
                  <p className="subtle">Photo + basic profile information</p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <div style={{ width: 78, height: 78, borderRadius: 20, overflow: "hidden", border: "1px solid rgba(15,23,42,0.10)" }}>
                  <img
                    src={preview || "/default-avatar.png"}
                    alt="Profile"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 220 }}>
                  <div className="field">
                    <div className="label">Update profile photo</div>
                    <input
                      className="input"
                      type="file"
                      onChange={(e) => setProfilePic(e.target.files[0])}
                      accept="image/*"
                    />
                    <p className="hint">PNG/JPG up to 5MB recommended.</p>
                  </div>
                </div>

                <button className="btn btn-secondary" onClick={handlePhotoUpload} type="button">
                  Upload photo
                </button>
              </div>

              <div className="divider" />

              <form onSubmit={handleUpdate} className="grid" style={{ gap: 12 }}>
                <div className="field">
                  <div className="label">Username</div>
                  <input
                    className="input"
                    type="text"
                    placeholder="Your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="field">
                  <div className="label">Bio</div>
                  <input
                    className="input"
                    type="text"
                    placeholder="A short tagline (optional)"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <div className="field">
                  <div className="label">Date of birth</div>
                  <input
                    className="input"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button className="btn btn-primary" type="submit">
                    Save changes
                  </button>

                  <div style={{ textAlign: "right" }}>
  <button
    style={{
      background: "#e53935",
      color: "white",
      border: "none",
      padding: "10px 16px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600"
    }}
    onClick={handleDeleteAccount}
  >
    Delete Account
  </button>
</div>

                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() => {
                      setUsername(profile?.username || "");
                      setBio(profile?.bio || "");
                      setDob(profile?.dob ? new Date(profile.dob).toISOString().slice(0, 10) : "");
                    }}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>

            <div className="card card-pad">
              <div className="card-header">
                <div>
                  <h3 className="title" style={{ fontSize: 16 }}>Account insights</h3>
                  <p className="subtle">A quick, tidy snapshot of activity.</p>
                </div>
              </div>

              <div className="grid" style={{ gap: 12 }}>
                <div className="card card-solid card-pad" style={{ boxShadow: "none" }}>
                  <div className="subtle">Transactions</div>
                  <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.03em" }}>
                    {loading ? "—" : transactions.length}
                  </div>
                </div>
                <div className="card card-solid card-pad" style={{ boxShadow: "none" }}>
                  <div className="subtle">Bonds connected</div>
                  <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.03em" }}>
                    {profile?.bonds?.length ?? "—"}
                  </div>
                </div>
                <button className="btn btn-secondary" onClick={() => navigate("/charity")} type="button">
                  View transaction history
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}