import React, { useState } from "react";

const NotificationPreferences = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    instant: false,
    meeting: true,
  });

  const handleToggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <div className="bg-[#1A1A1A]/70 border border-[#2F2F2F] rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-6">Bildirim Tercihleri</h3>

      <div className="space-y-4">
        {[
          { label: "E-posta Bildirimleri", key: "email" },
          { label: "Anlık Bildirimler", key: "instant" },
          { label: "Yeni Toplantı Davetleri", key: "meeting" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between text-gray-300"
          >
            <span>{item.label}</span>
            <button
              onClick={() => handleToggle(item.key)}
              className={`relative w-11 h-6 rounded-full transition ${
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
