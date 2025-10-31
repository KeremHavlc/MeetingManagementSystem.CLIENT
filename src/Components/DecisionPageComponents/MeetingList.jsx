import React, { useEffect, useState } from "react";
import axios from "axios";

const MeetingList = ({ meetings, selectedMeeting, onSelectMeeting }) => {
  const [creatorNames, setCreatorNames] = useState({});

  useEffect(() => {
    const fetchCreators = async () => {
      if (!meetings || meetings.length === 0) return;

      const token = localStorage.getItem("token");
      const newCreatorNames = {};

      for (const m of meetings) {
        if (!m.createdByUserId) continue;
        try {
          const res = await axios.post(
            "https://localhost:7270/api/User/GetUserNameByUserId",
            { userId: m.createdByUserId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (res.data?.success && res.data.data?.fullName) {
            newCreatorNames[m.id] = res.data.data.fullName;
          } else {
            newCreatorNames[m.id] = "Bilinmiyor";
          }
        } catch {
          newCreatorNames[m.id] = "Bilinmiyor";
        }
      }

      setCreatorNames(newCreatorNames);
    };

    fetchCreators();
  }, [meetings]);

  return (
    <div className="w-[300px] bg-[#1A1A1A] border border-[#2F2F2F] rounded-2xl p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Toplantılarım</h2>
      <div className="space-y-3 overflow-y-auto pr-1 h-[600px]">
        {meetings.length === 0 ? (
          <p className="text-gray-500 text-sm">Henüz toplantı yok.</p>
        ) : (
          meetings.map((m) => (
            <div
              key={m.id}
              onClick={() => onSelectMeeting(m)}
              className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 ${
                selectedMeeting?.id === m.id
                  ? "bg-[#2A2A2A] border-[#3F3F3F]"
                  : "bg-[#1A1A1A] border-[#2F2F2F] hover:bg-[#222222]"
              }`}
            >
              <h3 className="font-semibold text-[15px] mb-1">{m.title}</h3>
              <p className="text-sm text-gray-400">
                {m.scheduledAt
                  ? new Date(m.scheduledAt + "Z").toLocaleDateString("tr-TR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Tarih yok"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Admin: {creatorNames[m.id] || "Yükleniyor..."}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MeetingList;
