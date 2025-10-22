import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import dayjs from "dayjs";

const UpcomingMeetings = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  return (
    <div>
      <h2 className="text-white font-semibold mb-4">Yaklaşan Toplantılar</h2>

      <div className="bg-[#1a1a1a] p-2 rounded-xl border border-[#2e2e2e] overflow-hidden">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="scale-[0.95] origin-top">
            <StaticDatePicker
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              displayStaticWrapperAs="desktop"
              slotProps={{ actionBar: { actions: [] } }}
              sx={{
                width: "100%",
                backgroundColor: "#1a1a1a",
                borderRadius: "12px",
                color: "white",

                "& .MuiPickersDay-root": {
                  color: "#ffffff",
                },
                "& .MuiPickersDay-root.Mui-disabled": {
                  color: "#555",
                },
                "& .Mui-selected": {
                  backgroundColor: "#e63946 !important",
                  color: "#fff !important",
                },
                "& .MuiDayCalendar-weekDayLabel": {
                  color: "#ffffff",
                },
                "& .MuiPickersCalendarHeader-label": {
                  color: "#ffffff",
                },
                "& .MuiSvgIcon-root": {
                  color: "#e63946",
                },
              }}
            />
          </div>
        </LocalizationProvider>

        <p className="text-gray-400 text-sm mt-4">
          Seçilen Tarih:{" "}
          <span className="text-white">
            {selectedDate.format("DD MMMM YYYY")}
          </span>
        </p>
      </div>
    </div>
  );
};

export default UpcomingMeetings;
