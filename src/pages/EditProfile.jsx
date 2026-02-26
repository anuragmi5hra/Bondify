import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function EditProfile() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [dob, setDob] = useState("");

  const token = localStorage.getItem("token");

  // 🔥 Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  // 🔥 Fetch existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/profile/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsername(res.data.username || "");
        setBio(res.data.bio || "");

        // Fix date format for input type="date"
        if (res.data.dob) {
          setDob(res.data.dob.substring(0, 10));
        }

      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchProfile();
  }, [token]);

  // 🔥 Update profile
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

      alert("Profile Updated Successfully ✅");

      // Redirect back to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Update Failed ❌");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Edit Profile</h2>

      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br /><br />

        <input
          type="text"
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <br /><br />

        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <br /><br />

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}