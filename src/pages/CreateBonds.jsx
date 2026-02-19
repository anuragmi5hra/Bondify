import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CreateBonds() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [bondedUsers, setBondedUsers] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ==============================
     ✅ Fetch All Users
  ============================== */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/profile/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };

    fetchUsers();
  }, [token]);

  /* ==============================
     ✅ Fetch My Bonds
  ============================== */
  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/profile/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        if (data.bonds) {
          const bondedIds = data.bonds.map(
            bond => bond.user?._id || bond.user
          );
          setBondedUsers(bondedIds);
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };

    fetchMyProfile();
  }, [token]);

  /* ==============================
     ✅ Follow Popup
  ============================== */
  const handleFollowClick = (userId) => {
    setSelectedUser(userId);
    setShowPopup(true);
  };

  /* ==============================
     ✅ Follow User
  ============================== */
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
        const error = await res.json();
        alert(error.message || "Follow failed");
        return;
      }

      setBondedUsers(prev => [...prev, selectedUser]);
      setShowPopup(false);
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  /* ==============================
     ✅ Unfollow User (DELETE)
  ============================== */
  const handleUnfollow = async (userId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/profile/unfollow/${userId}`,
        {
          method: "DELETE", // 🔥 IMPORTANT
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!res.ok) {
        const error = await res.json();
        alert(error.message || "Unfollow failed");
        return;
      }

      setBondedUsers(prev =>
        prev.filter(id => id !== userId)
      );
    } catch (err) {
      console.error("Unfollow error:", err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="bond-container">
        <h2>Create Your Bonds</h2>

        <button
          style={{ marginBottom: "20px" }}
          onClick={() => navigate("/dashboard")}
        >
          Go To Dashboard
        </button>

        {users.map(user => (
          <div key={user._id} className="user-card">
            <img
              src={
                user.profilePic
                  ? `${API_URL}/uploads/${user.profilePic}`
                  : "/default-avatar.png"
              }
              alt="profile"
              width="60"
            />

            <span>{user.username || "No Username"}</span>

            {bondedUsers.includes(user._id) ? (
              <button
                style={{ backgroundColor: "red", color: "white" }}
                onClick={() => handleUnfollow(user._id)}
              >
                Unfollow
              </button>
            ) : (
              <button
                style={{ backgroundColor: "green", color: "white" }}
                onClick={() => handleFollowClick(user._id)}
              >
                Follow
              </button>
            )}
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-box">
            <h3>Select Bond Type</h3>
            <button onClick={() => handleBondSelect("friend")}>
              Friend
            </button>
            <button onClick={() => handleBondSelect("couple")}>
              Couple
            </button>
            <button onClick={() => handleBondSelect("charity")}>
              Charity
            </button>
            <button onClick={() => setShowPopup(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}