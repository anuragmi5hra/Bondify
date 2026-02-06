import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
const navigate = useNavigate();
return (
<>
<Navbar />
<div className="dashboard">
<div className="left">
<button onClick={() => navigate("/bonds")}>Your Bonds</button>
<button onClick={() => navigate("/charity")}>Bonds Charity Info</button>
</div>
<div className="right">
<button onClick={() => navigate("/send")} className="circle">Send</button>
<button onClick={() => navigate("/edit-profile")} className="edit">Edit</button>
</div>
</div>
</>
);
}