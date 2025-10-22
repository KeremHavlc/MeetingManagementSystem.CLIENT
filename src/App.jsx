import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./Pages/LandingPage";
import { ToastContainer } from "react-fox-toast";
import HomePage from "./Pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        theme="dark"
        toastTypeTheming={{
          success: {
            style: {
              backgroundColor: "#1e1e1e",
              color: "#E63946",
              border: "1px solid #2e2e2e",
            },
            icon: "✅",
          },
          error: {
            style: {
              backgroundColor: "#1e1e1e",
              color: "#E63946",
              border: "1px solid #2e2e2e",
            },
            icon: "⚠️",
          },
          info: {
            style: {
              backgroundColor: "#1e1e1e",
              color: "#E63946",
              border: "1px solid #2e2e2e",
            },
            icon: "ℹ️",
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
