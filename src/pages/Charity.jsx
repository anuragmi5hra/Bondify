import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Charity() {

  const [transactions, setTransactions] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const token = localStorage.getItem("token");

  /* =====================
     FETCH LATEST 10
  ===================== */
  const fetchLatest = async () => {
    try {

      const res = await fetch(`${API_URL}/api/charity/daily`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });

      const data = await res.json();

      setTransactions(data);
      setShowAll(false);

    } catch(err){
      console.error(err);
    }
  };

  /* =====================
     FETCH FULL HISTORY
  ===================== */
  const fetchAll = async () => {
    try{

      const res = await fetch(`${API_URL}/api/charity/all`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });

      const data = await res.json();

      setTransactions(data);
      setShowAll(true);

    }catch(err){
      console.error(err);
    }
  };

  useEffect(()=>{
    fetchLatest();
  },[]);

  return (
    <>
      <Navbar />

      <div className="center-card">

        <h3>
          {showAll ? "All Transaction History" : "Latest 10 Transactions"}
        </h3>

        <table style={{ width:"100%", marginTop:"20px" }}>
          <thead>
            <tr>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Points</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>

          {transactions.length === 0 ? (
            <tr>
              <td colSpan="4" style={{textAlign:"center"}}>
                No transactions found
              </td>
            </tr>
          ) : (
            transactions.map((t,i)=>(
              <tr key={i}>
                <td>{t.sender?.email}</td>
                <td>{t.receiver?.email}</td>
                <td>{t.points}</td>
                <td>{new Date(t.createdAt).toLocaleString()}</td>
              </tr>
            ))
          )}

          </tbody>
        </table>

        {/* BUTTON SECTION */}

        <div style={{marginTop:"20px"}}>

          {!showAll && (
            <button onClick={fetchAll}>
              View All Transactions
            </button>
          )}

          {showAll && (
            <button onClick={fetchLatest}>
              Back to Recent
            </button>
          )}

        </div>

      </div>
    </>
  );
}