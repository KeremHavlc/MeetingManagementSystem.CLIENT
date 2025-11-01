import { useState } from "react";
import api from "../../Api/AxiosClient";
import { toast } from "react-fox-toast";
import { useNavigate, useLocation } from "react-router-dom";
import ForgotPasswordModal from "./ForgotPasswordModal";

const LoginModal = ({ onClose }) => {
  const [userNameOrEmail, setUserNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const redirectUrl = params.get("redirect") || "/home";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/AuthControllers/SignIn", {
        userNameOrEmail,
        password,
      });

      const { success, message, data } = response.data;

      // 🔹 Giriş başarısızsa detaylı mesaj göster
      if (!success) {
        if (message?.includes("doğrulanmamış"))
          toast.error(
            "E-posta adresin doğrulanmamış! Yeni doğrulama maili gönderildi."
          );
        else toast.error(message || "Giriş başarısız!");
        return;
      }

      // 🔹 Başarılı giriş
      localStorage.setItem("token", data);
      toast.success("Giriş başarılı!");
      onClose();
      navigate(redirectUrl, { replace: true });
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Sunucuya bağlanılamadı!");
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
              className="bg-[#e63946] text-white py-2 rounded-lg hover:bg-[#b82e38] transition"
            >
              Giriş Yap
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

      {isForgotOpen && (
        <ForgotPasswordModal onClose={() => setIsForgotOpen(false)} />
      )}
    </>
  );
};

export default LoginModal;
