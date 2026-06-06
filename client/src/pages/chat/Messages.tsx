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
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="h-screen flex overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 glass-card-light rounded-none flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold gradient-text">💬 Messages</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {conversations.length} conversation
              {conversations.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-6 text-center">
                <span className="text-3xl block mb-2">📭</span>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  No conversations yet
                </p>
              </div>
            ) : (
              <div className="p-2">
                {conversations.map((conv) => {
                  const other = otherPerson(conv);
                  if (!other) return null;
                  const isSelected = selected === conv._id;
                  return (
                    <button
                      key={conv._id}
                      onClick={() => setSelected(conv._id)}
                      className={`w-full text-left p-4 rounded-lg transition-all mb-2 ${
                        isSelected
                          ? "glass-card bg-primary-500/10 dark:bg-primary-500/10 border-primary-500"
                          : "glass hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="avatar text-sm">{other.name[0]}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">
                            {other.name}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                            {conv.job.title}
                          </div>
                        </div>
                      </div>
                      {conv.lastMessage && (
                        <div className="text-xs text-slate-500 dark:text-slate-500 truncate mt-2 ml-10">
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
              <div className="glass-card-light rounded-none border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="avatar">{otherUser?.name[0]}</div>
                  <div>
                    <h3 className="font-bold">{otherUser?.name}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {selectedConv.job.title}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <span className="text-4xl block mb-2">👋</span>
                      <p className="text-slate-600 dark:text-slate-400">
                        No messages yet. Start the conversation!
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender._id === user?._id;
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-3 rounded-2xl ${
                            isMe
                              ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-tr-none shadow-lg"
                              : "glass rounded-tl-none"
                          }`}
                        >
                          <div className="text-sm leading-relaxed break-words">
                            {msg.content}
                          </div>
                          <div
                            className={`text-xs mt-2 opacity-70 ${
                              isMe
                                ? "text-slate-100"
                                : "text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input Area */}
              <div className="glass-card-light rounded-none border-t border-slate-200/50 dark:border-slate-700/50 p-6">
                <div className="flex gap-3">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      (e.preventDefault(), sendMessage())
                    }
                    placeholder="Type a message... (Enter to send)"
                    className="form-input"
                  />
                  <button
                    onClick={sendMessage}
                    className="btn btn-primary flex-shrink-0 flex items-center gap-2"
                  >
                    ➤ Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <span className="text-5xl block mb-3">💭</span>
                <p className="text-slate-600 dark:text-slate-400">
                  Select a conversation to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
