import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Şifreler eşleşmiyor!");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${
          import.meta.env.VITE_BASE_URL
        }/AuthControllers/ChangePasswordUsinToken`,
        {
          email,
          newPassword,
          token,
        }
      );

      alert("Şifre başarıyla sıfırlandı!");
      navigate("/");
    } catch (err) {
      console.error("Şifre sıfırlama hatası:", err);
      alert("Şifre sıfırlanırken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#111] via-[#191919] to-[#202020] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-[#e63946]/30 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#d62839]/20 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[420px] sm:max-w-[480px] bg-[#1C1C1C]/90 border border-[#2b2b2b] rounded-2xl shadow-2xl backdrop-blur-lg p-10 transition-all hover:shadow-[#e63946]/40">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            🔐 Meeting<span className="text-[#e63946]">Reset</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Yeni bir şifre belirleyerek hesabına güvenle eriş.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Yeni Şifre
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#252525] border border-[#333] focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Yeni Şifre (Tekrar)
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#252525] border border-[#333] focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:translate-y-[1px]"
            } bg-[#e63946] text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-[#e63946]/40`}
          >
            {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Bu sayfa güvenli bir şifre sıfırlama bağlantısı ile açılmıştır.
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
