import { useState } from "react";

export default function ImportInstanceModal({ onClose, onImport }) {
  const [text, setText] = useState("");
  const [error, setError] = useState(null);

 function handleSave() {
  try {
    const parsed = JSON.parse(text.trim());
    onImport(parsed); // ky do thërras loadInstance
    onClose();
  } catch (e) {
    setError("Invalid JSON instance");
  }
}


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-2xl space-y-4">
        <h2 className="text-lg font-semibold">Import Instance</h2>

        <textarea
          className="w-full h-64 p-3 rounded-lg bg-black/40 text-sm text-slate-100"
          placeholder="Paste instance JSON here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {error && <div className="text-red-400 text-sm">{error}</div>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-sky-500 rounded-lg text-slate-900"
          >
            Save & Run
          </button>
        </div>
      </div>
    </div>
  );
}
