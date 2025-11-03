import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import LandingPage from "./Pages/LandingPage";
import HomePage from "./Pages/HomePage";
import SideBar from "./Components/SideBar";
import { ToastContainer } from "react-fox-toast";
import MeetingsPage from "./Pages/MeetingsPage";
import MeetingDetailsPage from "./Pages/MeetingDetailsPage";
import InviteJoinPage from "./Pages/InviteJoinPage";
import DecisionPage from "./Pages/DecisionPage";
import AssignmentPage from "./Pages/AssignmentPage";
import ProfilePage from "./Pages/ProfilePage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";
import VerifyEmailPage from "./Pages/VerifyEmailPage";
import NotFoundPage from "./Pages/NotFoundPage";
import GlobalLoader from "./Components/GlobalLoader";

const validRoutes = [
  "/",
  "/home",
  "/meetings",
  "/meetings/:id",
  "/invite/:token",
  "/decisions",
  "/assignments",
  "/profile",
  "/reset-password",
  "/verify-email",
];

const AppWrapper = () => {
  const location = useLocation();

  const hideSidebarRoutes = [
    "/",
    "/reset-password",
    "/forgot-password",
    "/verify-email",
  ];

  const isValidRoute = validRoutes.some((route) => {
    if (route.includes(":")) {
      const routePattern = new RegExp(
        "^" + route.replace(/:[^/]+/g, "[^/]+") + "$"
      );
      return routePattern.test(location.pathname);
    }
    return route === location.pathname;
  });

  const showSidebar =
    !hideSidebarRoutes.includes(location.pathname) && isValidRoute;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#121212",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/900/900834.png"
          alt="Mobile under construction"
          style={{ width: "80px", opacity: 0.9, marginBottom: "20px" }}
        />
        <h2 className="font-semibold text-2xl">
          📱 Mobil sürüm geliştiriliyor
        </h2>
        <p className="text-gray-400 mt-3 text-base max-w-md">
          Şu anda Meeting Management System sadece masaüstü cihazlarda
          kullanılabilir.
          <br />
          Mobil uygulamamız aktif geliştirme aşamasında.
          <br />
          Yakında tüm platformlarda yayında olacak! 🚀
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-white overflow-x-hidden">
      <div className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-10 transition-all duration-300">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/meetings" element={<MeetingsPage />} />
          <Route path="/meetings/:id" element={<MeetingDetailsPage />} />
          <Route path="/invite/:token" element={<InviteJoinPage />} />
          <Route path="/decisions" element={<DecisionPage />} />
          <Route path="/assignments" element={<AssignmentPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="*" element={<NotFoundPage />} />
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
      <GlobalLoader />
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
