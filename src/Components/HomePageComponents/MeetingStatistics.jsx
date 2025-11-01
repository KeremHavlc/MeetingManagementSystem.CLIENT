import { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const MeetingStatistics = () => {
  const [period, setPeriod] = useState("month");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(false);

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

  const fetchStatistics = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/Dashboard/GetMeetingStatistics`,
        { userId, period },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.success && Array.isArray(res.data.data)) {
        const labels = res.data.data.map((x) => x.label);
        const counts = res.data.data.map((x) => x.count);

        setChartData({
          labels,
          datasets: [
            {
              label: "Toplantı Sayısı",
              data: counts,
              borderColor: "#E63946",
              backgroundColor: "rgba(230,57,70,0.2)",
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "#E63946",
              pointBorderColor: "#fff",
              pointRadius: 5,
            },
          ],
        });
      } else {
        console.warn("Toplantı istatistikleri alınamadı:", res.data);
        setChartData({ labels: [], datasets: [] });
      }
    } catch (err) {
      console.error("İstatistik verisi alınırken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [period]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "white" } },
      tooltip: {
        backgroundColor: "#1a1a1a",
        borderColor: "#E63946",
        borderWidth: 1,
        titleColor: "#fff",
        bodyColor: "#ccc",
      },
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  return (
    <div>
      <h2 className="text-white font-semibold mb-4">Toplantı İstatistikleri</h2>

      <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#2e2e2e] h-[300px] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-400 text-sm">
            Toplantı verilerine dayalı haftalık / aylık / yıllık istatistikler
          </p>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-[#2a2a2a] text-white text-sm px-3 py-1 rounded-md border border-[#3a3a3a] focus:outline-none"
          >
            <option value="week">Bu Hafta</option>
            <option value="month">Bu Ay</option>
            <option value="year">Bu Yıl</option>
          </select>
        </div>

        <div className="flex-1">
          {loading ? (
            <p className="text-gray-400 text-center mt-20 animate-pulse">
              Grafik yükleniyor...
            </p>
          ) : chartData.labels.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <p className="text-gray-500 text-center mt-20">
              Bu dönem için toplantı bulunamadı.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingStatistics;
