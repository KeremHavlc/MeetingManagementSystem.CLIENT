import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-fox-toast";

const AddParticipantModal = ({ closeModal, onGenerateLink }) => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);
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
      const userRes = await fetch(
        "https://localhost:7270/api/User/GetUserIdByUsernameOrEmail",
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
        const txt = await userRes.text().catch(() => "");
        toast.error("Kullanıcı bulunamadı veya sunucu hatası.");
        console.error("GetUserId error:", userRes.status, txt);
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

      if (!userId) {
        toast.error("Kullanıcı ID bulunamadı.");
        setLoading(false);
        return;
      }

      const joinRes = await fetch(
        "https://localhost:7270/api/MeetingParticipant/JoinFromInvite",
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
      if (!joinRes.ok || !joinJson) {
        toast.error("Toplantıya eklenemedi (sunucu hatası).");
        console.error("JoinFromInvite error:", joinRes.status, joinJson);
        setLoading(false);
        return;
      }

      if (joinJson.success) {
        toast.success("Kullanıcı toplantıya eklendi.");
        closeModal();
      } else {
        toast.error(joinJson.message || "Toplantıya eklenemedi.");
      }
    } catch (err) {
      console.error("handleAdd error:", err);
      toast.error("İşlem sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = async () => {
    if (!meetingId) {
      toast.error("Toplantı ID bulunamadı.");
      return;
    }
    if (!onGenerateLink) {
      toast.error("Link oluşturma fonksiyonu mevcut değil.");
      return;
    }

    setLinkLoading(true);
    try {
      const token = await onGenerateLink();

      let link = token;
      if (token && !/^https?:\/\//i.test(token)) {
        link = `${window.location.origin}/invite/${token}`;
      }
      setInviteLink(link);
      toast.success("Davet linki oluşturuldu.");
    } catch (err) {
      console.error("createLink error:", err);
      toast.error("Davet linki oluşturulamadı.");
    } finally {
      setLinkLoading(false);
    }
  };

  const copyInvite = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Link kopyalandı.");
    } catch {
      toast.error("Kopyalama başarısız.");
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
        {/* Close */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
          aria-label="Kapat"
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

        <button
          onClick={handleCreateLink}
          disabled={linkLoading}
          className={`w-full mt-3 py-2 rounded-lg text-white transition ${
            linkLoading ? "bg-[#555] cursor-wait" : "bg-[#444] hover:bg-[#555]"
          }`}
        >
          {linkLoading ? "Link Oluşturuluyor..." : "🎟 Davet Linki Oluştur"}
        </button>

        {inviteLink && (
          <div className="mt-3 flex items-center gap-2">
            <p className="text-gray-300 text-sm break-all flex-1">
              {inviteLink}
            </p>
            <button
              onClick={copyInvite}
              className="px-3 py-1 bg-[#2b2b2b] rounded text-gray-300 hover:text-white"
            >
              Kopyala
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddParticipantModal;
