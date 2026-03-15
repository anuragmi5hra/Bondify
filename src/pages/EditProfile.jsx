import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

export default function EditProfile() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [dob, setDob] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");

  const token = localStorage.getItem("token");

  /* =========================
     GET PROFILE
  ========================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsername(res.data.username || "");
        setBio(res.data.bio || "");
        setDob(res.data.dob || "");

        if (res.data.profilePic) {
          setPreview(`${API_URL}/uploads/${res.data.profilePic}`);
        }

      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);

  /* =========================
     UPDATE PROFILE
  ========================= */
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

      alert("Profile updated successfully ✅");

    } catch (err) {
      console.log(err);
      alert("Update failed ❌");
    }
  };

  /* =========================
     UPLOAD PROFILE PHOTO
  ========================= */
  const handlePhotoUpload = async () => {
    if (!profilePic) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", profilePic);

    try {
      const res = await axios.post(
        `${API_URL}/api/profile/photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Photo updated successfully 📸");

      setPreview(`${API_URL}/uploads/${res.data.profilePic}`);

    } catch (err) {
      console.log(err);
      alert("Photo upload failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Edit Profile</h2>

      {/* PROFILE PHOTO */}
      {preview && (
        <img
          src={preview}
          alt="Profile"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "20px"
          }}
        />
      )}

      <br />

      <input
        type="file"
        onChange={(e) => setProfilePic(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handlePhotoUpload}>
        Update Profile Photo
      </button>

      <hr style={{ margin: "30px 0" }} />

      {/* PROFILE INFO FORM */}
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

        <button type="submit">
          Update Profile
        </button>
      </form>
    </div>
  );
}