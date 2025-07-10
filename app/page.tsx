/*"use client";

import { useState } from "react";
import TestEditor from "@/app/components/TestEditor";
import TestConsole from "@/app/components/TestConsole";
import TestHistory from "@/app/components/TestHistory";
import { TestRun } from "@/app/components/types";

export default function HomePage() {
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleHistorySelect = (run: TestRun) => {
    // Optionally, you can set output/error here if you want history selection to update the console
    setOutput(run.output);
    setError(run.error);
  };

  return (
    <div className="container mt-5">
      <header className="mb-4 text-center">
        <h1 className="display-4 text-primary mb-2">TestPilot</h1>
        <p className="lead text-secondary">
          AI-powered unit test sandbox. Write, run, and manage your test cases
          effortlessly.
        </p>
      </header>
      <div className="row g-4">
        {/* Editor + Output Card */ /*}
        <div className="col-md-8">
          <div className="card p-4 mb-4">
            <h2 className="h4 text-primary mb-3">Test Editor</h2>
            <TestEditor setOutput={setOutput} setError={setError} />
            <div className="mt-4">
              <h3 className="h5 text-secondary mb-2">Console Output</h3>
              <TestConsole output={output} error={error} />
            </div>
          </div>
        </div>
        {/* History Card */ /*}
        <div className="col-md-4">
          <div className="card p-4 h-100">
            <h2 className="h4 text-primary mb-3">Test History</h2>
            <TestHistory onSelect={handleHistorySelect} />
          </div>
        </div>
      </div>
    </div>
  );
}

*/

"use client";

import { useState } from "react";
import TestEditor from "@/app/components/TestEditor";
import TestConsole from "@/app/components/TestConsole";
import TestHistory from "@/app/components/TestHistory";
import PullRequestSelector from "@/app/components/GitHub/PullRequestSelector";
import { TestRun } from "@/app/components/types";
import axios from "axios";

export default function HomePage() {
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string>("");
  const [selectedPR, setSelectedPR] = useState<number | null>(null);
  const [loadingAI, setLoadingAI] = useState<boolean>(false);
  const [testMode, setTestMode] = useState<string>("edge");
  const [language, setLanguage] = useState<string>("javascript");

  const handleHistorySelect = (run: TestRun) => {
    setOutput(run.output);
    setError(run.error);
    setCode(run.code);
  };

  const handlePostToPR = async () => {
    if (!selectedPR) return;
    try {
      await axios.post(`/api/github/pr/${selectedPR}/comment`, {
        body: error
          ? `❌ Test Failed:\n\n${error}`
          : `✅ Test Passed:\n\n${output}`,
      });
      alert("Comment posted to PR!");
    } catch (err) {
      alert("Failed to post comment.");
    }
  };

  const handleGenerateTests = async () => {
    setLoadingAI(true);
    try {
      const res = await axios.post(
        `/api/generate-tests?mode=${testMode}&lang=${language}`,
        { code }
      );
      const cleaned = res.data.generated.replace(/```/g, "");
      setCode(cleaned);
    } catch (err) {
      alert("Failed to generate test code.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="container mt-5">
      <header className="mb-4 text-center">
        <h1 className="display-4 text-primary mb-2">TestPilot</h1>
        <p className="lead text-secondary">
          AI-powered unit test sandbox. Write, run, and manage your test cases
          effortlessly.
        </p>
      </header>

      <PullRequestSelector
        onSelect={(prNumber, prCode) => {
          setSelectedPR(prNumber);
          setCode(prCode);
          setOutput(null);
          setError(null);
        }}
      />

      <div className="row g-4">
        {/* Editor + Output Card */}
        <div className="col-md-8">
          <div className="card p-4 mb-4">
            <h2 className="h4 text-primary mb-3">Test Editor</h2>

            <div className="mb-3">
              <label htmlFor="language" className="form-label">
                Select Language
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="form-select mb-2"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>

              <label htmlFor="testMode" className="form-label">
                Select Test Case Style
              </label>
              <select
                id="testMode"
                value={testMode}
                onChange={(e) => setTestMode(e.target.value)}
                className="form-select"
              >
                <option value="edge">✅ Edge Cases</option>
                <option value="large">✅ Large Test Suite</option>
                <option value="minimal">✅ Minimal Test Suite</option>
                <option value="performance">✅ Performance Stress Test</option>
                <option value="security">✅ Security Tests</option>
              </select>
            </div>

            <div className="d-flex gap-2 mb-3">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleGenerateTests}
                disabled={loadingAI}
              >
                {loadingAI ? "Generating..." : "Generate Tests with AI"}
              </button>
              {selectedPR && (
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={handlePostToPR}
                >
                  Post Result to PR #{selectedPR}
                </button>
              )}
            </div>

            <TestEditor
              setOutput={setOutput}
              setError={setError}
              code={code}
              setCode={setCode}
            />

            <div className="mt-4">
              <h3 className="h5 text-secondary mb-2">Console Output</h3>
              <TestConsole output={output} error={error} />
            </div>
          </div>
        </div>

        {/* History Card */}
        <div className="col-md-4">
          <div className="card p-4 h-100">
            <h2 className="h4 text-primary mb-3">Test History</h2>
            <TestHistory onSelect={handleHistorySelect} />
          </div>
        </div>
      </div>
    </div>
  );
}
