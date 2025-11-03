import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    window.is404 = true;
    return () => {
      window.is404 = false;
    };
  }, []);
  useEffect(() => {
    const move = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const dots = useMemo(
    () =>
      Array.from({ length: 80 }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 5,
      })),
    []
  );

  const quotes = [
    "Aradığın sayfa burada değil.",
    "404: Görünüşe göre yanlış yoldasın.",
  ];
  const message = useMemo(
    () => quotes[Math.floor(Math.random() * quotes.length)],
    []
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#111111] via-[#191919] to-[#202020] overflow-hidden">
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-[#e63946]/30 blur-[1px]"
          style={{
            top: `${d.top}%`,
            left: `${d.left}%`,
            width: d.size,
            height: d.size,
            animation: `fadeDot 4s ${d.delay}s infinite alternate`,
          }}
        />
      ))}

      <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-[#e63946]/20 blur-[160px]" />
      <div className="absolute -bottom-32 -right-32 w-[35rem] h-[35rem] rounded-full bg-[#e63946]/15 blur-[200px]" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center select-none">
        <div className="relative mb-8">
          <h1
            className="text-[22vw] md:text-[12rem] font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#ff6b6b] via-[#e63946] to-[#b71c1c] animate-pulseRed drop-shadow-[0_0_25px_rgba(230,57,70,0.5)]"
            style={{
              transform: `translate(${mouse.x * 0.01}px, ${mouse.y * 0.01}px)`,
            }}
          >
            404
          </h1>
          <span className="absolute inset-0 bg-[#e63946]/10 blur-[100px] animate-fadeGlow" />
        </div>

        <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-white/90">
          Sayfa bulunamadı
        </h2>
        <p className="max-w-2xl text-white/70 text-base mb-8">{message}</p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-sm font-medium transition hover:bg-[#e63946]/10 hover:border-[#e63946]/40"
          >
            Ana sayfaya dön
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-sm font-medium transition hover:bg-[#e63946]/10 hover:border-[#e63946]/40"
          >
            Geri git
          </button>
        </div>
      </div>

      <footer className="absolute bottom-5 w-full text-center text-xs text-white/50 z-10">
        © {new Date().getFullYear()} Meeting Management System •{" "}
      </footer>

      <style jsx>{`
        @keyframes fadeDot {
          0% {
            opacity: 0.1;
            transform: scale(0.9);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
          100% {
            opacity: 0.1;
            transform: scale(0.9);
          }
        }

        @keyframes pulseRed {
          0%,
          100% {
            text-shadow: 0 0 15px rgba(230, 57, 70, 0.5),
              0 0 35px rgba(230, 57, 70, 0.3), 0 0 60px rgba(255, 107, 107, 0.2);
          }
          50% {
            text-shadow: 0 0 30px rgba(230, 57, 70, 0.8),
              0 0 60px rgba(255, 107, 107, 0.5),
              0 0 90px rgba(255, 107, 107, 0.3);
          }
        }

        @keyframes fadeGlow {
          0% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
