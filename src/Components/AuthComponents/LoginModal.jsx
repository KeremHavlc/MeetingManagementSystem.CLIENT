import { useState } from "react";
import api from "../../Api/AxiosClient";
import { toast } from "react-fox-toast";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ onClose }) => {
  const [userNameOrEmail, setUserNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/AuthControllers/Login", {
        userNameOrEmail,
        password,
      });

      if (!response.data?.success) {
        toast.error(response.data?.message || "Giriş başarısız!");
        return;
      }

      localStorage.setItem("token", response.data.data);

      toast.success("Giriş başarılı!");

      onClose();

      navigate("/home");
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Sunucuya bağlanılamadı!");
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
          Giriş Yap
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handlesubmit}>
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
      </div>
    </div>
  );
};

export default LoginModal;
