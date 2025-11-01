import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AgendaSection = forwardRef(
  (
    {
      agendaItems,
      agendaProgress,
      setAgendaProgress,
      openDecisionModal,
      openAssignmentModal,
    },
    ref
  ) => {
    const { id: meetingId } = useParams();
    const [decisions, setDecisions] = useState([]);
    const [loadingDecisions, setLoadingDecisions] = useState(false);
    const [decisionsError, setDecisionsError] = useState("");

    const getStatusStyle = (status) => {
      switch (status) {
        case "completed":
          return "bg-green-600 text-white";
        case "pending":
          return "bg-yellow-600 text-white";
        default:
          return "bg-gray-600 text-white";
      }
    };

    const fetchDecisions = async () => {
      if (!meetingId) return;
      try {
        setLoadingDecisions(true);
        setDecisionsError("");
        const token = localStorage.getItem("token");
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/Decision/GetDecisionByMeetingId`,
          { meetingId },
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }
        );
        if (res.data?.success) {
          setDecisions(res.data.data || []);
        } else {
          setDecisions([]);
          setDecisionsError(res.data?.message || "Kararlar alınamadı.");
        }
      } catch {
        setDecisionsError("Kararlar alınırken bir hata oluştu.");
      } finally {
        setLoadingDecisions(false);
      }
    };

    const fetchProgress = async () => {
      if (!meetingId) return;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          `${
            import.meta.env.VITE_BASE_URL
          }/DecisionAssignment/GetMeetingDecisionProgress`,
          { meetingId },
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }
        );

        if (res.data?.success) {
          setAgendaProgress(res.data.data.completionRate);
        }
      } catch (error) {
        console.error("İlerleme alınırken hata:", error);
      }
    };

    useImperativeHandle(ref, () => ({
      fetchDecisions,
      fetchProgress,
    }));

    useEffect(() => {
      fetchDecisions();
      fetchProgress();
    }, [meetingId]);

    return (
      <div className="bg-[#1E1E1E] border border-[#2F2F2F] rounded-xl p-5 h-[600px]">
        <h2 className="text-lg font-semibold text-white mb-4">
          Toplantı Kararları ve İlerleme Durumu
        </h2>

        {/* 🔹 Gündem maddeleri */}
        <div className="space-y-4 max-h-[540px] overflow-y-auto pr-2">
          {agendaItems?.length > 0 ? (
            agendaItems.map((item, index) => (
              <div
                key={item.id ?? index}
                className="flex flex-col gap-1 pb-3 border-b border-[#2F2F2F]"
              >
                <div className="flex justify-between items-center">
                  <p className="text-white text-sm font-medium">
                    {index + 1}. {item.title}
                  </p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      item.status
                    )}`}
                  >
                    {item.status === "completed"
                      ? "Tamamlandı"
                      : item.status === "pending"
                      ? "Beklemede"
                      : "Devam Ediyor"}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Karar: {item.decision || "Henüz karar alınmadı"}
                </p>
                <button
                  onClick={() => openDecisionModal?.(item)}
                  className="self-start mt-1 text-xs px-3 py-1 rounded-lg bg-[#e63946] hover:bg-[#b82e38] text-white transition"
                >
                  Karar Ekle
                </button>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400"> </p>
          )}
        </div>

        {/* 🔹 Progress bar */}
        {typeof agendaProgress === "number" && (
          <div className="mt-4">
            <div className="w-full bg-gray-700 h-2 rounded-full">
              <div
                className="h-2 bg-[#e63946] rounded-full transition-all duration-300"
                style={{ width: `${agendaProgress}%` }}
              ></div>
            </div>
            <p className="text-right text-xs text-gray-400 mt-1">
              Gündem İlerlemesi: %{agendaProgress}
            </p>
          </div>
        )}

        {/* 🔹 Kararlar listesi */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">
              Toplantı Kararları
            </h3>

            <div className="flex gap-2">
              <button
                onClick={() => openDecisionModal?.()}
                className="text-xs px-3 py-1 rounded-lg bg-[#e63946] hover:bg-[#b82e38] text-white transition"
              >
                + Yeni Görev
              </button>

              <button
                onClick={() => {
                  fetchDecisions();
                  fetchProgress();
                }}
                className="text-xs px-3 py-1 rounded-lg bg-[#2F2F2F] hover:bg-[#3a3a3a] text-gray-200 transition"
              >
                Yenile
              </button>
            </div>
          </div>

          <div className="space-y-3 mt-3 max-h-[380px] overflow-y-auto pr-2">
            {loadingDecisions && (
              <p className="text-xs text-gray-400">Yükleniyor...</p>
            )}
            {!loadingDecisions && decisionsError && (
              <p className="text-xs text-red-400">{decisionsError}</p>
            )}
            {!loadingDecisions && !decisionsError && decisions.length === 0 && (
              <p className="text-xs text-gray-400">
                Bu toplantı için karar bulunamadı.
              </p>
            )}

            {decisions.map((d) => (
              <div
                key={d.id}
                className="bg-[#2A2A2A] border border-[#333] rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{d.title}</p>
                  <span className="text-[10px] text-gray-400">
                    {new Date(d.createdAt).toLocaleString("tr-TR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>

                {d.description && (
                  <p className="text-xs text-gray-300 mt-1">{d.description}</p>
                )}

                <button
                  onClick={() => openAssignmentModal?.(d)}
                  className="mt-3 text-xs px-3 py-1 rounded-lg bg-[#e63946] hover:bg-[#b82e38] text-white transition"
                >
                  Görev Ata
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

export default AgendaSection;
