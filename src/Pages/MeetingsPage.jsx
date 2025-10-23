import AuthHeader from "../Components/AuthHeader";
import MeetingDetailPanel from "../Components/MeetingPageComponents/MeetingDetailPanel";
import MeetingListSection from "../Components/MeetingPageComponents/MeetingListSection";

const MeetingsPage = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <AuthHeader />

      <div className="flex w-full justify-center mt-8">
        <div className="w-[1100px] flex gap-6">
          <MeetingListSection />
          <MeetingDetailPanel />
        </div>
      </div>
    </div>
  );
};

export default MeetingsPage;
