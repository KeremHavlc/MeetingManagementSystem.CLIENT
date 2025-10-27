import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-fox-toast";

const InviteJoinPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const hasRun = useRef(false); // ✅ useEffect'in 2 defa çalışmasını engellemek için

  useEffect(() => {
    if (hasRun.current) return; // ✅ Daha önce çalıştıysa tekrar çalıştırma
    hasRun.current = true;

    const joinMeeting = async () => {
      const userToken = localStorage.getItem("token");

      if (!userToken) {
        navigate(`/?redirect=/invite/${token}`, { replace: true });
        return;
      }

      try {
        // Kullanıcı ID'yi JWT'den çek
        const payload = JSON.parse(atob(userToken.split(".")[1]));
        const userId = payload["Id"];

        // Token’dan meetingId doğrula al
        const validateRes = await axios.post(
          "https://localhost:7270/api/MeetingInvite/ValidateToken",
          { token }
        );
        const meetingId = validateRes.data.meetingId;

        // Toplantıya katıl
        await axios.post(
          "https://localhost:7270/api/MeetingParticipant/JoinFromInvite",
          { meetingId, userId },
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );

        toast.success("Toplantıya katıldın!");
        navigate("/meetings");
      } catch (err) {
        console.error("Hata:", err.response?.data || err.message);
        toast.error("Davet geçersiz veya süresi dolmuş!");
        navigate("/");
      }
    };

    joinMeeting();
  }, [token, navigate]);

  return (
    <div className="w-full h-screen flex items-center justify-center from-[#0f0f0f] to-[#1e1e1e]">
      <div className="bg-[#1e1e1e]/80 border border-gray-700 shadow-lg rounded-xl p-8 flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-gray-600 border-t-[#e63946] rounded-full animate-spin mb-4"></div>

        <p className="text-gray-300 text-lg font-medium text-center">
          Toplantıya katılım işlemi yapılıyor...
        </p>
      </div>
    </div>
  );
};

export default InviteJoinPage;
