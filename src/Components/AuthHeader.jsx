import { useState, useEffect } from "react";
import Groups2Icon from "@mui/icons-material/Groups2";
import PersonIcon from "@mui/icons-material/Person";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useNavigate } from "react-router-dom";
import { toast } from "react-fox-toast";

const AuthHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Çıkış yapıldı!");
    navigate("/");
  };

  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      setUsername(decoded?.UserName || "Kullanıcı");
    }
  }, []);

  return (
    <div className="flex justify-center bg-[#121212] select-none relative z-50">
      <div className="border-b border-gray-700 w-[1100px] h-[70px] flex justify-between items-center px-4">
        {/* Logo kısmı */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <Groups2Icon
            className="text-[#e63946] hover:text-[#b82e38] transition-colors"
            fontSize="large"
          />
          <h1 className="text-white text-2xl font-semibold hover:text-[#e63946] transition-colors">
            Toplantı Yönetim Sistemi
          </h1>
        </div>

        {/* Profil kısmı */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 bg-[#2a2a2a] px-4 py-2 rounded-full text-white hover:bg-[#3a3a3a] transition-all"
          >
            <PersonIcon />
            <span>{username}</span>
            <ExpandMoreIcon
              className={`${
                isMenuOpen ? "rotate-180" : ""
              } transition-transform`}
            />
          </button>

          {/* Açılır Menü */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1f1f1f] border border-[#333] rounded-lg shadow-lg overflow-hidden">
              <button className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-[#2a2a2a] text-white">
                <PersonOutlineIcon fontSize="small" /> Profil
              </button>
              <button className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-[#2a2a2a] text-white">
                <SettingsIcon fontSize="small" /> Ayarlar
              </button>
              <div className="border-t border-[#333] my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-[#2a2a2a] text-[#e63946]"
              >
                <LogoutIcon fontSize="small" /> Çıkış Yap
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthHeader;
