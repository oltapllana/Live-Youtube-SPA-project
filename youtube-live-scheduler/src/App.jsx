import { useState, useEffect } from "react";
import { useScheduler } from "./hooks/useScheduler";

import Header from "./components/Header";
import Player from "./components/Player";
import ProgramInfo from "./components/ProgramInfo";
import MiniGuide from "./components/MiniGuide";
import NowBar from "./components/NowBar";
import Toast from "./components/Toast";
import ImportInstanceModal from "./components/ImportInstanceModal";

export default function App() {
  const {
    status,
    timeline,
    fullTimeline,
    currentProgram,
    selectedChannel,
    simNow,
    loadInstance,
    filterTimelineByChannel,
  } = useScheduler();

  const [showImport, setShowImport] = useState(false);
  const [instanceData, setInstanceData] = useState(null);

  const [toasts, setToasts] = useState([]);

  // --- Toast helpers ---
  function addToast(message) {
    setToasts((prev) => [...prev, message]);
  }

  function removeToast(index) {
    setToasts((prev) => prev.filter((_, i) => i !== index));
  }

  // --- Add toast kur programi ndryshon ---
  useEffect(() => {
    if (currentProgram) {
      addToast(`Program started: ${currentProgram.channel_name}`);
    }
  }, [currentProgram]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-950 via-blue-950 to-slate-950 text-slate-100">
      {/* HEADER */}
      <Header
        fullTimeline={fullTimeline}
        selectedChannel={selectedChannel}
        filterTimelineByChannel={filterTimelineByChannel}
        loadInstance={loadInstance}
        channelsList={instanceData?.channels || []} // lista e plotë e kanaleve
        onImportClick={() => setShowImport(true)}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[2.3fr_1fr] gap-6 p-6">
        {/* LEFT PANEL */}
        <section className="flex flex-col gap-5">
          <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/10 bg-black">
            <Player program={currentProgram} />
          </div>

          <NowBar program={currentProgram} />

          <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10">
            <ProgramInfo program={currentProgram} />
          </div>
        </section>

        {/* RIGHT PANEL */}
        <aside className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-4">
          <MiniGuide timeline={timeline} now={simNow} />
        </aside>
      </main>

      {/* MODAL: Import Instance */}
      {showImport && (
        <ImportInstanceModal
          onClose={() => setShowImport(false)}
          onImport={(instance) => {
            console.log("Instance që po dërgohet:", instance); // shiko në console
              setInstanceData(instance);   // <-- ruaj instance në state
            loadInstance(instance); // kjo thërret scheduler
            setShowImport(false);
          }}

        />
      )}

      {/* TOASTS */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map((msg, index) => (
          <Toast key={index} message={msg} onClose={() => removeToast(index)} />
        ))}
      </div>
    </div>
  );
}
