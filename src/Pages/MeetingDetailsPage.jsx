import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as signalR from "@microsoft/signalr";

import AuthHeader from "../Components/AuthHeader";
import ChatSection from "../Components/MeetingDetailsPageComponents/ChatSection";
import Participants from "../Components/MeetingDetailsPageComponents/Participants";
import AgendaSection from "../Components/MeetingDetailsPageComponents/AgendaSection";

// ✅ Token’dan UserId alma
const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload["Id"] || payload["id"] || payload["nameid"];
};

// ✅ "kerem havlucu" → "Kerem Havlucu" çevir
const formatName = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

// ✅ Backend’den userName/fullName alma
const fetchUserName = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      "https://localhost:7270/api/User/GetUserNameByUserId",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      }
    );

    const data = await res.json();
    if (data.success && data.data) {
      return formatName(data.data.fullName || data.data.userName);
    }
    return userId;
  } catch (err) {
    console.error("❌ Kullanıcı bilgisi alınamadı:", err);
    return userId;
  }
};

const MeetingDetailsPage = () => {
  const { id: meetingId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connection, setConnection] = useState(null);

  const currentUserId = getUserIdFromToken();

  // ✅ 1) Eski mesajları yükle & username’e çevir
  useEffect(() => {
    const loadMessages = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://localhost:7270/api/ChatMessages/by-meeting?meetingId=${meetingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      const mapped = await Promise.all(
        data.map(async (msg) => {
          let user =
            msg.senderId === currentUserId
              ? "Sen"
              : await fetchUserName(msg.senderId);

          return {
            id: msg.id,
            user: user,
            text: msg.message,
            time: new Date(msg.createdAt).toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        })
      );

      setMessages(mapped);
    };

    if (meetingId) loadMessages();
  }, [meetingId]);

  // ✅ 2) SignalR bağlantısı & anlık mesaj alma
  useEffect(() => {
    if (!meetingId) return;

    const connect = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7270/chatHub", {
        accessTokenFactory: () => localStorage.getItem("token") || "",
      })
      .withAutomaticReconnect()
      .build();

    connect.start().then(() => {
      console.log("✅ SignalR bağlantı kuruldu");
      connect.invoke("JoinMeetingGroup", meetingId);
    });

    connect.on("ReceiveMessage", async (msg) => {
      let user =
        msg.senderId === currentUserId
          ? "Sen"
          : await fetchUserName(msg.senderId);

      setMessages((prev) => [
        ...prev,
        {
          id: msg.id,
          user: user,
          text: msg.message,
          time: new Date(msg.createdAt).toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    });

    setConnection(connect);
    return () => connect.off("ReceiveMessage");
  }, [meetingId]);

  // ✅ 3) Mesaj gönder
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.warn("⚠ SignalR bağlı değil!");
      return;
    }

    await connection.invoke(
      "SendMessage",
      meetingId,
      currentUserId,
      newMessage
    );
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <AuthHeader />

      <div className="w-[1100px] mx-auto mt-4">
        <h1 className="text-3xl font-bold mb-2">Toplantı Detay</h1>
        <p className="text-gray-400 mb-8">Meeting ID: {meetingId}</p>

        <div className="flex gap-6">
          <ChatSection
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
          />
          <div className="w-1/3 space-y-6">
            <Participants participants={[]} />
            <AgendaSection agendaItems={[]} agendaProgress={0} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailsPage;
