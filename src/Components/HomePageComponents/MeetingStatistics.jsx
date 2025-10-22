import { useState } from "react";
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

  // Örnek veri (backend bağlayınca burayı değiştireceğiz)
  const chartData = {
    labels: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran"],
    datasets: [
      {
        label: "Toplantı Sayısı",
        data: [4, 5, 7, 6, 8, 10],
        borderColor: "#E63946",
        backgroundColor: "rgba(230,57,70,0.2)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#E63946",
        pointBorderColor: "#fff",
        pointRadius: 5,
      },
    ],
  };

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
        {/* Üst Bilgi */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-400 text-sm">
            Toplantı verilerine dayalı haftalık / aylık istatistikler
          </p>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-[#2a2a2a] text-white text-sm px-3 py-1 rounded-md border border-[#3a3a3a] focus:outline-none"
          >
            <option value="month">Bu Ay</option>
            <option value="week">Bu Hafta</option>
            <option value="year">Bu Yıl</option>
          </select>
        </div>

        {/* ✅ Grafik Alanı Artık Gerçek Grafik Oldu */}
        <div className="flex-1">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default MeetingStatistics;
