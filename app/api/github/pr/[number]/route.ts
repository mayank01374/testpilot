import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { number: string } }) {
  const { GITHUB_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME } = process.env;
  const prNumber = params.number;

  if (!GITHUB_TOKEN || !GITHUB_REPO_OWNER || !GITHUB_REPO_NAME) {
    return NextResponse.json(
      { error: "Missing GitHub environment variables." },
      { status: 500 }
    );
  }

  try {
    // Step 1: Get PR details to find the branch name
    const prRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/pulls/${prNumber}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );
    const prData = await prRes.json();
    const branchName = prData.head.ref;

    // Step 2: Fetch file contents (e.g., hello.js) from that branch
    const fileRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/hello.js?ref=${branchName}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!fileRes.ok) {
      const errorText = await fileRes.text();
      return NextResponse.json(
        { error: "Unable to fetch file.", details: errorText },
        { status: fileRes.status }
      );
    }

    const fileData = await fileRes.json();
    const code = Buffer.from(fileData.content, "base64").toString("utf8");

    return NextResponse.json({ code });
  } catch (err: any) {
    return NextResponse.json(
      { error: "PR fetch failed", details: err.message },
      { status: 500 }
    );
  }
} 