import React, { useState, useEffect } from "react";
import axios from "axios";

const GlobalLoader = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const reqInterceptor = axios.interceptors.request.use((config) => {
      setLoading(true);
      return config;
    });
    const resInterceptor = axios.interceptors.response.use(
      (response) => {
        setLoading(false);
        return response;
      },
      (error) => {
        setLoading(false);
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-[9999] animate-fadeIn">
      {/* Dönen spinner */}
      <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin mb-4"></div>

      {/* Yazı */}
      <h1 className="text-white text-lg font-semibold tracking-wide animate-pulse">
        Meeting Management System
      </h1>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default GlobalLoader;
