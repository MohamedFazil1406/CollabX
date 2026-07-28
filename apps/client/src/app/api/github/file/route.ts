import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = (await cookies()).get("github_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const owner = req.nextUrl.searchParams.get("owner");
  const repo = req.nextUrl.searchParams.get("repo");
  const path = req.nextUrl.searchParams.get("path");

  if (!owner || !repo || !path) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const error = await response.json();

    return NextResponse.json(
      {
        error: error.message ?? "Failed to fetch file",
      },
      {
        status: response.status,
      },
    );
  }

  const file = await response.json();

  if (file.type !== "file") {
    return NextResponse.json(
      { error: "Only files can be opened" },
      { status: 400 },
    );
  }

  const content = Buffer.from(
    file.content.replace(/\n/g, ""),
    "base64",
  ).toString("utf8");

  return NextResponse.json({
    name: file.name,
    path: file.path,
    sha: file.sha,
    content,
  });
}
