import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

interface Transaction {
  _id: string;
  job: { _id: string; title: string };
  client: { _id: string; name: string };
  dev: { _id: string; name: string };
  amount: number;
  status: string;
  createdAt: string;
}

export default function AdminTransactions() {
  const { user: currentUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  const isSuperAdmin = currentUser?.role === "super_admin";

  const fetchTransactions = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    params.set("page", String(page));

    api.get(`/admin/transactions?${params}`).then(({ data }) => {
      setTransactions(data.transactions);
      setTotal(data.total);
      setPages(data.pages);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchTransactions(); }, [page, status]);

  const handleRefund = async (txId: string) => {
    try {
      await api.put(`/admin/transactions/${txId}/refund`);
      toast.success("Transaction refunded");
      fetchTransactions();
    } catch {}
  };

  const statusBadge = (s: string) => {
    switch (s) {
      case "pending": return "dh-badge-pending";
      case "held": return "dh-badge-held";
      case "released": return "dh-badge-released";
      case "refunded": return "dh-badge-refunded";
      default: return "dh-badge-pending";
    }
  };

  return (
    <div>
      <div className="dh-page-header">
        <div>
          <h1 className="dh-page-header-title">Transactions</h1>
          <p className="dh-page-header-sub">{total} total transactions</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <select className="dh-select" style={{ width: 160 }} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="held">Held</option>
          <option value="released">Released</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div className="dh-spinner" style={{ margin: "0 auto" }}></div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="dh-empty"><p className="dh-empty-text">No transactions found</p></div>
      ) : (
        <>
          <div className="dh-card" style={{ padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <th style={thStyle}>Job</th>
                  <th style={thStyle}>Client</th>
                  <th style={thStyle}>Developer</th>
                  <th style={thStyle}>Amount</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Date</th>
                  {isSuperAdmin && <th style={thStyle}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={tdStyle}>{tx.job?.title || "Unknown"}</td>
                    <td style={tdStyle}>{tx.client?.name || "Unknown"}</td>
                    <td style={tdStyle}>{tx.dev?.name || "Unknown"}</td>
                    <td style={tdStyle}>
                      <span className="text-cyan" style={{ fontWeight: 600 }}>${tx.amount?.toLocaleString()}</span>
                    </td>
                    <td style={tdStyle}>
                      <span className={statusBadge(tx.status)} style={{ fontSize: "0.6rem" }}>
                        {tx.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, color: "var(--text-dim)", fontSize: "0.78rem" }}>
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    {isSuperAdmin && (
                      <td style={tdStyle}>
                        {tx.status !== "refunded" && (
                          <button onClick={() => handleRefund(tx._id)} className="dh-btn-danger" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>
                            Refund
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="dh-btn-ghost dh-btn-sm">Prev</button>
              <span style={{ display: "flex", alignItems: "center", padding: "0 12px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Page {page} of {pages}
              </span>
              <button disabled={page >= pages} onClick={() => setPage(page + 1)} className="dh-btn-ghost dh-btn-sm">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 16px",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "0.65rem",
  letterSpacing: "0.06em",
  color: "var(--text-dim)",
  textTransform: "uppercase",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 16px",
  color: "var(--text-primary)",
};
