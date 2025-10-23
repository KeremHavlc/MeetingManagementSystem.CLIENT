import React, { useState } from "react";

const ParticipantModal = ({ closeModal, addEmailParticipant }) => {
  const [email, setEmail] = useState("");

  const handleOverlayClick = (e) => {
    if (e.target.id === "modalOverlay") {
      closeModal();
    }
  };

  return (
    <div
      id="modalOverlay"
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1E1E1E] border border-[#2F2F2F] rounded-xl w-[480px] shadow-xl overflow-hidden"
      >
        {/* Üst Başlık */}
        <div className="flex justify-between items-center px-5 py-3 border-b border-[#2F2F2F] bg-[#242424]">
          <h3 className="text-lg font-semibold text-white">Katılımcı Ekle</h3>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* İçerik */}
        <div className="p-5">
          {/* E-posta ile katılımcı ekleme */}
          <div className="mb-6">
            <p className="text-gray-300 mb-2 text-sm">
              📧 E-posta ile davet gönder:
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-[#2A2A2A] border border-[#2F2F2F] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#e63946]"
                placeholder="ornek@mail.com"
              />
              <button
                onClick={() => {
                  addEmailParticipant(email);
                  setEmail("");
                }}
                className="bg-[#e63946] hover:bg-[#b82e38] px-4 py-2 rounded-lg text-sm text-white transition"
              >
                Ekle
              </button>
            </div>
          </div>

          {/* Link ile katılımcı ekleme */}
          <div className="mb-4">
            <p className="text-gray-300 mb-2 text-sm">
              🔗 Link ile katılımcı ekle:
            </p>
            <button
              onClick={() => alert("Backend ile link oluşturulacak.")}
              className="w-full bg-[#3A3A3A] hover:bg-[#4A4A4A] text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Katılım Linki Oluştur
            </button>
          </div>
        </div>

        {/* Alt Buton */}
        <div className="flex justify-end px-5 py-3 border-t border-[#2F2F2F]">
          <button
            onClick={closeModal}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantModal;
