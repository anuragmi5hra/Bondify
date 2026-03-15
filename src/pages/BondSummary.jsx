import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function BondSummary() {

  const [bonds, setBonds] = useState([]);
  const [selectedType, setSelectedType] = useState("friend");

  const token = localStorage.getItem("token");

  /* =========================
     Fetch Bonds
  ========================= */

  const fetchBonds = async (type) => {
    try {

      const res = await fetch(
        `${API_URL}/api/profile/bonds?type=${type}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();
      setBonds(data);
      setSelectedType(type);

    } catch (err) {
      console.error("Bond fetch error:", err);
    }
  };

  /* =========================
     Load Friend Bonds Default
  ========================= */

  useEffect(() => {
    fetchBonds("friend");
  }, []);

  return (
    <>
      <Navbar />

      <div className="grid-3">

        <button onClick={() => fetchBonds("friend")}>
          Friend Bonds
        </button>

        <button onClick={() => fetchBonds("couple")}>
          Couple Bonds
        </button>

        <button onClick={() => fetchBonds("charity")}>
          NGO / Other Bonds
        </button>

      </div>

      <div className="bond-list">

        <h2>{selectedType.toUpperCase()} BONDS</h2>

        {bonds.length === 0 ? (
          <p>No bonds found</p>
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
              />

              <span>{bond.user?.username}</span>

            </div>
          ))
        )}

      </div>
    </>
  );
}