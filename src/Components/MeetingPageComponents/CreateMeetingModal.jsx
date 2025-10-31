import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-fox-toast";

const CreateMeetingModal = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = getUserIdFromToken();
    if (!userId) {
      toast.error("Kullanıcı bulunamadı!");
      return;
    }

    const data = { title, description, scheduledAt, createdByUserId: userId };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://localhost:7270/api/Meetings/CreateMeeting",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.success) {
        toast.error(response.data.message || "Toplantı oluşturulamadı!");
        return;
      }

      const meetingId = response.data.data;
      if (!meetingId) {
        toast.error("Toplantı ID alınamadı!");
        return;
      }

      toast.success("✅ Toplantı başarıyla oluşturuldu!");
      onClose();
      navigate(`/meetings/${meetingId}`);
    } catch (error) {
      console.error("Toplantı oluşturulamadı:", error);
      toast.error("❌ Toplantı oluşturulurken hata oluştu!");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#1e1e1e] w-[450px] p-6 rounded-2xl shadow-xl relative border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Yeni Toplantı Oluştur
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Toplantı Başlığı"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="bg-[#2a2a2a] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]"
          />

          <textarea
            placeholder="Açıklama / Gündem"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-[#2a2a2a] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]"
          />

          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            required
            className="bg-[#2a2a2a] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]"
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-300 hover:text-white transition"
            >
              İptal
            </button>
            <button
              type="submit"
              className="bg-[#e63946] text-white px-4 py-2 rounded-lg hover:bg-[#b82e38] transition"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMeetingModal;
