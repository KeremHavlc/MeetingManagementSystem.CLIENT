import { useState, useEffect } from "react";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import dayjs from "dayjs";
import "dayjs/locale/tr";

const UpcomingMeetings = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [meetings, setMeetings] = useState([]);
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

  useEffect(() => {
    const fetchMeetings = async () => {
      const userId = getUserIdFromToken();
      if (!userId) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/Dashboard/GetUpcomingMeetings`,
          { userId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data?.success && Array.isArray(res.data.data)) {
          const formatted = res.data.data.map((m) => ({
            title: m.title,
            date: dayjs(m.scheduledAt),
          }));
          setMeetings(formatted);
        } else {
          console.error("Toplantılar alınamadı:", res.data);
        }
      } catch (err) {
        console.error("Toplantı verisi alınırken hata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const meetingsOfSelectedDay = meetings.filter((m) =>
    m.date.isSame(selectedDate, "day")
  );

  const nearestMeeting =
    meetingsOfSelectedDay.length > 0
      ? meetingsOfSelectedDay.sort((a, b) => {
          if (a.date.isSame(b.date)) {
            return a.title.localeCompare(b.title);
          }
          return a.date.isBefore(b.date) ? -1 : 1;
        })[0]
      : null;

  const renderDay = (day, _value, DayComponentProps) => {
    const hasMeeting = meetings.some((m) => m.date.isSame(day, "day"));
    return (
      <div className="relative">
        <span>{DayComponentProps.day.props.children}</span>
        {hasMeeting && (
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#e63946] rounded-full"></span>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-white font-semibold mb-4">Yaklaşan Toplantılar</h2>

      <div className="bg-[#1a1a1a] p-3 rounded-xl border border-[#2e2e2e] overflow-hidden">
        {loading ? (
          <p className="text-gray-400 text-center py-10 animate-pulse">
            Yükleniyor...
          </p>
        ) : (
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
            <div className="scale-[0.95] origin-top">
              <StaticDatePicker
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                displayStaticWrapperAs="desktop"
                slotProps={{ actionBar: { actions: [] } }}
                renderDay={renderDay}
                sx={{
                  width: "100%",
                  backgroundColor: "#1a1a1a",
                  borderRadius: "12px",
                  color: "white",
                  "& .MuiPickersDay-root": { color: "#ffffff" },
                  "& .MuiPickersDay-root.Mui-disabled": { color: "#555" },
                  "& .Mui-selected": {
                    backgroundColor: "#e63946 !important",
                    color: "#fff !important",
                  },
                  "& .MuiDayCalendar-weekDayLabel": { color: "#ffffff" },
                  "& .MuiPickersCalendarHeader-label": { color: "#ffffff" },
                  "& .MuiSvgIcon-root": { color: "#e63946" },
                }}
              />
            </div>
          </LocalizationProvider>
        )}

        <div className="mt-4">
          <p className="text-gray-400 text-sm mb-2">
            Seçilen Tarih:{" "}
            <span className="text-white">
              {selectedDate.format("DD MMMM YYYY")}
            </span>
          </p>

          {nearestMeeting ? (
            <div className="bg-[#222] border border-[#333] p-3 rounded-lg text-white flex justify-between items-center">
              <div>
                <p className="font-semibold truncate max-w-[200px]">
                  {nearestMeeting.title}
                </p>
              </div>
              <span className="text-sm text-gray-400">
                {nearestMeeting.date.format("HH:mm")}
              </span>
            </div>
          ) : (
            <p className="text-gray-500 text-sm mt-2">
              Bu tarihte toplantı yok.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingMeetings;
