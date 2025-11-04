import { useState } from "react";
import api from "../../Api/AxiosClient";
import { toast } from "react-fox-toast";

const RegisterModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await api.post(
        `${import.meta.env.VITE_BASE_URL}/AuthControllers/Register`,
        {
          email,
          username,
          firstName,
          lastName,
          password,
        }
      );

      const { success, message } = response.data;

      if (!success) {
        setErrorMessage(message || "Kayıt başarısız!");
        return;
      }

      toast.success("Kayıt başarılı! Lütfen e-posta adresini doğrula.");
      onClose();
    } catch (error) {
      console.error("Kayıt Hatası:", error.response?.data || error.message);
      setErrorMessage("Sunucuya bağlanırken bir hata oluştu!");
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
            Üye Ol
          </h2>

          {errorMessage && (
            <p className="text-red-500 text-sm mb-2 text-center font-semibold">
              {errorMessage}
            </p>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="E-posta"
              className="bg-[#2a2a2a] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]"
            />
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Kullanıcı Adı"
              className="bg-[#2a2a2a] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]"
            />
            <input
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              placeholder="Ad"
              className="bg-[#2a2a2a] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]"
            />
            <input
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              placeholder="Soyad"
              className="bg-[#2a2a2a] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Şifre"
              className="bg-[#2a2a2a] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]"
            />

            <button
              type="submit"
              disabled={loading}
              className={`${
                loading ? "bg-[#b82e38] cursor-not-allowed" : "bg-[#e63946]"
              } text-white py-2 rounded-lg hover:bg-[#b82e38] transition`}
            >
              {loading ? "Kayıt oluşturuluyor..." : "Kayıt Ol"}
            </button>
          </form>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-[9999] animate-fadeIn">
          <div className="w-10 h-10 border-4 border-t-transparent border-white rounded-full animate-spin mb-4"></div>
          <h1 className="text-white text-lg font-semibold tracking-wide animate-pulse">
            Kayıt oluşturuluyor...
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
    </>
  );
};

export default RegisterModal;
