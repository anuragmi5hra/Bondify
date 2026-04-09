import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = "https://bondify-hu7v.onrender.com";

export default function CreateBonds() {

  const [users, setUsers] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);
  const [bondedUsers, setBondedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ NEW STATES (PROFILE POPUP)
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* =========================
     Protect Page
  ========================= */
  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  /* =========================
     Fetch Logged User
  ========================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/profile/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          navigate("/");
          return;
        }

        const data = await res.json();
        setLoggedUser(data);

        if (data?.bonds) {
          const bonded = data.bonds.map(bond => ({
            userId: bond.user?._id || bond.user,
            bondType: bond.bondType
          }));
          setBondedUsers(bonded);
        }

        setLoading(false);

      } catch (err) {
        console.error("Profile error:", err);
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token, navigate]);

  /* =========================
     Fetch All Users
  ========================= */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/profile/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        setUsers(data);

      } catch (err) {
        console.error("Users fetch error:", err);
      }
    };

    if (token) fetchUsers();
  }, [token]);

  /* =========================
     Follow
  ========================= */
  const handleFollowClick = (userId) => {
    setSelectedUser(userId);
    setShowPopup(true);
  };

  const handleBondSelect = async (type) => {
    try {
      const res = await fetch(
        `${API_URL}/api/profile/follow/${selectedUser}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ bondType: type })
        }
      );

      if (!res.ok) {
        alert("Follow failed");
        return;
      }

      setBondedUsers(prev => [
        ...prev,
        { userId: selectedUser, bondType: type }
      ]);

      setShowPopup(false);
      alert("Followed successfully ✅");

    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  /* =========================
     Unfollow
  ========================= */
  const handleUnfollow = async (userId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/profile/unfollow/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!res.ok) {
        alert("Unfollow failed");
        return;
      }

      setBondedUsers(prev =>
        prev.filter(b => b.userId !== userId)
      );

      alert("Unfollowed successfully ❌");

    } catch (err) {
      console.error("Unfollow error:", err);
    }
  };

  /* =========================
   PROFILE POPUP HANDLER
========================= */
const handleUserClick = async (user) => {
  try {
    setShowProfilePopup(true);       // open popup first
    setSelectedProfile(null);        // reset (for loading state)

    const res = await fetch(`${API_URL}/api/profile/user/${user._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    setSelectedProfile(data);        // ✅ full profile आता है

  } catch (err) {
    console.error(err);
  }
};

  if (loading) return <h3 style={{ textAlign: "center" }}>Loading...</h3>;

  return (
    <>
      <Navbar />

      <div className="bond-container">
        <h2>Create Your Bonds</h2>

        <button className="dashboard-btn" onClick={() => navigate("/dashboard")}>
          Go To Dashboard
        </button>

        {/* USERS GRID */}
        <div className="bond-grid">
          {users
            .filter(user =>
              user._id !== loggedUser?._id && !user.isDeleted
            )
            .map(user => (

              <div
  key={user._id}
  className="user-card"
  onClick={() => handleUserClick(user)}
  style={{ cursor: "pointer" }}
>
  {/* ✅ PROFILE IMAGE */}
  <img
    src={
      user.profilePic
        ? `${API_URL}/uploads/${user.profilePic}`
        : "/default-avatar.png"
    }
    alt="profile"
    className="user-img"
  />

  <p>{user.username || "No Username"}</p>

                {bondedUsers.some(b => b.userId === user._id) ? (
                  <button
                    className="unfollow-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ prevent popup
                      handleUnfollow(user._id);
                    }}
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    className="follow-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ prevent popup
                      handleFollowClick(user._id);
                    }}
                  >
                    Follow
                  </button>
                )}

              </div>
            ))}
        </div>
      </div>

      {/* FOLLOW POPUP */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Select Bond Type</h3>

            <div className="popup-actions">
              <button onClick={() => handleBondSelect("friend")}>Friend</button>
              <button onClick={() => handleBondSelect("couple")}>Couple</button>
              <button onClick={() => handleBondSelect("charity")}>Charity</button>
            </div>

            <button className="cancel-btn" onClick={() => setShowPopup(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ✅ PROFILE POPUP */}
{showProfilePopup && (
  <div className="popup-overlay" onClick={() => setShowProfilePopup(false)}>
    <div className="profile-popup" onClick={(e) => e.stopPropagation()}>

      {!selectedProfile ? (
        <p>Loading...</p>   // ✅ loading fix
      ) : (
        <>
          <img
            src={
              selectedProfile.profilePic
                ? `${API_URL}/uploads/${selectedProfile.profilePic}`
                : "/default-avatar.png"
            }
            alt="profile"
            className="popup-img"
          />

          <h2>{selectedProfile.username}</h2>

          <p>
            <strong>Bio:</strong>{" "}
            {selectedProfile.bio || "No bio available"}
          </p>

          <p>
            <strong>DOB:</strong>{" "}
            {selectedProfile.dob
              ? new Date(selectedProfile.dob).toLocaleDateString()
              : "Not provided"}
          </p>

          <button
            className="btn btn-secondary"
            onClick={() => setShowProfilePopup(false)}
          >
            Close
          </button>
        </>
      )}

    </div>
  </div>
)}
    </>
  );
}