import { NextResponse } from "next/server";

export async function GET() {
  const { GITHUB_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME } = process.env;

  if (!GITHUB_TOKEN || !GITHUB_REPO_OWNER || !GITHUB_REPO_NAME) {
    return NextResponse.json(
      { error: "Missing GitHub configuration in environment variables." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/pulls`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!res.ok) {
      const errorBody = await res.text();
      return NextResponse.json(
        {
          error: `GitHub API error: ${res.status} ${res.statusText}`,
          details: errorBody,
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    // Map to only needed fields
    const simplified = data.map((pr: any) => ({
      number: pr.number,
      title: pr.title,
    }));

    return NextResponse.json(simplified);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch PRs", details: err.message },
      { status: 500 }
    );
  }
} 