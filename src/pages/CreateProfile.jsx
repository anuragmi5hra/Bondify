import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

export default function CreateProfile() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [dob, setDob] = useState("");
  const [preview, setPreview] = useState(null);

  const fileInputRef = useRef();

  // 📸 Open file manager
  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  // 📸 Handle image selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("profilePic", file);

    const token = localStorage.getItem("token");

    try {
      await fetch(`${API_URL}/api/profile/photo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    }
  };

  // 💾 Save profile info
  const handleCreateProfile = async () => {
    if (!username) {
      alert("Username is required");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/api/profile/me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ username, bio, dob })
      });

      if (!res.ok) {
        alert("Profile save failed");
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Server error");
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

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {/* Preview Image */}
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

          <button onClick={handleCreateProfile}>
            Create Profile
          </button>
        </div>
      </div>
    </>
  );
}
