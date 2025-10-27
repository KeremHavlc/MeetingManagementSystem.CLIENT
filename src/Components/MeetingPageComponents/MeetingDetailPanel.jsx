import { useNavigate } from "react-router-dom";

const MeetingDetailPanel = ({ meeting }) => {
  const navigate = useNavigate();

  if (!meeting) return null;

  return (
    <div className="w-[350px] h-[400px] bg-[#1A1A1A] rounded-xl p-5 border border-[#2F2F2F] relative flex flex-col">
      {/* Üst Başlık */}
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-semibold">{meeting.title}</h3>
        <span className="text-[#e63946] animate-blink text-xl">⚠</span>
      </div>

      <p className="text-gray-400 text-sm mt-1">
        {new Date(meeting.scheduledAt).toLocaleDateString("tr-TR")} •{" "}
        {new Date(meeting.scheduledAt).toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      <div className="mt-4 overflow-y-auto pr-1 flex-1">
        <h4 className="text-md font-medium">📌 Gündem</h4>
        {meeting.description ? (
          <p className="text-sm text-gray-300 mt-2 leading-relaxed">
            {meeting.description}
          </p>
        ) : (
          <p className="text-sm text-gray-500 mt-2">Açıklama girilmemiş.</p>
        )}
      </div>

      <div className="mt-4">
        <button
          onClick={() => navigate(`/meetings/${meeting.id}`)}
          className="w-full bg-[#e63946] hover:bg-[#b82e38] transition py-2 rounded-lg text-white font-medium"
        >
          ➜ Detaya Git
        </button>
      </div>
    </div>
  );
};

export default MeetingDetailPanel;
