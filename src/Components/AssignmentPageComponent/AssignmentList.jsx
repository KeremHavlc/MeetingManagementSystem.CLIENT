import React from "react";

const getStatusStyle = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-900/20 text-green-400 border border-green-700/60";
    case "InProgress":
      return "bg-yellow-900/20 text-yellow-300 border border-yellow-700/60";
    case "Pending":
      return "bg-blue-900/20 text-blue-400 border border-blue-700/60";
    default:
      return "bg-[#1E1E1E] text-gray-400 border border-[#2F2F2F]";
  }
};

const AssignmentList = ({
  assignments,
  selectedTask,
  setSelectedTask,
  handleStatusChange,
}) => {
  return (
    <>
      {/* 🔹 Görev Kartları */}
      {assignments.length === 0 ? (
        <p className="text-gray-500 text-center mt-12">
          Henüz atanmış görevin bulunmuyor.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {assignments.map((task) => (
            <div
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className="bg-[#141414] border border-[#242424] rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.4)] 
              hover:shadow-[0_0_25px_rgba(230,57,70,0.2)] hover:border-[#e63946]/60 transition-all duration-300 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{task.title}</h2>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusStyle(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {task.description}
              </p>

              <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
                <span>
                  📅{" "}
                  {task.date
                    ? new Date(task.date + "Z").toLocaleDateString("tr-TR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </span>
                <span className="italic text-gray-400">
                  {task.meetingTitle || "-"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Modal */}
      {selectedTask && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-[6px] flex justify-center items-center z-50"
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="bg-[#1A1A1A]/90 backdrop-blur-md border border-[#2F2F2F] rounded-2xl w-full max-w-md p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-3">{selectedTask.title}</h2>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              {selectedTask.description}
            </p>

            <div className="text-xs text-gray-500 mb-6">
              📅{" "}
              {selectedTask.date
                ? new Date(selectedTask.date + "Z").toLocaleDateString(
                    "tr-TR",
                    {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )
                : "-"}{" "}
              — {selectedTask.meetingTitle || "-"}
            </div>

            <div className="space-y-3">
              {["Pending", "InProgress", "Completed"].map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(selectedTask.id, s)}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium ${getStatusStyle(
                    s
                  )} hover:opacity-80 transition`}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelectedTask(null)}
              className="mt-6 w-full py-2.5 rounded-lg bg-[#2F2F2F] hover:bg-[#3A3A3A] transition text-gray-200 font-medium"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignmentList;
