import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CreateBonds() {
  const [users, setUsers] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);
  const [bondedUsers, setBondedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* =========================
     Protect Page
  ========================= */
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
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

        // ✅ Make sure correct structure
        setLoggedUser(data);

        if (data?.bonds) {
          const ids = data.bonds.map(
            bond => bond.user?._id || bond.user
          );
          setBondedUsers(ids);
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

      if (!res.ok) return alert("Follow failed");

      setBondedUsers(prev => [...prev, selectedUser]);
      setShowPopup(false);
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/profile/unfollow/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!res.ok) return alert("Unfollow failed");

      setBondedUsers(prev => prev.filter(id => id !== userId));
    } catch (err) {
      console.error("Unfollow error:", err);
    }
  };

  if (loading) return <h3 style={{ textAlign: "center" }}>Loading...</h3>;

  return (
    <>
      <Navbar />

      <div className="bond-container">
        <h2>Create Your Bonds</h2>

        {/* ✅ SHOW ONLY USERNAME + PHOTO */}
        {loggedUser && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "20px",
              background: "#f5f5f5",
              padding: "10px",
              borderRadius: "10px"
            }}
          >
            <img
              src={
                loggedUser.profilePic
                  ? `${API_URL}/uploads/${loggedUser.profilePic}`
                  : "/default-avatar.png"
              }
              alt="profile"
              width="60"
              style={{ borderRadius: "50%" }}
            />

            <h4>{loggedUser.username || "User"}</h4>
          </div>
        )}

        <button
          style={{ marginBottom: "20px" }}
          onClick={() => navigate("/dashboard")}
        >
          Go To Dashboard
        </button>

        {users
          .filter(user => user._id !== loggedUser?._id)
          .map(user => (
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
            <button onClick={() => handleBondSelect("friend")}>Friend</button>
            <button onClick={() => handleBondSelect("couple")}>Couple</button>
            <button onClick={() => handleBondSelect("charity")}>Charity</button>
            <button onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}