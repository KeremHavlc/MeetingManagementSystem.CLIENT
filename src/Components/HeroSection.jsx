import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import meeting from '../Assets/team-collaboration.png';
import SplitText from "../ReactBits/SplitText";

const HeroSection = () => {
  const imageRef = useRef(null);
  const textRef = useRef(null); 

  useEffect(() => {
    gsap.fromTo(
      imageRef.current,
      { x: 200, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.5, ease: "power3.out" }
    );

    gsap.fromTo(
      textRef.current,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.3 }
    );
  }, []);

  return (
    <>
      <div className="w-full flex justify-center mt-10 select-none">
        <div className="w-[1100px] flex justify-between items-center">

          {/* Sol Taraf - Metinler */}
          <div className="max-w-[450px]">

            {/* Başlık (SplitText ile animasyonlu) */}
            <SplitText
              text={"Toplantılarını Daha\nAkıllı Yönet"}
              className="text-white text-5xl font-bold leading-tight whitespace-pre-line"
              delay={40}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
            />

            {/* Paragraf + Buton Topluca Soldan Gelsin */}
            <div ref={textRef}>
              <p className="text-gray-400 mt-4">
                Toplantılarınızı planlayın, yönetin ve takip edin. Verimliliği artırın, zaman kazanın.
              </p>

              <button className="mt-6 bg-[#e63946] hover:bg-[#b82e38] cursor-pointer transition-colors px-6 py-3 rounded-lg font-semibold text-white">
                Ücretsiz Denemeye Başla
              </button>
            </div>

          </div>

          {/* Sağ Taraf - Animasyonlu Görsel */}
          <div>
            <img
              ref={imageRef}
              src={meeting}
              alt="Toplantı Paneli"
              className="w-[550px] h-[280px] rounded-xl shadow-lg object-cover"
            />
          </div>
        </div>
      </div>

      {/* Alt Çizgi */}
      <div className="flex justify-center border-b mt-10 w-[1100px] border-gray-500"></div>
    </>
  );
};

export default HeroSection;
