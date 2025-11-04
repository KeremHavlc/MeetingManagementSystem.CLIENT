import { useState } from "react";
import api from "../../Api/AxiosClient";
import { toast } from "react-fox-toast";
import { useNavigate, useLocation } from "react-router-dom";
import ForgotPasswordModal from "./ForgotPasswordModal";

const LoginModal = ({ onClose }) => {
  const [userNameOrEmail, setUserNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const redirectUrl = params.get("redirect") || "/home";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post(
        `${import.meta.env.VITE_BASE_URL}/AuthControllers/SignIn`,
        {
          userNameOrEmail,
          password,
        }
      );

      const { success, message, data } = response.data;

      if (!success) {
        if (message?.includes("doğrulanmamış"))
          toast.error(
            "E-posta adresin doğrulanmamış! Yeni doğrulama maili gönderildi."
          );
        else toast.error("Kullanıcı adı veya şifre hatalı!");
        return;
      }

      localStorage.setItem("token", data);
      toast.success("Giriş başarılı!");
      onClose();
      navigate(redirectUrl, { replace: true });
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Sunucuya bağlanılamadı!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center"
        onClick={onClose}
      >
        <div
          className="bg-[#1e1e1e] w-[400px] p-6 rounded-2xl shadow-xl relative border border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            Giriş Yap
          </h2>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="E-posta veya Kullanıcı Adı"
              onChange={(e) => setUserNameOrEmail(e.target.value)}
              className="bg-[#2a2a2a] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]"
            />
            <input
              type="password"
              placeholder="Şifre"
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#2a2a2a] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]"
            />

            <button
              type="submit"
              disabled={loading}
              className={`${
                loading ? "bg-[#b82e38] cursor-not-allowed" : "bg-[#e63946]"
              } text-white py-2 rounded-lg hover:bg-[#b82e38] transition`}
            >
              {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          <p
            onClick={() => setIsForgotOpen(true)}
            className="text-sm text-gray-400 text-center mt-3 hover:text-[#e63946] cursor-pointer transition"
          >
            Şifremi unuttum?
          </p>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-[9999] animate-fadeIn">
          <div className="w-10 h-10 border-4 border-t-transparent border-white rounded-full animate-spin mb-4"></div>
          <h1 className="text-white text-lg font-semibold tracking-wide animate-pulse">
            Giriş yapılıyor...
          </h1>

          <style jsx>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            .animate-fadeIn {
              animation: fadeIn 0.3s ease-in-out;
            }
          `}</style>
        </div>
      )}

      {isForgotOpen && (
        <ForgotPasswordModal onClose={() => setIsForgotOpen(false)} />
      )}
    </>
  );
};

export default LoginModal;
