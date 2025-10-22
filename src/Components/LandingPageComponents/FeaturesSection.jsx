import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GavelIcon from "@mui/icons-material/Gavel";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: <EventAvailableIcon className="text-[#e63946]" />,
    title: "Toplantı Oluştur",
    desc: "Tarih, saat, açıklama ve toplantı türüyle hızlıca toplantı planlayabilirsin.",
  },
  {
    icon: <PersonAddIcon className="text-[#e63946]" />,
    title: "Katılımcı Ekle",
    desc: "Toplantıya davetliler ekle, roller atayarak katılımcıları yönet.",
  },
  {
    icon: <GavelIcon className="text-[#e63946]" />,
    title: "Karar Al & Kaydet",
    desc: "Toplantıda alınan kararları sisteme kaydet ve düzenleyebil.",
  },
  {
    icon: <AssignmentIndIcon className="text-[#e63946]" />,
    title: "Karara Katılımcı Görevlendir",
    desc: "Kararlara belirli kullanıcıları sorumlu olarak atayabilirsin.",
  },
  {
    icon: <MailOutlineIcon className="text-[#e63946]" />,
    title: "Mail ile Bildirim",
    desc: "Toplantı, görev veya kararlar için otomatik e-posta bildirimi gider.",
  },
  {
    icon: <AssignmentTurnedInIcon className="text-[#e63946]" />,
    title: "Görev Durumu Takibi",
    desc: "Atanan görevlerin tamamlanıp tamamlanmadığını kolayca takip edebilirsin.",
  },
];

const FeaturesSection = () => {
  const featureRefs = useRef([]);

  useEffect(() => {
    featureRefs.current.forEach((el, index) => {
      if (!el) return;

      gsap.fromTo(
        el,
        { x: index % 2 === 0 ? -100 : 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.1,
          delay: index * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
          },
        }
      );
    });
  }, []);

  return (
    <>
      <div
        id="features"
        className="w-full flex justify-center py-4 select-none"
      >
        <div className="w-[1100px]">
          <h2 className="text-white text-4xl font-bold text-center mb-4">
            Özellikler
          </h2>
          <p className="text-gray-400 text-center mb-6">
            Toplantı süreçlerini kolaylaştıran araçlarımız:
          </p>

          <div className="flex flex-col gap-6">
            {features.map((item, index) => (
              <div
                key={index}
                ref={(el) => (featureRefs.current[index] = el)}
                className="opacity-0 flex items-start gap-4 p-4 border border-gray-700 rounded-xl
              hover:border-[#e63946] transition-all duration-300 hover:bg-[#1e1e1e]"
              >
                <div className="text-3xl">{item.icon}</div>
                <div>
                  <h3 className="text-white text-xl font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Alt Çizgi */}
      <div className="flex justify-center border-b mt-10 mb-10 w-[1100px] border-gray-500"></div>
    </>
  );
};

export default FeaturesSection;
