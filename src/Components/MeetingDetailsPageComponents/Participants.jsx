import React, { useState } from "react";
import AddParticipantModal from "./AddParticipantModal";

const Participants = ({ participants, onAdd, onGenerateLink }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-[#1E1E1E] border border-[#2F2F2F] rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Katılımcılar</h2>

      {/* ✅ Katılımcı Listesi */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {participants?.length > 0 ? (
          participants.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 bg-[#2A2A2A] rounded-lg p-3 hover:bg-[#323232] transition"
            >
              <div className="w-10 h-10 bg-[#e63946] text-white rounded-full flex items-center justify-center font-semibold">
                {p.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-medium">{p.name}</p>
                <p className="text-gray-400 text-sm">{p.role || "Katılımcı"}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">Henüz katılımcı yok.</p>
        )}
      </div>

      {/* ✅ Katılımcı Ekle Butonu */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full mt-6 py-2 bg-[#e63946] hover:bg-[#b82e38] rounded-lg text-white text-sm font-medium transition"
      >
        ➕ Katılımcı Ekle
      </button>

      {/* ✅ Modal buradan çağrılıyor */}
      {isModalOpen && (
        <AddParticipantModal
          closeModal={() => setIsModalOpen(false)}
          onAdd={onAdd}
          onGenerateLink={onGenerateLink}
        />
      )}
    </div>
  );
};

export default Participants;
