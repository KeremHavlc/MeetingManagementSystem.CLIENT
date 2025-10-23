import { useState, useEffect } from "react";
import axios from "axios";
import CreateMeetingModal from "./CreateMeetingModal";

const MeetingListSection = ({ onSelectMeeting }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload["Id"];
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
        "https://localhost:7270/api/Meetings/GetMeetingByUserId",
        { userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMeetings(response.data.data);
    } catch (error) {
      console.error("Toplantılar alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <div className="flex-1">
      {/* Üst Bar */}
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
        <button className="text-[#e63946] font-medium border-b-2 border-[#e63946] pb-2">
          Yaklaşan
        </button>
        <button className="text-gray-400 hover:text-[#e63946] transition">
          Geçmiş
        </button>
      </div>

      {/* Arama ve Filtre */}
      <div className="flex gap-3 items-center mt-4">
        <input
          type="text"
          placeholder="Toplantı konusu, katılımcı veya tarih ara..."
          className="w-full bg-[#1E1E1E] border border-[#2F2F2F] rounded-lg px-4 py-2 text-sm focus:outline-none"
        />
        <button className="bg-[#1E1E1E] px-4 py-2 border border-[#2F2F2F] rounded-lg hover:bg-[#2A2A2A] transition">
          Filtrele
        </button>
      </div>

      {/* Toplantı Kartları */}
      <div className="mt-6 flex flex-col gap-4">
        {loading ? (
          <p className="text-gray-400">⏳ Toplantılar yükleniyor...</p>
        ) : meetings.length === 0 ? (
          <p className="text-gray-500 text-sm">Hiç toplantı bulunamadı.</p>
        ) : (
          meetings.map((meeting) => (
            <div
              key={meeting.id}
              onClick={() => onSelectMeeting(meeting)}
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

              <button className="text-sm px-3 py-1 bg-[#e63946] rounded-lg hover:bg-[#b82e38] transition">
                Detaylar
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
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
