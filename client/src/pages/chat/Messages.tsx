import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

interface Conversation {
  _id: string;
  client: { _id: string; name: string; avatar?: string };
  dev: { _id: string; name: string; avatar?: string };
  job: { _id: string; title: string };
  lastMessage?: string;
  lastMessageAt?: string;
}

interface Message {
  _id: string;
  sender: { _id: string; name: string; avatar?: string };
  content: string;
  createdAt: string;
  read: boolean;
}

export default function Messages() {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api
      .get("/messages/conversations")
      .then(({ data }) => {
        setConversations(data);
        const targetId = (location.state as any)?.conversationId;
        if (targetId && data.some((c: Conversation) => c._id === targetId)) {
          setSelected(targetId);
        }
      });
  }, [location.state]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const s = io({ auth: { token } });
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !selected) return;
    socket.emit("join:conversation", selected);
    api
      .get(`/messages/conversations/${selected}`)
      .then(({ data }) => setMessages(data));

    const onNew = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on("message:new", onNew);
    return () => {
      socket.emit("leave:conversation", selected);
      socket.off("message:new", onNew);
    };
  }, [socket, selected]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socket || !selected) return;
    socket.emit("message:send", { conversationId: selected, content: input });
    setInput("");
  };

  const otherPerson = (conv: Conversation) => {
    if (!user) return null;
    return user._id === conv.client._id ? conv.dev : conv.client;
  };

  const selectedConv = conversations.find((c) => c._id === selected);
  const otherUser = selectedConv ? otherPerson(selectedConv) : null;

  return (
    <div className="dh-root">
      <div className="h-screen flex overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-80" style={{ borderRight: "1px solid var(--border)", background: "var(--surface)", display: "flex", flexDirection: "column" }}>
          <div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-cyan" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.4rem", margin: "0 0 4px" }}>
              Messages
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
              {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div style={{ padding: "24px", textAlign: "center" }}>
                <p style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>No conversations yet</p>
              </div>
            ) : (
              <div style={{ padding: 8 }}>
                {conversations.map((conv) => {
                  const other = otherPerson(conv);
                  if (!other) return null;
                  const isSelected = selected === conv._id;
                  return (
                    <button
                      key={conv._id}
                      onClick={() => setSelected(conv._id)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: 16,
                        borderRadius: 8,
                        marginBottom: 8,
                        border: isSelected ? "1px solid var(--cyan)" : "1px solid transparent",
                        background: isSelected ? "var(--card)" : "transparent",
                        color: "inherit",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        fontFamily: "inherit",
                        fontSize: "inherit",
                      }}
                      onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.background = "var(--card)"; }}}
                      onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.background = "transparent"; }}}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div className="dh-avatar dh-avatar-sm">
                          {other.avatar ? (
                            <img src={other.avatar} alt={other.name} className="dh-avatar-img" />
                          ) : (
                            other.name[0]
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {other.name}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {conv.job.title}
                          </div>
                        </div>
                      </div>
                      {conv.lastMessage && (
                        <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 8, marginLeft: 44 }}>
                          {conv.lastMessage}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selected && selectedConv ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="dh-avatar">
                    {otherUser?.avatar ? (
                      <img src={otherUser.avatar} alt={otherUser.name} className="dh-avatar-img" />
                    ) : (
                      otherUser?.name[0]
                    )}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)", margin: 0 }}>{otherUser?.name}</h3>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-dim)", margin: 0 }}>{selectedConv.job.title}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
                {messages.length === 0 ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ color: "var(--text-dim)" }}>No messages yet. Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender._id === user?._id;
                    return (
                      <div
                        key={msg._id}
                        style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}
                      >
                        <div
                          style={{
                            maxWidth: "320px",
                            padding: "12px 16px",
                            borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                            background: isMe ? "var(--cyan)" : "var(--card)",
                            color: isMe ? "#000" : "var(--text-primary)",
                            border: isMe ? "none" : "1px solid var(--border)",
                          }}
                        >
                          <div style={{ fontSize: "0.88rem", lineHeight: 1.5, wordBreak: "break-word" }}>
                            {msg.content}
                          </div>
                          <div style={{ fontSize: "0.7rem", marginTop: 6, opacity: 0.6 }}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input Area */}
              <div style={{ padding: "24px", borderTop: "1px solid var(--border)", background: "var(--card)" }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                    placeholder="Type a message... (Enter to send)"
                    className="dh-input"
                  />
                  <button onClick={sendMessage} className="dh-btn-primary" style={{ flexShrink: 0 }}>
                    ➤ Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "var(--text-dim)" }}>Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
