import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

const typeIcons: Record<string, string> = {
  proposal_received: "📋",
  proposal_accepted: "✅",
  new_message: "💬",
  job_awarded: "🏆",
  payment_released: "💰",
  review_received: "⭐",
  work_submitted: "📤",
  job_completed: "✔️",
};

function getNotifLink(notif: any): string {
  const d = notif.data || {};
  if (d.jobId) return `/jobs/${d.jobId}`;
  if (d.conversationId) return `/messages`;
  if (d.proposalId && d.jobId) return `/jobs/${d.jobId}`;
  return "/dashboard";
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleNotifClick = async (notif: any) => {
    if (!notif.read) await markAsRead(notif._id);
    setOpen(false);
    navigate(getNotifLink(notif));
  };

  const recentUnread = notifications.filter((n) => !n.read).slice(0, 5);
  const recentAll = notifications.slice(0, 8);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: "var(--card)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          position: "relative",
          color: "var(--text-muted)",
          flexShrink: 0,
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--cyan)";
          e.currentTarget.style.color = "var(--cyan)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.color = "var(--text-muted)";
        }}
        title="Notifications"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
          <path d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.543 1.23H3.675a.75.75 0 01-.543-1.23A8.25 8.25 0 005.25 9.75V9z" />
          <path d="M7.5 15v.75a4.5 4.5 0 009 0V15" />
        </svg>
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--crimson)",
              border: "2px solid var(--card)",
            }}
          />
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 360,
            maxHeight: 480,
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
            overflow: "hidden",
            zIndex: 60,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "var(--text-primary)",
              }}
            >
              Notifications
              {unreadCount > 0 && (
                <span style={{ color: "var(--text-dim)", fontWeight: 400, fontSize: "0.8rem", marginLeft: 8 }}>
                  ({unreadCount} unread)
                </span>
              )}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.06em",
                  color: "var(--cyan)",
                  padding: 0,
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          <div style={{ overflowY: "auto", flex: 1 }}>
            {recentAll.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", margin: 0 }}>No notifications yet</p>
              </div>
            ) : (
              recentAll.map((notif) => {
                const isUnread = !notif.read;
                return (
                  <button
                    key={notif._id}
                    onClick={() => handleNotifClick(notif)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "14px 20px",
                      border: "none",
                      borderBottom: "1px solid var(--border)",
                      background: isUnread ? "var(--pill-hover-bg)" : "transparent",
                      cursor: "pointer",
                      display: "flex",
                      gap: 12,
                      color: "inherit",
                      fontFamily: "inherit",
                      fontSize: "inherit",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--card-hover)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = isUnread ? "var(--pill-hover-bg)" : "transparent"; }}
                  >
                    <span style={{ fontSize: "1.1rem", flexShrink: 0, marginTop: 2 }}>
                      {typeIcons[notif.type] || "🔔"}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                        <span
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: isUnread ? 700 : 500,
                            fontSize: "0.82rem",
                            color: "var(--text-primary)",
                          }}
                        >
                          {notif.title}
                        </span>
                        {isUnread && (
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "var(--cyan)",
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </div>
                      <p
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--text-muted)",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          lineHeight: 1.4,
                        }}
                      >
                        {notif.message}
                      </p>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.6rem",
                          color: "var(--text-dim)",
                          marginTop: 4,
                          display: "block",
                        }}
                      >
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
