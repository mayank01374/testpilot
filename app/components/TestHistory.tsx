"use client";

import { useEffect, useState } from "react";
import { TestRun } from "./types";
import { toast } from "sonner";

const HISTORY_KEY = "testpilot_history";

interface TestHistoryProps {
  onSelect: (run: TestRun) => void;
}

export default function TestHistory({ onSelect }: TestHistoryProps) {
  const [history, setHistory] = useState<TestRun[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const handleExport = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "testpilot-history.json";
    link.click();
    URL.revokeObjectURL(url);

    toast.success("History exported!");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result as string) as TestRun[];
        if (Array.isArray(imported)) {
          setHistory(imported);
          localStorage.setItem(HISTORY_KEY, JSON.stringify(imported));
        } else {
          alert("Invalid history file format.");
        }
      } catch (err) {
        alert("Failed to import file.");
      }
    };
    reader.readAsText(file);
  };

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
    toast.info("History cleared.");
  };

  return (
    <div className="mt-3">
      <div className="d-flex align-items-center justify-content-between mb-2">
        {history.length > 0 && (
          <div className="d-flex gap-2 text-xs">
            <button
              onClick={handleExport}
              className="btn btn-outline-primary btn-sm"
            >
              Export JSON
            </button>
            <label className="btn btn-outline-success btn-sm mb-0">
              Import JSON
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="d-none"
              />
            </label>
            <button
              onClick={clearHistory}
              className="btn btn-outline-danger btn-sm"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      <ul
        className="list-group mb-2"
        style={{ maxHeight: "16rem", overflowY: "auto" }}
      >
        {history.length === 0 && (
          <li className="list-group-item text-muted">No history yet.</li>
        )}
        {history.map((run, idx) => (
          <li
            key={idx}
            className="list-group-item list-group-item-action"
            style={{ cursor: "pointer" }}
            onClick={() => onSelect(run)}
          >
            <div className="small text-muted">
              {new Date(run.timestamp).toLocaleString()}
            </div>
            <div className="text-truncate">{run.code}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
