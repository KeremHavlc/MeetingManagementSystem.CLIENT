import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-fox-toast";

const NotificationPreferences = () => {
  const [notifications, setNotifications] = useState({
    meetingJoin: true,
    decision: true,
  });
  const [loading, setLoading] = useState(false);

  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload["Id"] || payload["id"] || payload["nameid"] || null;
    } catch {
      return null;
    }
  };

  const userId = getUserIdFromToken();

  // Kullanıcı ayarlarını getir
  useEffect(() => {
    const fetchSettings = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const res = await axios.post(
          "https://localhost:7270/api/UserSettings/GetUserSettings",
          { userId }
        );

        if (res.data.success && res.data.data) {
          setNotifications({
            meetingJoin: res.data.data.receiveMeetingJoinNotifications,
            decision: res.data.data.receiveDecisionNotifications,
          });
        } else {
          toast.error(res.data.message || "Ayarlar alınamadı!");
        }
      } catch (err) {
        console.error(err);
        toast.error("Sunucu hatası!");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [userId]);

  const handleToggle = async (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);

    try {
      const res = await axios.post(
        "https://localhost:7270/api/UserSettings/UpdateUserSettings",
        {
          userId,
          receiveMeetingJoinNotifications: updated.meetingJoin,
          receiveDecisionNotifications: updated.decision,
        }
      );

      if (res.data.success) toast.success("Ayarlar güncellendi!");
      else toast.error(res.data.message || "Güncelleme başarısız!");
    } catch (err) {
      console.error(err);
      toast.error("Sunucu hatası!");
    }
  };

  if (loading) return <div className="text-gray-400">Yükleniyor...</div>;

  return (
    <div className="bg-[#1A1A1A]/70 border border-[#2F2F2F] rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-6 text-white">
        Bildirim Tercihleri (E-posta)
      </h3>

      <div className="space-y-5">
        {[
          { label: "Toplantı Katılım Bildirimi", key: "meetingJoin" },
          { label: "Karar E-posta Bildirimleri", key: "decision" },
        ].map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between text-gray-300"
          >
            <div className="flex flex-col">
              <span className="font-medium">{item.label}</span>
              <span className="text-sm text-gray-500">
                {item.key === "meetingJoin"
                  ? "Yeni bir toplantıya eklendiğinde e-posta al"
                  : "Yeni bir karar eklendiğinde e-posta bildirimi al"}
              </span>
            </div>

            <button
              onClick={() => handleToggle(item.key)}
              className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
                notifications[item.key] ? "bg-[#e63946]" : "bg-[#2F2F2F]"
              }`}
            >
              <span
                className={`absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white transition-transform ${
                  notifications[item.key] ? "translate-x-5" : ""
                }`}
              ></span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPreferences;
