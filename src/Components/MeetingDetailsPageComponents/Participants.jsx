import React from "react";

const Participants = ({ participants, openModal }) => {
  return (
    <div className="bg-[#1E1E1E] border border-[#2F2F2F] rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Katılımcılar</h2>

      {/* Katılımcı Listesi */}
      <div className="space-y-4">
        {participants.map((p) => (
          <div key={p.id} className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-[#e63946] rounded-full flex items-center justify-center font-semibold text-white">
              {p.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-white">{p.name}</p>
              <p className="text-sm text-gray-400">{p.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Yeni Katılımcı Ekle Butonu */}
      <div className="mt-6 pt-4 border-t border-[#2F2F2F]">
        <button
          onClick={openModal}
          className="bg-[#e63946] hover:bg-[#b82e38] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full"
        >
          Katılımcı Ekle
        </button>
      </div>
    </div>
  );
};

export default Participants;
