import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthHeader from "../Components/AuthHeader";
import AssignmentList from "../Components/AssignmentPageComponent/AssignmentList";

const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload["Id"] || payload["id"] || payload["nameid"];
  } catch {
    return null;
  }
};

const AssignmentPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken();
      if (!userId) {
        console.error("Token içinde userId bulunamadı!");
        return;
      }

      const res = await axios.post(
        "https://localhost:7270/api/DecisionAssignment/GetDetailsDecisionByUserId",
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        const formatted = res.data.data.map((item) => ({
          id: item.decisionAssignmentId,
          title: item.decisionTitle,
          description: item.decisionDescription,
          meetingTitle: item.meetingTitle,
          date: item.meetingDate,
          status: item.decisionStatusEnum,
        }));
        setAssignments(formatted);
      } else {
        console.error(res.data.message);
      }
    } catch (err) {
      console.error("Görevler alınamadı:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const enumVal =
        newStatus === "Pending" ? 0 : newStatus === "InProgress" ? 1 : 2;

      await axios.post(
        "https://localhost:7270/api/DecisionAssignment/UpdateDecisionAssignmentStatus",
        {
          decisionAssignmentId: id,
          decisionStatusEnum: enumVal,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAssignments((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
      setSelectedTask(null);
    } catch (err) {
      console.error("Durum güncellenemedi:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white select-none font-inter">
      <AuthHeader />

      <div className="flex justify-center w-full mt-10 pb-20">
        <div className="w-[1100px] flex flex-col gap-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl tracking-tight font-semibold">
              Görevlerim
            </h1>
            <p className="text-xl text-gray-300 font-semibold">
              Sana atanmış görevleri buradan yönetebilirsin.
            </p>
          </div>

          {loading ? (
            <div className="text-center text-gray-400 mt-20">
              Görevler yükleniyor...
            </div>
          ) : (
            <AssignmentList
              assignments={assignments}
              selectedTask={selectedTask}
              setSelectedTask={setSelectedTask}
              handleStatusChange={handleStatusChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentPage;
