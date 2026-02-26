import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          navigate("/");
          return;
        }

        const data = await res.json();
        setProfile(data);

      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [navigate, API_URL]);

  return (
    <>
      <Navbar profile={profile} />

      <div className="dashboard">

        {/* 👤 PROFILE DISPLAY */}
        {profile && (
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            {profile.profilePic && (
              <img
                src={`${API_URL}/uploads/${profile.profilePic}`}
                alt="Profile"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover"
                }}
              />
            )}
            <h3>{profile.username}</h3>
            {profile.bio && <p>{profile.bio}</p>}
          </div>
        )}

        <div className="left">
          <button onClick={() => navigate("/bonds")}>
            Your Bonds
          </button>

          <button onClick={() => navigate("/charity")}>
            Bonds Charity Info
          </button>

          <button
            onClick={() => navigate("/create-bonds")}
            style={{ backgroundColor: "#4CAF50", color: "white" }}
          >
            Create Bonds
          </button>
        </div>

        <div className="right">
          <button
            onClick={() => navigate("/send")}
            className="circle"
          >
            Send
          </button>

          {/* 🔥 EDIT PROFILE BUTTON */}
          <button
            onClick={() => navigate("/edit-profile")}
            className="edit"
          >
            Edit
          </button>
        </div>
      </div>
    </>
  );
}