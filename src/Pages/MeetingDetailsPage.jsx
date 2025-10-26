import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as signalR from "@microsoft/signalr";

import AuthHeader from "../Components/AuthHeader";
import ChatSection from "../Components/MeetingDetailsPageComponents/ChatSection";
import Participants from "../Components/MeetingDetailsPageComponents/Participants";
import AgendaSection from "../Components/MeetingDetailsPageComponents/AgendaSection";

const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload["Id"] || payload["id"] || payload["nameid"];
};

const formatName = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

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
  } catch {
    return userId;
  }
};

const MeetingDetailsPage = () => {
  const { id: meetingId } = useParams();
  const [meetingDetails, setMeetingDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connection, setConnection] = useState(null);

  const currentUserId = getUserIdFromToken();

  useEffect(() => {
    if (!meetingId) return;

    const fetchMeetingDetails = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://localhost:7270/api/Meetings/GetMeetingById",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ meetingId }),
        }
      );

      const result = await res.json();
      if (result.success) {
        setMeetingDetails(result.data);
      }
    };

    fetchMeetingDetails();
  }, [meetingId]);

  useEffect(() => {
    if (!meetingId) return;
    const token = localStorage.getItem("token");

    const loadMessages = async () => {
      const res = await fetch(
        `https://localhost:7270/api/ChatMessages/by-meeting?meetingId=${meetingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      const mapped = await Promise.all(
        data.map(async (msg) => {
          const user =
            msg.senderId === currentUserId
              ? "Sen"
              : await fetchUserName(msg.senderId);

          return {
            id: msg.id,
            user,
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

    loadMessages();
  }, [meetingId]);

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
      const user =
        msg.senderId === currentUserId
          ? "Sen"
          : await fetchUserName(msg.senderId);

      setMessages((prev) => [
        ...prev,
        {
          id: msg.id,
          user,
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

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    )
      return;

    await connection.invoke(
      "SendMessage",
      meetingId,
      currentUserId,
      newMessage
    );
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white select-none">
      <AuthHeader />
      <div className="w-[1100px] mx-auto mt-4">
        <h1 className="text-3xl mb-2 font-semibold">
          {meetingDetails ? meetingDetails.title : "Toplantı Detay"}
        </h1>

        <p className="text-gray-400 mb-2 font-semibold">
          {meetingDetails &&
            new Date(meetingDetails.scheduledAt).toLocaleString("tr-TR", {
              dateStyle: "full",
              timeStyle: "short",
            })}
        </p>

        <p className="text-gray-500 mb-8"></p>

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
