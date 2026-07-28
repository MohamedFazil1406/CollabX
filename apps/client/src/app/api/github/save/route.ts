import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const token = (await cookies()).get("github_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { owner, repo, path, sha, content, message } = await req.json();

  if (!owner || !repo || !path || !sha || content === undefined) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const encoded = Buffer.from(content).toString("base64");

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message ?? `Update ${path} from CollabX`,
        content: encoded,
        sha,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(data, {
      status: response.status,
    });
  }

  return NextResponse.json(data);
}
