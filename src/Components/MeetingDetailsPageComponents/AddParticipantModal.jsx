import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-fox-toast";
import InviteLinkGenerator from "./InviteLinkGenerator";

const AddParticipantModal = ({ closeModal, onGenerateLink }) => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const { id: meetingId } = useParams();

  useEffect(() => {
    inputRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "Enter") handleAdd();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target.id === "modal-backdrop") closeModal();
  };

  const handleAdd = async () => {
    if (!emailOrUsername.trim()) {
      toast.warn("Lütfen e-posta veya kullanıcı adı girin.");
      return;
    }
    if (!meetingId) {
      toast.error("Toplantı ID bulunamadı.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      // 🔹 Kullanıcı ID'yi çek
      const userRes = await fetch(
        `${import.meta.env.VITE_BASE_URL}/User/GetUserIdByUsernameOrEmail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ usernameOrEmail: emailOrUsername }),
        }
      );

      if (!userRes.ok) {
        toast.error("Kullanıcı bulunamadı veya sunucu hatası.");
        setLoading(false);
        return;
      }

      const userJson = await userRes.json();
      if (!userJson.success || !userJson.data) {
        toast.error(userJson.message || "Kullanıcı bulunamadı.");
        setLoading(false);
        return;
      }

      const userId =
        userJson.data.userId || userJson.data.id || userJson.data.user?.id;

      const joinRes = await fetch(
        `${import.meta.env.VITE_BASE_URL}/MeetingParticipant/JoinFromInvite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ meetingId, userId }),
        }
      );

      const joinJson = await joinRes.json().catch(() => null);
      if (joinJson?.success) {
        toast.success("Kullanıcı toplantıya eklendi.");
        closeModal();
      } else {
        toast.error(joinJson?.message || "Toplantıya eklenemedi.");
      }
    } catch (err) {
      console.error("handleAdd error:", err);
      toast.error("İşlem sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="modal-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1e1e1e] w-[420px] p-6 rounded-2xl shadow-xl relative border border-gray-700"
      >
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-4 text-white">
          Katılımcı Ekle
        </h2>

        <input
          ref={inputRef}
          type="text"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          placeholder="E-posta veya kullanıcı adı"
          className="w-full bg-[#2a2a2a] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]"
        />

        <button
          onClick={handleAdd}
          disabled={loading}
          className={`w-full mt-3 py-2 rounded-lg text-white font-medium transition ${
            loading
              ? "bg-[#7a2a2a] cursor-wait"
              : "bg-[#e63946] hover:bg-[#b82e38]"
          }`}
        >
          {loading ? "Ekleniyor..." : "➕ Katılımcı Ekle"}
        </button>

        <InviteLinkGenerator
          meetingId={meetingId}
          onGenerateLink={onGenerateLink}
        />
      </div>
    </div>
  );
};

export default AddParticipantModal;
