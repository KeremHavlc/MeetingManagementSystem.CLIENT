import UpcomingMeetings from "./UpcomingMeetings";
import MeetingStatistics from "./MeetingStatistics";
import StatGrid from "./StatGrid";

const Dashboard = () => {
  const mockStats = {
    meetings: 12,
    decisions: 34,
    activeTasks: 8,
    completionRate: 76,
  };

  return (
    <div className="w-full flex justify-center mt-4">
      <div className="w-[1100px]">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-gray-400 mb-8 mt-4">
          Toplantı, karar ve görevlerin genel durumu
        </p>

        <StatGrid stats={mockStats} />

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

export default Dashboard;
