"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface PR {
  number: number;
  title: string;
}

interface Props {
  onSelect: (prNumber: number, code: string) => void;
}

export default function PullRequestSelector({ onSelect }: Props) {
  const [prs, setPRs] = useState<PR[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPRs = async () => {
      const res = await axios.get("/api/github/prs");
      setPRs(res.data);
    };
    fetchPRs();
  }, []);

  const handleRun = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/github/pr/${selected}`);
      const code = res.data.code;
      onSelect(selected, code);
    } catch (err) {
      alert("Failed to fetch PR code.");
    }
    setLoading(false);
  };

  return (
    <div className="mb-4">
      <label htmlFor="prSelect" className="form-label">
        Select GitHub PR
      </label>
      <select
        className="form-select"
        id="prSelect"
        onChange={(e) => setSelected(Number(e.target.value))}
      >
        <option value="">-- Choose a PR --</option>
        {prs.map((pr) => (
          <option key={pr.number} value={pr.number}>
            #{pr.number}: {pr.title}
          </option>
        ))}
      </select>
      <button
        className="btn btn-primary mt-2"
        onClick={handleRun}
        disabled={!selected || loading}
      >
        {loading ? "Loading..." : "Load PR Code"}
      </button>
    </div>
  );
}
