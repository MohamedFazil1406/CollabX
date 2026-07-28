import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { language, code } = await req.json();

  const response = await fetch("http://localhost:2000/api/v2/execute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language,
      version: "*",
      files: [
        {
          name: "main",
          content: code,
        },
      ],
    }),
  });

  const data = await response.json();

  return NextResponse.json(data);
}
