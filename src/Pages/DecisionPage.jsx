import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthHeader from "../Components/AuthHeader";
import MeetingList from "../Components/DecisionPageComponents/MeetingList";
import DecisionList from "../Components/DecisionPageComponents/DecisionList";

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

const DecisionPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [decisions, setDecisions] = useState([]);
  const [loadingMeetings, setLoadingMeetings] = useState(true);
  const [loadingDecisions, setLoadingDecisions] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMeetings = async () => {
      const userId = getUserIdFromToken();
      if (!userId) {
        setError("Kullanıcı bulunamadı (token hatalı).");
        setLoadingMeetings(false);
        return;
      }

      try {
        setLoadingMeetings(true);
        const token = localStorage.getItem("token");

        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/Meetings/GetMeetingByUserId`,
          { userId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data?.success) {
          setMeetings(res.data.data);
          if (res.data.data.length > 0) setSelectedMeeting(res.data.data[0]);
        } else {
          setError(res.data?.message || "Toplantılar alınamadı.");
        }
      } catch (err) {
        console.error("Toplantılar alınırken hata:", err);
        setError("Sunucuya bağlanılamadı.");
      } finally {
        setLoadingMeetings(false);
      }
    };

    fetchMeetings();
  }, []);

  const fetchDecisions = async (meetingId) => {
    if (!meetingId) return;
    try {
      setLoadingDecisions(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/Decision/GetDecisionByMeetingId`,
        { meetingId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.success) setDecisions(res.data.data);
      else setDecisions([]);
    } catch (err) {
      console.error("Kararlar alınamadı:", err);
      setDecisions([]);
    } finally {
      setLoadingDecisions(false);
    }
  };

  useEffect(() => {
    if (selectedMeeting?.id) fetchDecisions(selectedMeeting.id);
  }, [selectedMeeting]);

  return (
    <div className="min-h-screen bg-[#121212] text-white select-none">
      <AuthHeader />

      <div className="flex w-full justify-center mt-8">
        <div className="w-[1100px] flex gap-6">
          {loadingMeetings ? (
            <div className="w-[300px] h-[600px] flex items-center justify-center border border-[#2F2F2F] rounded-2xl bg-[#1A1A1A] text-gray-400">
              Yükleniyor...
            </div>
          ) : error ? (
            <div className="w-[300px] h-[600px] flex items-center justify-center border border-[#2F2F2F] rounded-2xl bg-[#1A1A1A] text-red-400 text-center px-4">
              {error}
            </div>
          ) : (
            <MeetingList
              meetings={meetings}
              selectedMeeting={selectedMeeting}
              onSelectMeeting={setSelectedMeeting}
            />
          )}

          <DecisionList
            selectedMeeting={selectedMeeting}
            decisions={decisions}
            loading={loadingDecisions}
            refetchDecisions={fetchDecisions}
          />
        </div>
      </div>
    </div>
  );
};

export default DecisionPage;
