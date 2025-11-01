import React, { useEffect, useState } from "react";
import axios from "axios";
import Groups2Icon from "@mui/icons-material/Groups2";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import InsightsIcon from "@mui/icons-material/Insights";

const StatGrid = () => {
  const [stats, setStats] = useState({
    meetings: 0,
    decisions: 0,
    activeTasks: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload["Id"] || payload["id"] || payload["nameid"] || null;
    } catch (err) {
      console.error("Token çözümlenemedi:", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      const userId = getUserIdFromToken();
      if (!userId) {
        console.warn("Kullanıcı ID bulunamadı");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/Dashboard/GetDashboardStats`,
          { userId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data?.success && res.data?.data) {
          const d = res.data.data;
          setStats({
            meetings: d.totalMeetings,
            decisions: d.totalDecisions,
            activeTasks: d.activeAssignments,
            completionRate: d.completionRate,
          });
        } else {
          console.error("İstatistikler alınamadı:", res.data);
        }
      } catch (err) {
        console.error("Dashboard verileri alınırken hata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="text-gray-400 text-center py-10 animate-pulse">
        Yükleniyor...
      </div>
    );

  return (
    <div className="grid grid-cols-4 gap-6">
      <StatCard
        title="Toplam Toplantı"
        value={stats.meetings}
        icon={<Groups2Icon />}
      />
      <StatCard
        title="Toplam Karar"
        value={stats.decisions}
        icon={<TaskAltIcon />}
      />
      <StatCard
        title="Aktif Görevler"
        value={stats.activeTasks}
        icon={<AssignmentTurnedInIcon />}
      />
      <StatCard
        title="Tamamlanma Oranı"
        value={`${stats.completionRate}%`}
        icon={<InsightsIcon />}
      />
    </div>
  );
};

const StatCard = ({ title, value, icon }) => {
  return (
    <div
      className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl p-5 
                 flex items-center gap-4 shadow hover:shadow-lg 
                 hover:scale-105 transition-all duration-300"
    >
      <div className="text-[#e63946] text-3xl">{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h3 className="text-white font-bold text-xl">{value}</h3>
      </div>
    </div>
  );
};

export default StatGrid;
