import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import LandingPage from "./Pages/LandingPage";
import HomePage from "./Pages/HomePage";
import SideBar from "./Components/SideBar";
import { ToastContainer } from "react-fox-toast";
import MeetingsPage from "./Pages/MeetingsPage";
import MeetingDetailsPage from "./Pages/MeetingDetailsPage";

const AppWrapper = () => {
  const location = useLocation();

  const showSidebar = location.pathname !== "/";

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-white">
      <div className={`flex-1 ${showSidebar ? "pb-[100px]" : ""}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/meetings" element={<MeetingsPage />} />
          <Route path="/meetings/:id" element={<MeetingDetailsPage />} />
        </Routes>
      </div>

      {showSidebar && <SideBar />}

      <ToastContainer
        position="top-center"
        autoClose={5000}
        theme="dark"
        toastTypeTheming={{
          success: {
            style: {
              backgroundColor: "#1e1e1e",
              color: "#FFFFFF",
              border: "1px solid #2e2e2e",
            },
            icon: "✅",
          },
          error: {
            style: {
              backgroundColor: "#1e1e1e",
              color: "#FFFFFF",
              border: "1px solid #2e2e2e",
            },
            icon: "⚠️",
          },
          info: {
            style: {
              backgroundColor: "#1e1e1e",
              color: "#FFFFFF",
              border: "1px solid #2e2e2e",
            },
            icon: "ℹ️",
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
