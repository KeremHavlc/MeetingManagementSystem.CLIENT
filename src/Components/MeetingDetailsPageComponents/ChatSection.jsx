import React, { useEffect, useRef } from "react";

const ChatSection = ({ messages, newMessage, setNewMessage, sendMessage }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.user === "Sen") {
        scrollToBottom();
      }
    }
  }, [messages]);

  return (
    <div className="w-2/3">
      <div className="bg-[#1E1E1E] border border-[#2F2F2F] rounded-xl p-6 flex flex-col h-[600px]">
        <h2 className="text-xl font-semibold mb-4 text-white">Sohbet</h2>

        <div className="flex-1 space-y-4 mb-6 h-[450px] overflow-y-auto pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.user === "Sen" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] ${
                  msg.user === "Sen"
                    ? "bg-[#e63946] text-white"
                    : msg.user === "Sistem"
                    ? "bg-[#3A3A3A] text-yellow-200 border border-yellow-600"
                    : "bg-[#2A2A2A] text-white"
                } rounded-xl p-4`}
              >
                {msg.user !== "Sen" && (
                  <p className="font-bold text-sm mb-1">{msg.user}</p>
                )}
                <p className="text-sm mb-1">{msg.text}</p>
                <p className="text-xs text-gray-400">{msg.time}</p>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-[#2F2F2F] pt-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Mesajınızı yazın..."
              className="flex-1 bg-[#2A2A2A] border border-[#2F2F2F] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#e63946] placeholder-gray-500"
            />
            <button
              onClick={sendMessage}
              className="bg-[#e63946] hover:bg-[#b82e38] text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Gönder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
