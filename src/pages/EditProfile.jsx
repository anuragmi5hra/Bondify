import Navbar from "../components/Navbar";
export default function EditProfile() {
return (
<>
<Navbar />
<div className="profile-layout">
<div className="left">
<button>Edit Photo</button>
</div>
<div className="right">
<input placeholder="Edit Username" />
<input placeholder="Edit Bio" />
<button>Save Profile</button>
</div>
</div>
</>
);
}