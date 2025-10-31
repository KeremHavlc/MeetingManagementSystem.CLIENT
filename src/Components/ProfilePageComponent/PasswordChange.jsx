import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-fox-toast";

const PasswordChange = () => {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload["Id"] || payload["id"] || payload["nameid"];
    } catch {
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.warn("Lütfen tüm alanları doldurun.");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast.error("Yeni şifreler eşleşmiyor!");
      return;
    }

    const id = getUserIdFromToken();
    if (!id) {
      toast.error("Kullanıcı kimliği bulunamadı!");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://localhost:7270/api/AuthControllers/ChangePassword",
        {
          id,
          currentPassword: passwords.current,
          newPassword: passwords.new,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.success) {
        toast.success("Şifre başarıyla güncellendi ✅");
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        toast.error(res.data?.message || "Şifre değiştirilemedi ❌");
      }
    } catch (err) {
      console.error(err);
      toast.error("Sunucuya bağlanırken bir hata oluştu ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1A1A1A]/70 border border-[#2F2F2F] rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-6">Şifre Değiştir</h3>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400">Mevcut Şifre</label>
          <input
            type="password"
            name="current"
            value={passwords.current}
            onChange={handleChange}
            placeholder="Mevcut şifrenizi girin"
            className="w-full mt-1 p-3 rounded-xl bg-[#1E1E1E] border border-[#2F2F2F] text-white focus:outline-none focus:ring-2 focus:ring-[#e63946]"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400">Yeni Şifre</label>
          <input
            type="password"
            name="new"
            value={passwords.new}
            onChange={handleChange}
            placeholder="Yeni şifrenizi girin"
            className="w-full mt-1 p-3 rounded-xl bg-[#1E1E1E] border border-[#2F2F2F] text-white focus:outline-none focus:ring-2 focus:ring-[#e63946]"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400">Yeni Şifre (Tekrar)</label>
          <input
            type="password"
            name="confirm"
            value={passwords.confirm}
            onChange={handleChange}
            placeholder="Yeni şifrenizi tekrar girin"
            className="w-full mt-1 p-3 rounded-xl bg-[#1E1E1E] border border-[#2F2F2F] text-white focus:outline-none focus:ring-2 focus:ring-[#e63946]"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full mt-4 bg-[#e63946] hover:bg-[#b82e38] rounded-xl py-2.5 font-semibold transition ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
        </button>
      </div>
    </div>
  );
};

export default PasswordChange;
