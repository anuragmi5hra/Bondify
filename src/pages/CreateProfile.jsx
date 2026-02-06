import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";


export default function CreateProfile() {
const navigate = useNavigate();


return (
<>
<Navbar />
<div className="profile-layout">
<div className="left">
<button>Set Profile Picture</button>
</div>
<div className="right">
<input placeholder="Username" />
<input placeholder="Bio" />
<input type="date" />
<button onClick={() => navigate("/dashboard")}>Create Profile</button>
</div>
</div>
</>
);
}