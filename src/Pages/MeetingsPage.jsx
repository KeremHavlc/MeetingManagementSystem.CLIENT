import { useState, useEffect } from "react";
import AuthHeader from "../Components/AuthHeader";
import MeetingDetailPanel from "../Components/MeetingPageComponents/MeetingDetailPanel";
import MeetingListSection from "../Components/MeetingPageComponents/MeetingListSection";

const MeetingsPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [closestUpcoming, setClosestUpcoming] = useState(null);

  const handleMeetingsLoaded = (data) => {
    setMeetings(data);

    const now = new Date();

    const upcoming = data
      .filter((m) => new Date(m.scheduledAt) > now)
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

    if (upcoming.length > 0) {
      setClosestUpcoming(upcoming[0]);
    } else {
      setClosestUpcoming(null);
    }
  };

  useEffect(() => {
    if (meetings.length > 0) {
      handleMeetingsLoaded(meetings);
    }
  }, [meetings]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (meetings.length > 0) handleMeetingsLoaded(meetings);
    }, 30000);
    return () => clearInterval(interval);
  }, [meetings]);

  return (
    <div className="min-h-screen bg-[#121212] text-white select-none">
      <AuthHeader />

      <div className="flex w-full justify-center mt-8">
        <div className="w-[1100px] flex gap-6">
          <div className={closestUpcoming ? "flex-1" : "w-full"}>
            <MeetingListSection onMeetingsLoaded={handleMeetingsLoaded} />
          </div>

          {closestUpcoming && <MeetingDetailPanel meeting={closestUpcoming} />}
        </div>
      </div>
    </div>
  );
};

export default MeetingsPage;
