import Navbar from "../components/Navbar";
export default function SendPoints() {
return (
<>
<Navbar />
<div className="grid-3">
<button>Friends List</button>
<button>Couples List</button>
<button>NGO / Other List</button>
</div>
</>
);
}