import React, { useState, useEffect } from "react";
import axios from "axios";

const OpenDecisionModal = ({ isOpen, onClose, meetingId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setError("");
      setSaving(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!meetingId) {
      setError("MeetingId bulunamadı.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://localhost:7270/api/Decision/CreateDecision",
        {
          meetingId,
          title,
          description,
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );

      if (res.data?.success) {
        onClose?.();
      } else {
        setError(res.data?.message || "Karar oluşturulamadı.");
      }
    } catch (err) {
      setError("Karar eklenirken bir hata oluştu.");
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
          <h2 className="text-xl font-bold text-white">Yeni Karar Ekle</h2>
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

        {error && <p className="text-sm text-red-400 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Karar Başlığı
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2.5 bg-[#1E1E1E] border border-[#333] rounded-lg text-white focus:ring-[#e63946] focus:border-[#e63946]"
              placeholder="Örn: Bütçe onayı"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Açıklama
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-[#1E1E1E] border border-[#333] rounded-lg text-white focus:ring-[#e63946] focus:border-[#e63946]"
              placeholder="Kararın detaylarını girin..."
            />
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
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-[#e63946] hover:bg-[#b82e38] text-white font-semibold transition disabled:opacity-60"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpenDecisionModal;
