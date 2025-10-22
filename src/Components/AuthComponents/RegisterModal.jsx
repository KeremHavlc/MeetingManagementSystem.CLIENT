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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await api.post("/AuthControllers/Register", {
        email,
        username,
        firstName,
        lastName,
        password,
      });
      console.log("Server cevabı:", response.data);
      if (!response.data?.success) {
        setErrorMessage(response.data?.message || "Kayıt Başarısız!");
        return;
      }
      toast.success("Kayıt Başarılı!");
      onClose();
    } catch (error) {
      console.error("Kayıt Hatası:", error.response?.data || error.message);
      setErrorMessage("Sunucuya bağlanırken bir hata oluştur!");
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
            className="bg-[#e63946] text-white py-2 rounded-lg hover:bg-[#b82e38] transition"
          >
            Kayıt Ol
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
