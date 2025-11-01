import React, { useState, useEffect } from "react";
import axios from "axios";
import EditProfileModal from "./EditProfileModal";
import { useNavigate } from "react-router-dom";

const ProfileInfo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
  });
  const navigate = useNavigate();

  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload["Id"] || payload["id"] || payload["nameid"] || null;
    } catch (err) {
      console.error("Token çözümlenemedi:", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = getUserIdFromToken();
      if (!userId) {
        console.warn("Token içinde userId bulunamadı");
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/User/GetUserInfo`,
          { userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.data?.success && res.data?.data) {
          const d = res.data.data;
          setUser({
            firstName: d.firstName,
            lastName: d.lastName,
            userName: d.userName,
            email: d.email,
          });
        } else {
          console.error("Kullanıcı bilgileri alınamadı:", res.data);
        }
      } catch (err) {
        console.error("Kullanıcı bilgisi çekilirken hata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSave = (updatedUser) => {
    setUser((prev) => ({
      ...prev,
      firstName: updatedUser.fullName.split(" ")[0] || prev.firstName,
      lastName: updatedUser.fullName.split(" ")[1] || prev.lastName,
      userName: updatedUser.username || prev.userName,
      email: updatedUser.email || prev.email,
    }));
  };

  const fullName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <>
      <div className="flex items-center justify-between bg-[#1A1A1A]/70 border border-[#2F2F2F] rounded-2xl p-6 mb-10">
        <div className="flex items-center gap-6">
          <img
            src={`https://ui-avatars.com/api/?name=${fullName
              .split(" ")
              .join("+")}&background=E63946&color=fff&size=120`}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-[#e63946]"
          />
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 uppercase">
              {fullName || "Yükleniyor..."}
              {loading && (
                <span className="text-xs text-gray-500 animate-pulse">
                  (yükleniyor)
                </span>
              )}
            </h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <p className="text-gray-500 text-sm">@{user.userName}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 bg-[#2F2F2F] hover:bg-[#3A3A3A] rounded-xl transition"
          >
            Profili Düzenle
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="px-5 py-2 bg-[#e63946] hover:bg-[#b82e38] rounded-xl transition"
          >
            Çıkış Yap
          </button>
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={{
          fullName,
          username: user.userName,
          email: user.email,
        }}
        onSave={handleSave}
      />
    </>
  );
};

export default ProfileInfo;
