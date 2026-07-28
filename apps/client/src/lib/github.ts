import { GithubRepository } from "@/types/github";

export async function getRepositories(): Promise<GithubRepository[]> {
  const response = await fetch("/api/github/repos");

  if (!response.ok) {
    throw new Error("Failed to fetch repositories");
  }

  return response.json();
}
