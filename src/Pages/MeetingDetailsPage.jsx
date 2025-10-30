import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import * as signalR from "@microsoft/signalr";

import AuthHeader from "../Components/AuthHeader";
import ChatSection from "../Components/MeetingDetailsPageComponents/ChatSection";
import AgendaSection from "../Components/MeetingDetailsPageComponents/AgendaSection";
import ParticipantsToggle from "../Components/MeetingDetailsPageComponents/ParticipantsToggle";
import Participants from "../Components/MeetingDetailsPageComponents/Participants";
import OpenAssignmentModal from "../Components/MeetingDetailsPageComponents/OpenAssignmentModal";
import OpenDecisionModal from "../Components/MeetingDetailsPageComponents/OpenDecisionModal";

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
  const [showParticipantsPanel, setShowParticipantsPanel] = useState(false);

  const [agendaItems, setAgendaItems] = useState([]);
  const [agendaProgress, setAgendaProgress] = useState(0);

  const [isDecisionOpen, setIsDecisionOpen] = useState(false);
  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState(null);

  const currentUserId = getUserIdFromToken();
  const agendaRef = useRef();

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
      if (result.success) setMeetingDetails(result.data);
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

  const openDecisionModal = () => {
    setIsDecisionOpen(true);
  };
  const closeDecisionModal = () => {
    setIsDecisionOpen(false);
    agendaRef.current?.fetchDecisions();
  };

  const openAssignmentModal = (decision) => {
    setSelectedDecision(decision);
    setIsAssignmentOpen(true);
  };
  const closeAssignmentModal = () => {
    setIsAssignmentOpen(false);
    setSelectedDecision(null);
    agendaRef.current?.fetchDecisions();
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white select-none">
      <AuthHeader />

      <div className="w-[1100px] mx-auto mt-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl mb-2 font-semibold">
              {meetingDetails ? meetingDetails.title : "Toplantı Detay"}
            </h1>
            <p className="text-gray-400 font-semibold mt-6">
              {meetingDetails &&
                new Date(meetingDetails.scheduledAt).toLocaleString("tr-TR", {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ParticipantsToggle
              onToggle={() => setShowParticipantsPanel((prev) => !prev)}
            />
          </div>
        </div>

        <div className="flex gap-6 mt-6">
          <ChatSection
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
          />

          <div className="w-[400px] space-y-4">
            {showParticipantsPanel && (
              <div className="bg-[#1E1E1E] border border-[#2F2F2F] rounded-xl p-4">
                <Participants />
              </div>
            )}

            <AgendaSection
              ref={agendaRef}
              agendaItems={agendaItems}
              agendaProgress={agendaProgress}
              setAgendaProgress={setAgendaProgress}
              openDecisionModal={openDecisionModal}
              openAssignmentModal={openAssignmentModal}
            />
          </div>
        </div>
      </div>

      <OpenDecisionModal
        isOpen={isDecisionOpen}
        onClose={closeDecisionModal}
        meetingId={meetingId}
        onAdded={() => agendaRef.current?.fetchDecisions()}
      />

      <OpenAssignmentModal
        isOpen={isAssignmentOpen}
        onClose={closeAssignmentModal}
        meetingId={meetingId}
        decision={selectedDecision}
      />
    </div>
  );
};

export default MeetingDetailsPage;
