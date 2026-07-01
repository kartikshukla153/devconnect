import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { getSocket } from "../socket/socket";

function ChatWindow({ conversationId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const bottomRef = useRef(null);

  const token = localStorage.getItem("token");

  const fetchMessages = async () => {
    if (!conversationId) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/messages/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(res.data.messages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    const socket = getSocket();

    if (!socket) return;

    socket.on("receive_message", (message) => {
      if (message.conversation === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [conversationId]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      await axios.post(
        "http://localhost:5000/api/messages",
        {
          conversationId,
          text,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setText("");

      fetchMessages();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#111827] rounded-xl border border-gray-700">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className="bg-cyan-600 px-4 py-2 rounded-lg w-fit max-w-[70%]"
          >
            {msg.text}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="flex border-t border-gray-700">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          className="flex-1 bg-transparent p-4 outline-none"
        />

        <button
          onClick={sendMessage}
          className="px-6 bg-cyan-500 text-black font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;