import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-hub-signature-256");
  const event = req.headers.get("x-github-event");
  const rawBody = await req.text();

  // Verify signature
  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  const digest = "sha256=" + hmac.update(rawBody).digest("hex");
  if (signature !== digest) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);

  // Handle PR events only
  if (event === "pull_request" && payload.action === "opened") {
    const { number: prNumber } = payload.pull_request;
    const repo = payload.repository.name;
    const owner = payload.repository.owner.login;

    // Move secret access here
    const rawPrivateKey = process.env.GITHUB_PRIVATE_KEY;
    if (!rawPrivateKey) {
      throw new Error("GITHUB_PRIVATE_KEY environment variable is not set.");
    }
    const PRIVATE_KEY = rawPrivateKey.replace(/\\n/g, "\n");
    const APP_ID = process.env.GITHUB_APP_ID!;
    const CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
    const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;

    const appOctokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: APP_ID,
        privateKey: PRIVATE_KEY,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        installationId: payload.installation.id,
      },
    });

    // Get changed files
    const files = await appOctokit.pulls.listFiles({
      owner,
      repo,
      pull_number: prNumber,
    });

    // Generate AI tests (placeholder)
    const testSuggestions = files.data.map((file) => {
      return `Suggested test for ${file.filename}: \n// Write test for this file using Jest.`;
    });

    // Comment on the PR
    await appOctokit.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: `🤖 AI-generated test suggestions:\n\n${testSuggestions.join("\n\n")}`,
    });
  }

  return NextResponse.json({ ok: true });
}
