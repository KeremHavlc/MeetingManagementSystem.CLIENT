import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const STATUS_OPTIONS = [
  { value: 0, label: "Beklemede" },
  { value: 1, label: "Devam Ediyor" },
  { value: 2, label: "Tamamlandı" },
  { value: 3, label: "İptal Edildi" },
];

const OpenAssignmentModal = ({ isOpen, onClose, meetingId, decision }) => {
  const [participants, setParticipants] = useState([]);
  const [assigneeId, setAssigneeId] = useState("");
  const [status, setStatus] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [error, setError] = useState("");

  const decisionId = decision?.id || null;
  const decisionTitle = decision?.title || "";

  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) => {
      const na = (a.fullName || a.userName || "").toLowerCase();
      const nb = (b.fullName || b.userName || "").toLowerCase();
      return na.localeCompare(nb);
    });
  }, [participants]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchParticipants = async () => {
      if (!meetingId) return;
      try {
        setLoadingParticipants(true);
        setError("");
        const token = localStorage.getItem("token");
        const res = await axios.post(
          `${
            import.meta.env.VITE_BASE_URL
          }/MeetingParticipant/GetMeetingParticipantByMeetingId`,
          { meetingId },
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }
        );

        if (res.data?.success) {
          setParticipants(res.data.data || []);
        } else {
          setParticipants([]);
          setError(res.data?.message || "Katılımcılar alınamadı.");
        }
      } catch {
        setError("Katılımcılar alınırken bir hata oluştu.");
        setParticipants([]);
      } finally {
        setLoadingParticipants(false);
      }
    };

    setAssigneeId("");
    setStatus(0);
    setError("");
    fetchParticipants();
  }, [isOpen, meetingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!decisionId) {
      setError("DecisionId bulunamadı.");
      return;
    }
    if (!assigneeId) {
      setError("Lütfen bir kullanıcı seçin.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${
          import.meta.env.VITE_BASE_URL
        }/DecisionAssignment/CreateDecisionAssignment`,
        {
          decisionId,
          userId: assigneeId,
          decisionStatus: status,
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );

      if (res.data?.success) {
        onClose?.();
      } else {
        setError(res.data?.message || "Görev atanamadı.");
      }
    } catch {
      setError("Görev atanırken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm bg-opacity-70 flex justify-center items-center z-50 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-[#121212] border border-[#2F2F2F] rounded-xl w-full max-w-md p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-[#2F2F2F] pb-3 mb-4">
          <h2 className="text-xl font-bold text-white">Görev Ata</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {decisionTitle && (
          <div className="mb-4 p-3 bg-[#1E1E1E] rounded-lg">
            <p className="text-sm text-gray-400">Karar:</p>
            <p className="text-base font-medium text-white break-words">
              {decisionTitle}
            </p>
          </div>
        )}

        {error && <p className="text-sm text-red-400 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Kullanıcı
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              required
              disabled={loadingParticipants}
              className="w-full p-2.5 bg-[#1E1E1E] border border-[#333] rounded-lg text-white focus:ring-[#e63946] focus:border-[#e63946]"
            >
              <option value="" disabled>
                {loadingParticipants ? "Yükleniyor..." : "Kullanıcı seçin"}
              </option>
              {sortedParticipants.map((p) => (
                <option key={p.userId || p.id} value={p.userId || p.id}>
                  {(p.fullName || p.username || "Bilinmeyen")
                    .split(" ")
                    .map(
                      (s) =>
                        s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
                    )
                    .join(" ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Durum
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
              className="w-full p-2.5 bg-[#1E1E1E] border border-[#333] rounded-lg text-white focus:ring-[#e63946] focus:border-[#e63946]"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#2F2F2F] hover:bg-[#3a3a3a] text-gray-200 transition"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving || loadingParticipants}
              className="px-5 py-2 rounded-lg bg-[#e63946] hover:bg-[#b82e38] text-white font-semibold transition disabled:opacity-60"
            >
              {saving ? "Atanıyor..." : "Ata"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpenAssignmentModal;
