import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    piston: !!process.env.PISTON_API_KEY,
    githubSecret: !!process.env.GITHUB_CLIENT_ID,
    betterstack: !!process.env.BETTERSTACK_API_KEY,
  });
}
