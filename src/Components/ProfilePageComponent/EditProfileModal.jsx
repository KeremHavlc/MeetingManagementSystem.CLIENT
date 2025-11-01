import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-fox-toast";

const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const [first, last] = (user.fullName || "").split(" ");
      setForm({
        firstName: first || user.firstName || "",
        lastName: last || user.lastName || "",
        username: user.username || "",
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload["Id"] || payload["id"] || payload["nameid"] || null;
    } catch (err) {
      return null;
    }
  };

  const handleSave = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      toast.error("Kullanıcı kimliği bulunamadı!");
      return;
    }

    if (!form.firstName || !form.lastName || !form.username) {
      toast.warn("Tüm alanları doldur!");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/User/UpdateUser`,
        {
          userId,
          firstName: form.firstName,
          lastName: form.lastName,
          userName: form.username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        toast.success("Profil başarıyla güncellendi ✅");
        const d = res.data.data;
        onSave({
          fullName: `${d.firstName} ${d.lastName}`,
          username: d.userName,
          email: d.email,
        });
        onClose();
      } else {
        toast.error(res.data?.message || "Profil güncellenemedi ❌");
      }
    } catch (err) {
      console.error("Profil güncellenirken hata:", err);
      toast.error("Sunucu hatası oluştu ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdrop = (e) => {
    if (e.target.id === "modal-backdrop") onClose();
  };

  return (
    <div
      id="modal-backdrop"
      onClick={handleBackdrop}
      className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 backdrop-blur-sm"
    >
      <div className="bg-[#1A1A1A] border border-[#2F2F2F] rounded-2xl p-8 w-[480px]">
        <h2 className="text-2xl font-semibold mb-6 text-white text-center">
          Profili Düzenle
        </h2>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-sm text-gray-400">Ad</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full mt-1 p-3 bg-[#1E1E1E] border border-[#2F2F2F] text-white rounded-xl focus:ring-2 focus:ring-[#e63946]"
              />
            </div>
            <div className="w-1/2">
              <label className="text-sm text-gray-400">Soyad</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full mt-1 p-3 bg-[#1E1E1E] border border-[#2F2F2F] text-white rounded-xl focus:ring-2 focus:ring-[#e63946]"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400">Kullanıcı Adı</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full mt-1 p-3 bg-[#1E1E1E] border border-[#2F2F2F] text-white rounded-xl focus:ring-2 focus:ring-[#e63946]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 bg-[#2F2F2F] hover:bg-[#3A3A3A] rounded-xl transition"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-5 py-2 bg-[#e63946] hover:bg-[#b82e38] rounded-xl transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
