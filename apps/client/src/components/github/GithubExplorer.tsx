"use client";

import { useGithub } from "@/hooks/useGithub";
import { loadRepository } from "@/hooks/useGithub";
import { useGithubStore } from "@/store/github";
import GithubFileTree from "@/components/github/GithubFileTree";

export default function GithubExplorer() {
  useGithub();

  const repos = useGithubStore((s) => s.repos);

  const setFiles = useGithubStore((s) => s.setFiles);

  return (
    <div className="border-t border-zinc-800">
      <h3 className="px-3 py-2 text-sm font-semibold">GitHub</h3>

      {repos.map((repo) => (
        <button
          key={repo.id}
          className="block w-full px-3 py-2 text-left hover:bg-zinc-800"
          onClick={() => loadRepository(repo.full_name, setFiles)}
        >
          📦 {repo.name}
        </button>
      ))}
      <GithubFileTree />
    </div>
  );
}
