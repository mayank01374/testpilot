"use client";

import React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { TestRun } from "./types";
import TestConsole from "./TestConsole";
import TestHistory from "./TestHistory";

const LOCAL_STORAGE_KEY = "testpilot_code";
const HISTORY_KEY = "testpilot_history";

const templates: Record<string, string> = {
  "": "",
  "Addition Test": `const add = (a, b) => a + b;
console.log(add(2, 3) === 5);`,
  "Palindrome Test": `function isPalindrome(str) {
  return str === str.split("").reverse().join("");
}
console.log(isPalindrome("madam") === true);
console.log(isPalindrome("hello") === false);`,
};

interface TestEditorProps {
  setOutput: (output: string | null) => void;
  setError: (error: string | null) => void;
  code: string;
  setCode: (code: string) => void;
}

export default function TestEditor({
  setOutput,
  setError,
  code,
  setCode,
}: TestEditorProps) {
  const [output, setLocalOutput] = useState<string | null>(null);
  const [error, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, code);
  }, [code]);

  const saveToHistory = (run: TestRun) => {
    const existing = localStorage.getItem(HISTORY_KEY);
    const history: TestRun[] = existing ? JSON.parse(existing) : [];
    const updated = [run, ...history].slice(0, 20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  const handleRun = () => {
    setError(null);
    setOutput(null);
    setLocalError(null);
    setLocalOutput(null);

    try {
      const logs: string[] = [];
      const customConsole = {
        log: (...args: unknown[]) => {
          logs.push(args.join(" "));
        },
      };
      const fn = new Function("console", code);
      fn(customConsole);
      const finalOutput = logs.join("\n");
      setOutput(finalOutput);
      setLocalOutput(finalOutput);
      const run: TestRun = {
        code,
        output: finalOutput,
        error: null,
        timestamp: Date.now(),
      };
      saveToHistory(run);
      toast.success("Test ran successfully!");
    } catch (err: unknown) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      setLocalError(errorMessage);
      const run: TestRun = {
        code,
        output: null,
        error: errorMessage,
        timestamp: Date.now(),
      };
      saveToHistory(run);
      toast.error("Test failed to run.");
    }
  };

  const handleHistorySelect = (run: TestRun) => {
    setCode(run.code);
    setOutput(run.output);
    setError(run.error);
    setLocalOutput(run.output);
    setLocalError(run.error);
  };

  return (
    <form className="w-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 text-primary">Write a Test</h2>
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(code)}
          className="btn btn-outline-primary btn-sm"
        >
          Copy Code
        </button>
      </div>

      <div className="mb-3">
        <label htmlFor="codeArea" className="form-label">
          Test Code
        </label>
        <textarea
          id="codeArea"
          className="form-control font-monospace"
          placeholder="Enter your unit test code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={7}
        />
      </div>

      <div className="d-flex justify-content-end">
        <button type="button" onClick={handleRun} className="btn btn-primary">
          Run Test
        </button>
      </div>
    </form>
  );
}
