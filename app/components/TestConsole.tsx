import React from "react";

interface TestConsoleProps {
  output: string | null;
  error: string | null;
}

export default function TestConsole({ output, error }: TestConsoleProps) {
  return (
    <div className="card bg-dark text-white mb-3">
      <div className="card-body font-monospace p-3">
        {error ? (
          <pre className="text-danger fw-bold m-0">{error}</pre>
        ) : (
          <pre className="text-success m-0">{output || "// No output yet"}</pre>
        )}
      </div>
    </div>
  );
}
