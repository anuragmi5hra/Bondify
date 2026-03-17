import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const claimDailyPoints = async () => {
      try {
        const res = await fetch(`${API_URL}/api/points/daily`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (data.message === "Daily 10 points received 🎉") {
          alert("🎉 You received 10 daily points!");
        }

      } catch (err) {
        console.error("Daily points error:", err);
      }
    };

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          navigate("/");
          return;
        }

        const data = await res.json();
        setProfile(data);

      } catch (err) {
        console.error(err);
      }
    };

    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${API_URL}/api/charity/daily`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (res.ok) setTransactions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Transactions error:", err);
      }
    };

    claimDailyPoints();
    Promise.all([fetchProfile(), fetchTransactions()]).finally(() => setLoading(false));

  }, [navigate]);

  const myId = profile?._id;

  const sentPoints = transactions.reduce((sum, t) => {
    const senderId = typeof t.sender === "string" ? t.sender : t.sender?._id;
    return senderId && myId && senderId === myId ? sum + (t.points || 0) : sum;
  }, 0);

  const receivedPoints = transactions.reduce((sum, t) => {
    const receiverId = typeof t.receiver === "string" ? t.receiver : t.receiver?._id;
    return receiverId && myId && receiverId === myId ? sum + (t.points || 0) : sum;
  }, 0);

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
                <h2 className="title">Dashboard</h2>
                <p className="subtle">Your points, bonds, and recent activity — at a glance.</p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <button className="btn btn-secondary" onClick={() => navigate("/create-bonds")}>
                  Create bonds
                </button>
                <button className="btn btn-primary" onClick={() => navigate("/send")}>
                  Send points
                </button>
              </div>
            </div>

            <div className="divider" />

            <div className="grid-2">
              <div className="card card-solid card-pad" style={{ boxShadow: "none" }}>
                <div className="card-header" style={{ marginBottom: 10 }}>
                  <div>
                    <h3 className="title" style={{ fontSize: 16 }}>Your profile</h3>
                    <p className="subtle">Quick identity + wallet status</p>
                  </div>
                  <button className="btn btn-ghost" onClick={() => navigate("/edit-profile")}>
                    Manage
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 54, height: 54, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(15,23,42,0.10)" }}>
                    <img
                      src={
                        profile?.profilePic
                          ? `${API_URL}/uploads/${profile.profilePic}`
                          : "/default-avatar.png"
                      }
                      alt="Profile"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 800, letterSpacing: "-0.02em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {profile?.username || "Your account"}
                    </div>
                    <div className="muted" style={{ fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {profile?.email || "—"}
                    </div>
                  </div>
                </div>

                {profile?.bio && (
                  <p className="hint" style={{ marginTop: 12 }}>
                    {profile.bio}
                  </p>
                )}
              </div>

              <div className="grid" style={{ gap: 14 }}>
                <div className="stats-grid">
                  <div className="card stat-card">
                    <p className="stat-label">Total Points</p>
                    <div className="stat-row">
                      <p className="stat-value">{profile?.points ?? "—"}</p>
                      <span className="badge" title="Available balance">
                        <span className="badge-dot" /> Wallet
                      </span>
                    </div>
                  </div>
                  <div className="card stat-card">
                    <p className="stat-label">Sent</p>
                    <div className="stat-row">
                      <p className="stat-value">{loading ? "—" : sentPoints}</p>
                      <span className="badge badge-danger" title="Points sent out">
                        <span className="badge-dot" /> Outgoing
                      </span>
                    </div>
                  </div>
                  <div className="card stat-card">
                    <p className="stat-label">Received</p>
                    <div className="stat-row">
                      <p className="stat-value">{loading ? "—" : receivedPoints}</p>
                      <span className="badge badge-success" title="Points received">
                        <span className="badge-dot" /> Incoming
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card card-pad" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button className="btn btn-secondary" onClick={() => navigate("/bonds")}>
                    View bonds
                  </button>
                  <button className="btn btn-secondary" onClick={() => navigate("/charity")}>
                    Transaction history
                  </button>
                  <button className="btn btn-ghost" onClick={() => navigate("/create-bonds")}>
                    Discover people
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card card-pad">
            <div className="card-header">
              <div>
                <h3 className="title" style={{ fontSize: 16 }}>Recent transactions</h3>
                <p className="subtle">Last 10 movements in your wallet</p>
              </div>
              <button className="btn btn-ghost" onClick={() => navigate("/charity")}>
                View all
              </button>
            </div>

            <div className="table-wrap">
              <table className="table" aria-label="Recent transactions">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Points</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="muted">
                        {loading ? "Loading..." : "No transactions yet"}
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
                          <td className="muted">{t.sender?.email || "—"}</td>
                          <td className="muted">{t.receiver?.email || "—"}</td>
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