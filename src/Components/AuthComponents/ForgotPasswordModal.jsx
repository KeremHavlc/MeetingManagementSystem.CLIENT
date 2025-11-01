import { useState } from "react";
import api from "../../Api/AxiosClient";
import { toast } from "react-fox-toast";

const ForgotPasswordModal = ({ onClose }) => {
  const [userNameOrEmail, setUserNameOrEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post(
        `${import.meta.env.VITE_BASE_URL}/AuthControllers/ForgotPassword`,
        {
          userNameOrEmail,
        }
      );

      if (response.data?.success) {
        toast.success("Şifre sıfırlama maili gönderildi!");
        onClose();
      } else {
        toast.error("Kullanıcı bulunamadı!");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      toast.error("Sunucu hatası!");
    } finally {
      setLoading(false);
    }
  };

  return (
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
          Şifremi Unuttum
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="E-posta veya Kullanıcı Adı"
            value={userNameOrEmail}
            onChange={(e) => setUserNameOrEmail(e.target.value)}
            className="bg-[#2a2a2a] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#e63946] text-white py-2 rounded-lg hover:bg-[#b82e38] transition disabled:opacity-50"
          >
            {loading ? "Gönderiliyor..." : "Mail Gönder"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
