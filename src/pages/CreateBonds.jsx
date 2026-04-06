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

  if (loading) return <h3 style={{ textAlign: "center" }}>Loading...</h3>;

  return (
    <>
      <Navbar />

      <div className="bond-container">
        <h2>Create Your Bonds</h2>

        {/* Logged User */}
        {/* <div className="logged-user">
  <img
    src={
      loggedUser.profilePic
        ? `${API_URL}/uploads/${loggedUser.profilePic}`
        : "/default-avatar.png"
    }
    alt="profile"
    className="user-img"
  />
  <h4>{loggedUser.username || "User"}</h4>
</div> */}

        <button className="dashboard-btn" onClick={() => navigate("/dashboard")}>
          Go To Dashboard
        </button>

        {/* ✅ USERS GRID (COLUMN STYLE) */}
<div className="bond-grid">
  {users
  .filter(user => 
  user._id !== loggedUser?._id && !user.isDeleted
)
    .map(user => (

      <div key={user._id} className="user-card">

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
            onClick={() => handleUnfollow(user._id)}
          >
            Unfollow
          </button>
        ) : (
          <button
            className="follow-btn"
            onClick={() => handleFollowClick(user._id)}
          >
            Follow
          </button>
        )}

      </div>
    ))}
</div>
      </div>

      {/* POPUP */}
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