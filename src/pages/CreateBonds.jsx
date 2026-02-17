import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CreateBonds() {

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch all users
  useEffect(() => {
    fetch(`${API_URL}/api/profile/all`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const handleFollowClick = (userId) => {
    setSelectedUser(userId);
    setShowPopup(true);
  };

  const handleBondSelect = async (type) => {
    await fetch(`${API_URL}/api/profile/follow/${selectedUser}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ bondType: type })
    });

    alert("Followed Successfully");
    setShowPopup(false);
  };

  return (
    <>
      <Navbar />

      <div className="bond-container">
        <h2>Create Your Bonds</h2>

        {users.map(user => (
          <div key={user._id} className="user-card">
            <img
              src={`${API_URL}/uploads/${user.profilePic}`}
              alt="profile"
              width="60"
            />
            <span>{user.username}</span>
            <button onClick={() => handleFollowClick(user._id)}>
              Follow
            </button>
          </div>
        ))}
      </div>

      {/* Popup */}
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
          </div>
        </div>
      )}
    </>
  );
}