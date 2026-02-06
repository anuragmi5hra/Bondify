import Navbar from "../components/Navbar";
export default function BondSummary() {
return (
<>
<Navbar />
<div className="grid-3">
<button>Friend Bonds</button>
<button>Couple Bonds</button>
<button>NGO / Other Bonds</button>
</div>
</>
);
}