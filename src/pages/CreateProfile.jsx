import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CreateProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [dob, setDob] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     🔐 CHECK LOGIN
  ========================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("TOKEN ON LOAD:", token); // 🔥 DEBUG

    if (!token) {
      alert("Please login first");
      navigate("/");
    }
  }, [navigate]);

  /* =========================
     📸 OPEN FILE PICKER
  ========================= */
  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  /* =========================
     📸 UPLOAD PHOTO
  ========================= */
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/");
      return;
    }

    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await fetch(`${API_URL}/api/profile/photo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Image upload failed");
        return;
      }

      console.log("Photo upload success:", data);

    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    }
  };

  /* =========================
     💾 SAVE PROFILE
  ========================= */
  const handleCreateProfile = async () => {
    if (!username.trim()) {
      alert("Username is required");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/");
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
        body: JSON.stringify({ username, bio, dob })
      });

      const data = await res.json();

      console.log("PROFILE SAVE RESPONSE:", data); // 🔥 DEBUG

      if (!res.ok) {
        alert(data.message || "Profile save failed");
        return;
      }

      alert("Profile created successfully 🎉");
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="profile-layout">
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