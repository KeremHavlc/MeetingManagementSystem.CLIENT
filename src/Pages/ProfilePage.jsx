import React from "react";
import ProfileInfo from "../Components/ProfilePageComponent/ProfileInfo";
import PasswordChange from "../Components/ProfilePageComponent/PasswordChange";
import NotificationPreferences from "../Components/ProfilePageComponent/NotificationPreferences";
import AuthHeader from "../Components/AuthHeader";

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-white font-inter select-none">
      <AuthHeader />
      <div className="w-[1100px] mx-auto mt-12 pb-20">
        <h1 className="text-4xl font-bold mb-10">Hesap Ayarları</h1>

        {/* Üst Bilgi */}
        <ProfileInfo />

        {/* Alt Ayarlar */}
        <div className="grid grid-cols-2 gap-10">
          <PasswordChange />
          <NotificationPreferences />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
