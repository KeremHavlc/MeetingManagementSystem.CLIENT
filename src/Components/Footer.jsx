import React from "react";
import Groups2Icon from "@mui/icons-material/Groups2";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";

const Footer = () => {
  return (
    <footer className="w-full bg-[#111] border-t border-gray-700 mt-16 py-10 select-none">
      <div className="w-[1100px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Sol - Logo ve Başlık */}
        <div className="flex items-center gap-2">
          <Groups2Icon
            className="text-[#e63946] transition-colors cursor-pointer duration-300 ease-in-out hover:text-[#b82e38]"
            fontSize="large"
          />
          <h1 className="text-white text-2xl font-semibold cursor-pointer transition-colors duration-300 ease-in-out hover:text-[#e63946]">
            Toplantı Yönetim Sistemi
          </h1>
        </div>

        {/* Orta - Linkler */}
        <nav className="flex gap-6 text-gray-400 text-sm"></nav>

        {/* Sağ - Sosyal Medya */}
        <div className="flex gap-4 text-gray-400">
          <a href="#" className="hover:text-[#e63946] transition-colors">
            <GitHubIcon />
          </a>
          <a href="#" className="hover:text-[#e63946] transition-colors">
            <LinkedInIcon />
          </a>
          <a href="#" className="hover:text-[#e63946] transition-colors">
            <EmailIcon />
          </a>
        </div>
      </div>

      {/* Alt Çizgi ve Telif Yazısı */}
      <div className="w-full flex justify-center mt-8">
        <p className="text-gray-500 text-xs">
          © 2025 Toplantı Yönetim Sistemi. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
