import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ParticipantsToggle = ({ onToggle }) => {
  const [participants, setParticipants] = useState([]);
  const { id: meetingId } = useParams();

  const fetchParticipants = async () => {
    if (!meetingId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${
          import.meta.env.VITE_BASE_URL
        }/MeetingParticipant/GetMeetingParticipantByMeetingId`,
        { meetingId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setParticipants(response.data.data);
      }
    } catch (error) {
      console.error("Katılımcılar alınırken hata:", error);
    }
  };

  useEffect(() => {
    fetchParticipants();
    const interval = setInterval(fetchParticipants, 5000);
    return () => clearInterval(interval);
  }, [meetingId]);

  return (
    <div
      className="flex flex-col items-center cursor-pointer group"
      onClick={onToggle}
    >
      <div className="flex -space-x-4">
        {participants.slice(0, 5).map((p, index) => (
          <div
            key={index}
            className="w-14 h-14 rounded-full bg-[#e63946] text-white flex items-center justify-center font-bold border-2 border-[#121212] transition duration-150 ease-in-out group-hover:scale-105"
            title={p.userName}
          >
            {p.username?.charAt(0)?.toUpperCase() || "?"}
          </div>
        ))}

        {participants.length > 5 && (
          <div className="w-11 h-11 rounded-full bg-gray-600 text-white flex items-center justify-center font-bold border-2 border-[#121212] transition duration-150 ease-in-out group-hover:scale-105">
            +{participants.length - 5}
          </div>
        )}
      </div>

      <span className="text-sm text-gray-400 mt-2">
        Katılımcı eklemek için tıklayın
      </span>

      <div className="relative">
        <div className="w-[380px] mt-4 rounded-4xl p-[0.450px] bg-[#e63946] border border-[#e63946] shadow-md animate-customBounce transition duration-300 ease-in-out group-hover:bg-[#b82e38]"></div>

        <style>
          {`
      @keyframes customBounce {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-5px); 
        }
      }
      .animate-customBounce {
        animation: customBounce 1.5s infinite;
      }
    `}
        </style>
      </div>
    </div>
  );
};

export default ParticipantsToggle;
