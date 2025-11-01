import React, { useEffect, useState } from "react";
import axios from "axios";
import OpenDecisionModal from "../MeetingDetailsPageComponents/OpenDecisionModal";

const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "text-green-400 bg-green-900/30 border-green-700/50";
    case "InProgress":
      return "text-yellow-400 bg-yellow-900/30 border-yellow-700/50";
    case "Pending":
      return "text-blue-400 bg-blue-900/30 border-blue-700/50";
    default:
      return "text-gray-400 bg-[#1E1E1E]";
  }
};

const DecisionList = ({
  selectedMeeting,
  decisions,
  loading,
  refetchDecisions,
}) => {
  const [assignments, setAssignments] = useState({});
  const [userNames, setUserNames] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!decisions || decisions.length === 0) return;

      const token = localStorage.getItem("token");
      const assignmentMap = {};

      for (const d of decisions) {
        try {
          const res = await axios.post(
            `${
              import.meta.env.VITE_BASE_URL
            }/DecisionAssignment/GetDecisionAssignmentByDecisionId`,
            { decisionId: d.id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (res.data?.success && Array.isArray(res.data.data)) {
            assignmentMap[d.id] = res.data.data;
          } else {
            assignmentMap[d.id] = [];
          }
        } catch {
          assignmentMap[d.id] = [];
        }
      }

      setAssignments(assignmentMap);
    };

    fetchAssignments();
  }, [decisions]);

  useEffect(() => {
    const fetchUserNames = async () => {
      const token = localStorage.getItem("token");
      const map = { ...userNames };
      const allUserIds = [
        ...new Set(
          Object.values(assignments)
            .flat()
            .map((a) => a.userId)
        ),
      ];

      for (const id of allUserIds) {
        if (map[id]) continue;
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/User/GetUserNameByUserId`,
            { userId: id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (res.data?.success) map[id] = res.data.data.fullName;
        } catch {
          map[id] = "Bilinmiyor";
        }
      }

      setUserNames(map);
    };

    if (Object.keys(assignments).length > 0) fetchUserNames();
  }, [assignments]);

  if (!selectedMeeting) {
    return (
      <div className="flex-1 bg-[#1A1A1A] border border-[#2F2F2F] rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400">
        <p>Bir toplantı seçerek kararlarını görüntüle.</p>
      </div>
    );
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
    refetchDecisions(selectedMeeting.id);
  };

  return (
    <div className="flex-1 bg-[#1A1A1A] border border-[#2F2F2F] rounded-2xl p-6 flex flex-col relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">{selectedMeeting.title}</h2>
          <p className="text-gray-400 text-sm">
            {selectedMeeting.scheduledAt
              ? new Date(selectedMeeting.scheduledAt + "Z").toLocaleDateString(
                  "tr-TR",
                  {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                )
              : "Tarih yok"}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#e63946] rounded-xl text-sm font-medium hover:bg-[#c92c3b] transition"
        >
          Yeni Karar Ekle
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Kararlar yükleniyor...
        </div>
      ) : decisions.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Bu toplantıya ait karar bulunamadı.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-2 h-[520px]">
          {decisions.map((d) => (
            <div
              key={d.id}
              className="bg-[#1E1E1E] border border-[#2F2F2F] rounded-xl p-4 transition-all hover:border-[#3F3F3F]"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{d.title}</h3>
                <span className="text-xs text-gray-500">
                  {new Date(d.createdAt + "Z").toLocaleDateString("tr-TR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-3">{d.description}</p>

              <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                <span className="text-[#e63946] font-medium">Sorumlular:</span>
                {assignments[d.id]?.length > 0 ? (
                  assignments[d.id].map((a, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded-md border ${getStatusColor(
                        a.decisionStatusEnum
                      )}`}
                    >
                      {userNames[a.userId] || "Yükleniyor..."} (
                      {a.decisionStatusEnum})
                    </span>
                  ))
                ) : (
                  <span className="italic text-gray-500">Atama yok</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <OpenDecisionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        meetingId={selectedMeeting.id}
      />
    </div>
  );
};

export default DecisionList;
