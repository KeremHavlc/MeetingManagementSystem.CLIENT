import { useState } from "react";
import AuthHeader from "../Components/AuthHeader";
import ChatSection from "../Components/MeetingDetailsPageComponents/ChatSection";
import Participants from "../Components/MeetingDetailsPageComponents/Participants";
import AgendaSection from "../Components/MeetingDetailsPageComponents/AgendaSection";
import DecisionModal from "../Components/MeetingDetailsPageComponents/DecisionModal";

const MeetingDetailsPage = () => {
  const [participants, setParticipants] = useState([
    { id: 1, name: "Ayşe Yılmaz", role: "Proje Yöneticisi" },
    { id: 2, name: "Ahmet Çelik", role: "Yazılım Geliştirici" },
    { id: 3, name: "Fatma Kaya", role: "Tasarımcı" },
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "Ayşe Yılmaz",
      time: "14:05",
      text: "Herkese merhaba, toplantıya hazır mıyız?",
    },
    { id: 2, user: "Sen", time: "14:06", text: "Hazırım, başlıyoruz!" },
    { id: 3, user: "Ahmet Çelik", time: "14:07", text: "Sunumu paylaşıyorum." },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [agendaProgress, setAgendaProgress] = useState(45);
  const [agendaItems, setAgendaItems] = useState([
    {
      id: 1,
      title: "Proje hedeflerinin gözden geçirilmesi",
      decision: "Hedefler onaylandı.",
      assignedTo: [],
      status: "completed",
    },
    {
      id: 2,
      title: "Zaman çizelgesi ve kilometre taşları",
      decision: "İlk kilometre taşı 2 hafta ertelendi.",
      assignedTo: [],
      status: "completed",
    },
    {
      id: 3,
      title: "Bütçe ve kaynak tahsisi",
      decision: null,
      assignedTo: [],
      status: "pending",
    },
  ]);

  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [selectedAgendaItem, setSelectedAgendaItem] = useState(null);

  const openDecisionModal = (item) => {
    setSelectedAgendaItem(item);
    setShowDecisionModal(true);
  };

  const saveDecisionToAgenda = (decisionText, selectedUsers) => {
    if (!selectedAgendaItem) return;

    const updated = agendaItems.map((item) =>
      item.id === selectedAgendaItem.id
        ? {
            ...item,
            decision: decisionText,
            assignedTo: selectedUsers,
            status: "completed",
          }
        : item
    );

    setAgendaItems(updated);

    const completedCount = updated.filter(
      (i) => i.status === "completed"
    ).length;
    setAgendaProgress(Math.round((completedCount / updated.length) * 100));

    setShowDecisionModal(false);
    setSelectedAgendaItem(null);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now(),
        user: "Sen",
        time: new Date().toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: newMessage,
      },
    ]);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <AuthHeader />

      <div className="w-[1100px] mx-auto mt-4">
        {/* Başlık */}
        <div className="mb-8 pb-6 border-b border-[#2F2F2F]">
          <h1 className="text-3xl font-bold">Proje Lansman Toplantısı</h1>
          <p className="text-gray-400">24 Ekim 2024, 14:00 | Online</p>
        </div>

        <div className="flex gap-6">
          <ChatSection
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
          />

          <div className="w-1/3 space-y-6">
            <Participants participants={participants} />

            <AgendaSection
              agendaItems={agendaItems}
              agendaProgress={agendaProgress}
              openDecisionModal={openDecisionModal}
            />
          </div>
        </div>
      </div>

      {showDecisionModal && (
        <DecisionModal
          closeModal={() => setShowDecisionModal(false)}
          selectedAgendaItem={selectedAgendaItem}
          participants={participants}
          saveDecisionToAgenda={saveDecisionToAgenda}
        />
      )}
    </div>
  );
};

export default MeetingDetailsPage;
