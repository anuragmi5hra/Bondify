import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Charity() {

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH USER CHARITY DATA
  ========================= */
  useEffect(() => {

    const fetchTransactions = async () => {
      try {

        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/charity/daily`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("API error:", data.message);
          return;
        }

        setTransactions(data);

      } catch (err) {
        console.error("Error fetching charity data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

  }, []);

  return (
    <>
      <Navbar />

      <div className="center-card">

        <h3>Daily Sent & Received Bond Points</h3>

        {loading ? (
          <p>Loading transactions...</p>
        ) : (

        <table style={{ width: "100%", marginTop: "20px" }}>
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
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No charity transactions today
                </td>
              </tr>
            ) : (
              transactions.map((t, i) => (
                <tr key={i}>
                  <td>{t.sender?.email || "Unknown"}</td>
                  <td>{t.receiver?.email || "Unknown"}</td>
                  <td>{t.points}</td>
                  <td>{new Date(t.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}

          </tbody>
        </table>

        )}

      </div>
    </>
  );
}