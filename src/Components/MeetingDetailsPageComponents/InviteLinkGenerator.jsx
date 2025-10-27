import React, { useState } from "react";
import { toast } from "react-fox-toast";

const InviteLinkGenerator = ({ meetingId, onParticipantAdded }) => {
  const [inviteLink, setInviteLink] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateLink = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://localhost:7270/api/MeetingInvite/CreateInviteLink",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ meetingId }),
        }
      );

      const data = await res.json();
      console.log("INVITE RESPONSE:", data);

      if (data.inviteLink) {
        setInviteLink(data.inviteLink);
        setExpiresAt(data.expiresAt);
        toast.success("✅ Davet linki oluşturuldu!");
      } else {
        toast.error("❌ Davet linki oluşturulamadı.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Sunucuya bağlanırken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Link panoya kopyalandı!");
    } catch {
      toast.error("Kopyalama başarısız.");
    }
  };

  return (
    <div className="mt-4 p-3 bg-[#2a2a2a] rounded-lg border border-gray-700">
      <button
        onClick={handleCreateLink}
        disabled={loading}
        className={`w-full py-2 rounded-lg text-white font-medium transition ${
          loading ? "bg-[#555] cursor-wait" : "bg-[#444] hover:bg-[#555]"
        }`}
      >
        {loading ? "Oluşturuluyor..." : "🎟 Davet Linki Oluştur"}
      </button>

      {inviteLink && (
        <div className="mt-3 space-y-3">
          <p className="text-gray-300 text-sm break-all bg-[#1e1e1e] p-2 rounded-md">
            {inviteLink}
          </p>

          {expiresAt && (
            <p className="text-gray-400 text-xs">
              ⏳ Geçerlilik:{" "}
              {new Date(expiresAt).toLocaleString("tr-TR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="flex-1 bg-[#e63946] hover:bg-[#b82e38] text-white py-2 rounded-lg text-sm"
            >
              📋 Kopyala
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(inviteLink)}`}
              target="_blank"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm text-center"
            >
              💬 WhatsApp
            </a>

            <a
              href={`mailto:?subject=Toplantıya Katılım Daveti&body=${encodeURIComponent(
                inviteLink
              )}`}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm text-center"
            >
              ✉ Mail
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteLinkGenerator;
