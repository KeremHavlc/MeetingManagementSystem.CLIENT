import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AddParticipantModal from "./AddParticipantModal";

const roleToTurkish = (role) => {
  switch (role) {
    case "Admin":
      return "Yönetici";
    case "Moderator":
      return "Moderatör";
    case "Participant":
    default:
      return "Katılımcı";
  }
};

const Participants = ({ onGenerateLink }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        const formatted = response.data.data.map((p) => ({
          name: p.userName || p.username,
          role: roleToTurkish(p.roleName),
        }));
        setParticipants(formatted);
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

  const handleAddParticipant = () => {
    fetchParticipants();
    setIsModalOpen(false);
  };

  return (
    <div className="bg-[#1E1E1E] border border-[#2F2F2F] rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Katılımcılar</h2>

      <div className="space-y-3 h-[411px] overflow-y-auto pr-2">
        {participants.length > 0 ? (
          participants.map((p, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-[#2A2A2A] rounded-lg p-3"
            >
              <div className="w-10 h-10 bg-[#e63946] text-white rounded-full flex items-center justify-center font-semibold">
                {p.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-medium">{p.name}</p>
                <p className="text-gray-400 text-sm">{p.role}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">Henüz katılımcı yok.</p>
        )}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full mt-6 py-2 bg-[#e63946] hover:bg-[#b82e38] rounded-lg text-white text-sm font-medium"
      >
        ➕ Katılımcı Ekle
      </button>

      {isModalOpen && (
        <AddParticipantModal
          closeModal={handleAddParticipant}
          onGenerateLink={onGenerateLink}
        />
      )}
    </div>
  );
};

export default Participants;
