import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SendPoints() {

  const [bonds, setBonds] = useState([]);
  const [selectedType, setSelectedType] = useState("friend");

  const token = localStorage.getItem("token");

  const fetchBonds = async (type) => {
    try {

      const res = await fetch(`${API_URL}/api/profile/bonds?type=${type}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      setBonds(data);
      setSelectedType(type);

    } catch (err) {
      console.error("Bond fetch error:", err);
    }
  };

  useEffect(() => {
    fetchBonds("friend");
  }, []);

  const handleSendPoints = async (userId) => {

    try {

      const res = await fetch(`${API_URL}/api/points/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: userId,
          points: 1
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to send points");
        return;
      }

      alert("Points sent successfully ❤️");

    } catch (err) {
      console.error("Send points error:", err);
      alert("Server error");
    }
  };

  return (
    <>
      <Navbar />

      <div className="grid-3">

        <button onClick={() => fetchBonds("friend")}>
          Friends List
        </button>

        <button onClick={() => fetchBonds("couple")}>
          Couples List
        </button>

        <button onClick={() => fetchBonds("charity")}>
          NGO / Other List
        </button>

      </div>

      <div className="bond-list">

        <h2>{selectedType.toUpperCase()} LIST</h2>

        {bonds.length === 0 ? (
          <p>No users found</p>
        ) : (
          bonds.map((bond) => (

            <div key={bond._id} className="bond-card">

              <img
                src={
                  bond.user?.profilePic
                    ? `${API_URL}/uploads/${bond.user.profilePic}`
                    : "/default-avatar.png"
                }
                alt="profile"
                width="60"
                style={{ borderRadius: "50%" }}
              />

              <span>{bond.user?.username}</span>

              <button
                style={{
                  background: "#2f93c6",
                  color: "white",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  marginLeft: "10px"
                }}
                onClick={() => handleSendPoints(bond.user?._id)}
              >
                Send
              </button>

            </div>
          ))
        )}

      </div>
    </>
  );
}