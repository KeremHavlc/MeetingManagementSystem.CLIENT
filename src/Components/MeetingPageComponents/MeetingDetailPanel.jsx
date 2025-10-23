import { useNavigate } from "react-router-dom";

const MeetingDetailPanel = ({ meeting }) => {
  const navigate = useNavigate();

  const dummyMeeting = {
    id: "12345678",
    title: "Proje Değerlendirme Toplantısı",
    description: "Proje ilerlemeleri konuşulacak ve görevler dağıtılacak.",
    scheduledAt: "2025-01-15T14:00:00",
  };

  const data = meeting || dummyMeeting;

  return (
    <div className="w-[350px] h-[500px] bg-[#1A1A1A] rounded-xl p-5 border border-[#2F2F2F] overflow-y-auto relative">
      {/* Başlık + Alarm */}
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-semibold">{data.title}</h3>
        <span className="text-[#e63946] animate-blink text-xl">⚠</span>
      </div>

      <p className="text-gray-400 text-sm mt-1">
        {new Date(data.scheduledAt).toLocaleDateString("tr-TR")} •{" "}
        {new Date(data.scheduledAt).toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      {/* Gündem / Açıklama */}
      <div className="mt-5">
        <h4 className="text-md font-medium">📌 Gündem</h4>
        {data.description ? (
          <p className="text-sm text-gray-300 mt-2">{data.description}</p>
        ) : (
          <p className="text-sm text-gray-500 mt-2">Açıklama girilmemiş.</p>
        )}
      </div>

      {/* Detaya Git */}
      <div className="absolute bottom-4 left-5 right-5">
        <button
          onClick={() => navigate(`/meetings/${data.id}`)}
          className="w-full bg-[#e63946] hover:bg-[#b82e38] transition py-2 rounded-lg text-white font-medium"
        >
          ➜ Detaya Git
        </button>
      </div>
    </div>
  );
};

export default MeetingDetailPanel;
