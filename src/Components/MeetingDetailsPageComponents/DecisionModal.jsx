import React, { useState } from "react";

const DecisionModal = ({
  closeModal,
  selectedAgendaItem,
  participants,
  saveDecisionToAgenda,
}) => {
  const [decisionText, setDecisionText] = useState(
    selectedAgendaItem?.decision || ""
  );
  const [selectedUsers, setSelectedUsers] = useState([]);

  const toggleUserSelection = (userName) => {
    if (selectedUsers.includes(userName)) {
      setSelectedUsers(selectedUsers.filter((name) => name !== userName));
    } else {
      setSelectedUsers([...selectedUsers, userName]);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === "decisionModalOverlay") {
      closeModal();
    }
  };

  return (
    <div
      id="decisionModalOverlay"
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1E1E1E] border border-[#2F2F2F] rounded-xl w-[500px] shadow-lg overflow-hidden"
      >
        {/* Üst Header */}
        <div className="flex justify-between items-center px-5 py-3 border-b border-[#2F2F2F] bg-[#242424]">
          <h3 className="text-lg font-semibold text-white">
            Karar Al - {selectedAgendaItem?.title}
          </h3>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* İçerik */}
        <div className="p-5 space-y-4">
          {/* Karar Metni */}
          <div>
            <p className="text-gray-300 text-sm mb-2">Karar Metni:</p>
            <textarea
              value={decisionText}
              onChange={(e) => setDecisionText(e.target.value)}
              className="w-full bg-[#2A2A2A] border border-[#2F2F2F] rounded-lg px-3 py-2 text-sm text-white h-24 resize-none focus:outline-none focus:border-[#e63946]"
              placeholder="Kararı buraya yazın..."
            />
          </div>

          {/* Kullanıcı Seçimi */}
          <div>
            <p className="text-gray-300 text-sm mb-2">Karar Kimlere Atansın?</p>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {participants.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center gap-2 text-gray-300 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.name)}
                    onChange={() => toggleUserSelection(user.name)}
                    className="accent-[#e63946]"
                  />
                  {user.name}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Alt Butonlar */}
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-[#2F2F2F]">
          <button
            onClick={closeModal}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            İptal
          </button>
          <button
            onClick={() => saveDecisionToAgenda(decisionText, selectedUsers)}
            className="bg-[#e63946] hover:bg-[#b82e38] text-white px-4 py-2 rounded-lg text-sm"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default DecisionModal;
