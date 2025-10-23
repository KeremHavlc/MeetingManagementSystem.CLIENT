import React from "react";

const AgendaSection = ({ agendaItems, agendaProgress, openDecisionModal }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-600";
      case "pending":
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Tamamlandı";
      case "pending":
        return "Beklemede";
      default:
        return "Devam Ediyor";
    }
  };

  return (
    <div className="bg-[#1E1E1E] border border-[#2F2F2F] rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Gündem ve Kararlar</h2>
        <span className="text-sm text-gray-400">%{agendaProgress}</span>
      </div>

      <div className="space-y-4">
        {agendaItems.map((item) => (
          <div key={item.id} className="border-l-4 border-[#e63946] pl-4">
            <div className="flex items-start justify-between mb-1">
              <p className="font-medium text-white text-sm">{item.title}</p>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  item.status
                )} text-white`}
              >
                {getStatusText(item.status)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-2">
              Karar: {item.decision || "Henüz karar alınmadı"}
            </p>
            <button
              onClick={() => openDecisionModal(item)}
              className="bg-[#e63946] hover:bg-[#b82e38] text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
            >
              Karar Al
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-[#2F2F2F]">
        <p className="text-sm font-medium text-white mb-1">Gündem İlerlemesi</p>
        <div className="w-full bg-[#2A2A2A] rounded-full h-2">
          <div
            className="bg-[#e63946] h-2 rounded-full transition-all duration-300"
            style={{ width: `${agendaProgress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AgendaSection;
