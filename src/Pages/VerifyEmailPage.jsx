import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("E-posta doğrulama yapılıyor...");
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/AuthControllers/ConfirmEmail`,
          { email, token }
        );

        if (res.data.success) {
          setStatus(
            "✅ E-posta başarıyla doğrulandı! Artık giriş yapabilirsin."
          );
        } else {
          setStatus(
            "❌ Doğrulama başarısız. Token geçersiz veya süresi dolmuş olabilir."
          );
        }
      } catch (err) {
        console.error("E-posta doğrulama hatası:", err);
        setStatus("⚠️ Sunucu hatası oluştu.");
      }
    };

    verify();
  }, [email, token]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#111111] via-[#191919] to-[#202020] overflow-hidden">
      {/* 🔥 Arka plan glow efekti */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/3 w-[450px] h-[450px] bg-[#e63946]/30 rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[350px] h-[350px] bg-[#d62839]/20 rounded-full blur-[160px]" />
      </div>

      {/* 🔹 Kart alanı */}
      <div className="relative z-10 w-[380px] bg-[#1C1C1C]/90 border border-[#2b2b2b] rounded-2xl shadow-2xl backdrop-blur-lg p-8 text-center transition-all hover:shadow-[#e63946]/30">
        <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
          Meeting<span className="text-[#e63946]">Verify</span>
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          E-posta adresin doğrulanıyor, lütfen bekle...
        </p>

        {/* 🔸 Durum mesajı */}
        <div
          className={`py-4 px-5 rounded-lg font-medium ${
            status.includes("✅")
              ? "bg-green-600/10 border border-green-600/30 text-green-400"
              : status.includes("❌")
              ? "bg-red-600/10 border border-red-600/30 text-red-400"
              : status.includes("⚠️")
              ? "bg-yellow-600/10 border border-yellow-600/30 text-yellow-400"
              : "bg-gray-700/40 border border-gray-600/30 text-gray-300"
          }`}
        >
          {status}
        </div>

        {/* 🔹 Alt bilgi */}
        <p className="text-gray-500 text-xs mt-8">
          © {new Date().getFullYear()} Meeting Management System
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
