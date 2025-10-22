import React from "react";
import Groups2Icon from "@mui/icons-material/Groups2";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InsightsIcon from "@mui/icons-material/Insights";

const WhyUsSection = () => {
  const features = [
    {
      icon: <Groups2Icon fontSize="large" />,
      title: "Kolay Toplantı Yönetimi",
      desc: "Toplantıları saniyeler içinde oluşturun, katılımcıları ekleyin ve detayları düzenleyin.",
    },
    {
      icon: <TaskAltIcon fontSize="large" />,
      title: "Karar & Görev Takibi",
      desc: "Toplantıda alınan kararları ve görev atamalarını kaybetmeyin, yönetin.",
    },
    {
      icon: <AccessTimeIcon fontSize="large" />,
      title: "Zamandan Tasarruf",
      desc: "Mail karmaşası olmadan, tüm süreci tek yerden yönetin.",
    },
    {
      icon: <InsightsIcon fontSize="large" />,
      title: "Verimlilik Artışı",
      desc: "Toplantı geçmişleri kayıtlı, analiz edin ve daha iyi karar verin.",
    },
  ];

  return (
    <>
      <div className="w-full flex justify-center select-none mt-6">
        <div className="w-[1100px] text-center">
          <h2 className="text-white text-4xl font-bold">Neden Biz?</h2>
          <p className="text-gray-400 mt-3">
            Toplantı süreçlerinizi daha düzenli, daha verimli ve daha kolay hale
            getiriyoruz.
          </p>

          {/* ↔ Sonsuz Yatay Kaydırma */}
          <div className="relative mt-12 overflow-hidden group">
            <div className="flex gap-6 animate-scroll whitespace-nowrap group-hover:[animation-play-state:paused]">
              {[...features, ...features].map((item, index) => (
                <div
                  key={index}
                  className="bg-[#1E1E1E] border border-gray-700 rounded-xl p-6 
                  flex flex-col items-center hover:border-[#e63946] transition-all duration-300 
                  min-w-[260px] whitespace-normal break-words"
                >
                  <div className="text-[#e63946] mb-4">{item.icon}</div>
                  <h3 className="text-white text-lg font-semibold text-center whitespace-normal break-words">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-2 px-2 text-center whitespace-normal break-words">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alt Çizgi */}
      <div className="flex justify-center border-b mt-10 w-[1100px] border-gray-500"></div>
    </>
  );
};

export default WhyUsSection;
