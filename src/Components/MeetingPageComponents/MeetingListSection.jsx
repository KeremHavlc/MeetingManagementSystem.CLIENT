import { useState, useEffect } from "react";
import axios from "axios";
import CreateMeetingModal from "./CreateMeetingModal";
import { useNavigate } from "react-router-dom";

const MeetingListSection = ({ onMeetingsLoaded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const navigate = useNavigate();

  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload["Id"] || payload["id"] || payload["nameid"];
    } catch {
      return null;
    }
  };

  const fetchMeetings = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://localhost:7270/api/MeetingParticipant/GetMeetingParticipantsByUserId",
        { userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setMeetings(response.data.data);

        if (onMeetingsLoaded) {
          onMeetingsLoaded(response.data.data);
        }
      }
    } catch (error) {
      console.error("Toplantılar alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const filteredMeetings = meetings.filter((meeting) => {
    const now = new Date();
    const scheduled = new Date(meeting.scheduledAt);
    return activeTab === "upcoming" ? scheduled > now : scheduled <= now;
  });

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Toplantılarım</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#e63946] hover:bg-[#b82e38] text-white px-4 py-2 rounded-lg transition"
        >
          + Toplantı Oluştur
        </button>
      </div>

      {/* Sekmeler */}
      <div className="flex gap-6 border-b border-[#2F2F2F] pb-2">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`pb-2 ${
            activeTab === "upcoming"
              ? "text-[#e63946] font-medium border-b-2 border-[#e63946]"
              : "text-gray-400 hover:text-[#e63946]"
          }`}
        >
          Yaklaşan
        </button>

        <button
          onClick={() => setActiveTab("past")}
          className={`pb-2 ${
            activeTab === "past"
              ? "text-[#e63946] font-medium border-b-2 border-[#e63946]"
              : "text-gray-400 hover:text-[#e63946]"
          }`}
        >
          Geçmiş
        </button>
      </div>

      {/* Toplantılar */}
      <div className="mt-6 flex flex-col gap-4 text-xl font-semibold ">
        {loading ? (
          <p className="text-gray-400">⏳ Toplantılar yükleniyor...</p>
        ) : filteredMeetings.length === 0 ? (
          <p className="text-gray-500 text-xl font-semibold">
            Bu kategoride toplantı yok.
          </p>
        ) : (
          filteredMeetings.map((meeting) => (
            <div
              key={meeting.id}
              onClick={() => navigate(`/meetings/${meeting.id}`)}
              className="cursor-pointer bg-[#1A1A1A] p-4 rounded-lg border border-[#2A2A2A] flex justify-between hover:bg-[#232323] transition"
            >
              <div>
                <span className="text-xs text-green-400 font-medium">
                  {new Date(meeting.scheduledAt) > new Date()
                    ? "YAKLAŞIYOR"
                    : "GEÇTİ"}
                </span>
                <h3 className="text-lg font-semibold">{meeting.title}</h3>
                <p className="text-sm text-gray-400">
                  {new Date(meeting.scheduledAt).toLocaleDateString("tr-TR")}{" "}
                  {new Date(meeting.scheduledAt).toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <CreateMeetingModal
          onClose={() => {
            setIsModalOpen(false);
            fetchMeetings();
          }}
        />
      )}
    </div>
  );
};

export default MeetingListSection;
