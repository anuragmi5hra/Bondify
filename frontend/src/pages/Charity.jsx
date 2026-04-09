import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_URL = "https://bondify-hu7v.onrender.com";

export default function Charity() {

  const [transactions, setTransactions] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/profile/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(()=>{
    Promise.all([fetchProfile(), fetchLatest()]).finally(() => setLoading(false));
  },[]);

  const myId = profile?._id;
  const classifyTx = (t) => {
    const senderId = typeof t.sender === "string" ? t.sender : t.sender?._id;
    return senderId && myId && senderId === myId ? "sent" : "received";
  };

  return (
    <>
      <Navbar profile={profile} />

      <div className="page">
        <div className="container grid" style={{ gap: 16 }}>
          <div className="card card-pad">

            <div className="card-header">
              <div>
                <h2 className="title">Charity</h2>
                <p className="subtle">A clean view of your full transaction history.</p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <button
                  className={`btn ${showAll ? "btn-secondary" : "btn-primary"}`}
                  onClick={fetchLatest}
                  disabled={loading || !showAll}
                >
                  Recent (10)
                </button>
                <button
                  className={`btn ${showAll ? "btn-primary" : "btn-secondary"}`}
                  onClick={fetchAll}
                  disabled={loading || showAll}
                >
                  All history
                </button>
              </div>
            </div>

            <div className="divider" />

            <div className="table-wrap">
              <table className="table" aria-label="Transaction history">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Sender</th>
                    <th>Receiver</th>
                    <th>Points</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="muted">
                        {loading ? "Loading..." : "No transactions found"}
                      </td>
                    </tr>
                  ) : (
                    transactions.map((t, i) => {
                      const kind = classifyTx(t);
                      const chipClass = kind === "sent" ? "tx-chip tx-sent" : "tx-chip tx-received";
                      return (
                        <tr key={t._id || i}>
                          <td>
                            <span className={chipClass}>
                              <span className="dot" />
                              {kind === "sent" ? "Sent" : "Received"}
                            </span>
                          </td>
                          <td className="muted">
  {t.sender?.isDeleted ? "User Suspended" : t.sender?.email || "—"}
</td>

<td className="muted">
  {t.receiver?.isDeleted ? "User Suspended" : t.receiver?.email || "—"}
</td>
                          <td style={{ fontWeight: 800, color: kind === "sent" ? "rgba(180, 28, 28, 0.98)" : "rgba(12, 110, 70, 0.98)" }}>
                            {kind === "sent" ? "-" : "+"}{t.points}
                          </td>
                          <td className="muted">{t.createdAt ? new Date(t.createdAt).toLocaleString() : "—"}</td>
                        </tr>
                      );
                    })
                  )}

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}