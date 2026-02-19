import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CreateProfile() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [dob, setDob] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  // 📸 Open file manager
  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  // 📸 Handle image selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("profilePic", file);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/api/profile/photo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Image upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    }
  };

  // 💾 Save profile info
  const handleCreateProfile = async () => {
    if (!username.trim()) {
      alert("Username is required");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("User not authenticated");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/profile/me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          username,
          bio,
          dob
        })
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Backend error:", data);
        alert(data.message || "Profile save failed");
        return;
      }

      alert("Profile created successfully 🎉");
      navigate("/create-bonds");

    } catch (err) {
      console.error("Server error:", err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="profile-layout">
        {/* LEFT SIDE */}
        <div className="left">
          <button onClick={handlePhotoClick}>
            Set Profile Picture
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                marginTop: "15px",
                objectFit: "cover"
              }}
            />
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="right">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />

          <button onClick={handleCreateProfile} disabled={loading}>
            {loading ? "Saving..." : "Create Profile"}
          </button>
        </div>
      </div>
    </>
  );
}