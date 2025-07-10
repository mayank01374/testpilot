import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  const url = new URL(req.url);
  const mode = url.searchParams.get("mode") || "default";
  const lang = url.searchParams.get("lang") || "javascript";

  const languageNames: Record<string, string> = {
    javascript: "JavaScript",
    python: "Python",
    cpp: "C++",
    java: "Java",
  };

  const testSyntaxHints: Record<string, string> = {
    javascript: "Use console.log to write test cases.",
    python: "Use print statements to test the function.",
    cpp: "Use std::cout for test output.",
    java: "Use System.out.println for test cases.",
  };

  const styleHints: Record<string, string> = {
    edge: "Focus on edge cases, such as empty inputs, null values, large values, or boundary conditions.",
    large: "Generate 15-20 diverse test cases that cover a wide range of valid inputs.",
    minimal: "Generate just 3-5 concise test cases to cover the core logic.",
    performance: "Test with large inputs or stress the function's limits.",
    security: "Include test cases with injection patterns, invalid characters, and input sanitization.",
  };

  const testStyleHint = styleHints[mode] || "Generate helpful test cases.";
  const langHint = testSyntaxHints[lang] || "Use console.log for test output.";
  const languageName = languageNames[lang] || "JavaScript";

  const prompt = `
You are a helpful assistant who writes testable code for ${languageName}.

Given this function:

${code}

${testStyleHint}
${langHint}

Output only raw, valid ${languageName} code which was given by the user as it is without any changes follwed by the test cases in that language— no explanations, no markdown, no comments, no extra phrases.
`;

  // Move GROQ_API_KEY access and Groq client instantiation here
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY environment variable is missing or empty; either provide it, or instantiate the Groq client with an apiKey option, like new Groq({ apiKey: 'My API Key' }).");
  }
  const groq = new Groq({
    apiKey: GROQ_API_KEY,
  });

  try {
    const result = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You write useful, correct test cases for code." },
        { role: "user", content: prompt },
      ],
      model: "llama3-8b-8192",
    });

    const generated = result.choices?.[0]?.message?.content || "// No test cases generated.";
    return NextResponse.json({ generated });
  } catch (err: unknown) {
    console.error("Groq API Error:", err);
    return NextResponse.json({ error: "Failed to generate test code", details: (err as Error).message }, { status: 500 });
  }
} 