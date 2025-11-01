import { useNavigate, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import Groups2Icon from "@mui/icons-material/Groups2";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <HomeIcon />, path: "/home" },
    { name: "Toplantılar", icon: <Groups2Icon />, path: "/meetings" },
    { name: "Kararlar", icon: <TaskAltIcon />, path: "/decisions" },
    {
      name: "Görevler",
      icon: <AssignmentTurnedInIcon />,
      path: "/assignments",
    },
    { name: "Profil", icon: <PersonIcon />, path: "/profile" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2
      w-[1100px] h-[80px]
      bg-[#0a0a0a20] backdrop-blur-lg
      border-t border-[#2b2b2b]
      flex items-center justify-around
      shadow-[0_-4px_12px_rgba(0,0,0,0.4)]
      rounded-t-2xl z-50 select-none"
    >
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={() => navigate(item.path)}
          className={`flex flex-col items-center transition-all duration-200
            ${
              location.pathname === item.path
                ? "text-white scale-110"
                : "text-gray-400 hover:text-white hover:scale-105"
            }`}
        >
          {item.icon}
          <span className="text-xs mt-1">{item.name}</span>
        </button>
      ))}

      <button
        onClick={handleLogout}
        className="flex flex-col items-center text-red-500 hover:text-red-400 transition-all duration-200"
      >
        <LogoutIcon />
        <span className="text-xs">Çıkış</span>
      </button>
    </div>
  );
};

export default SideBar;
