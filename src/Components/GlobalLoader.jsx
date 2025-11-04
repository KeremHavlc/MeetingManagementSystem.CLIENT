import React, { useState, useEffect } from "react";
import api from "../Api/AxiosClient"; // axios değil, bizim oluşturduğumuz instance!

const GlobalLoader = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const skipEndpoints = [
      "/MeetingParticipant/GetMeetingParticipantByMeetingId",
      "/ChatMessages/by-meeting",
    ];

    // Request interceptor
    const reqInterceptor = api.interceptors.request.use((config) => {
      const shouldSkip = skipEndpoints.some((endpoint) =>
        config.url?.includes(endpoint)
      );
      if (!shouldSkip) {
        setLoading(true);
      }
      return config;
    });

    // Response interceptor
    const resInterceptor = api.interceptors.response.use(
      (response) => {
        const shouldSkip = skipEndpoints.some((endpoint) =>
          response.config.url?.includes(endpoint)
        );
        if (!shouldSkip) {
          setLoading(false);
        }
        return response;
      },
      (error) => {
        const shouldSkip = skipEndpoints.some((endpoint) =>
          error.config?.url?.includes(endpoint)
        );
        if (!shouldSkip) {
          setLoading(false);
        }
        return Promise.reject(error);
      }
    );

    // Cleanup
    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
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
