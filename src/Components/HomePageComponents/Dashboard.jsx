import Groups2Icon from "@mui/icons-material/Groups2";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import InsightsIcon from "@mui/icons-material/Insights";
import UpcomingMeetings from "./UpcomingMeetings";
import MeetingStatistics from "./MeetingStatistics";

const Dashboard = () => {
  return (
    <div className="w-full flex justify-center mt-10">
      <div className="w-[1100px]">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-gray-400 mb-8">
          Toplantı, karar ve görevlerin genel durumu
        </p>

        <div className="grid grid-cols-4 gap-6">
          <StatCard title="Toplam Toplantı" value="12" icon={<Groups2Icon />} />
          <StatCard title="Toplam Karar" value="34" icon={<TaskAltIcon />} />
          <StatCard
            title="Aktif Görevler"
            value="8"
            icon={<AssignmentTurnedInIcon />}
          />
          <StatCard
            title="Tamamlanma Oranı"
            value="76%"
            icon={<InsightsIcon />}
          />
        </div>

        <div className="mt-10 grid grid-cols-3 gap-6">
          <div className="col-span-1 bg-[#1a1a1a] rounded-xl p-4">
            <UpcomingMeetings />
          </div>
          <div className="col-span-2 bg-[#1a1a1a] rounded-xl p-4">
            <MeetingStatistics />
          </div>
        </div>
      </div>
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

export default Dashboard;
