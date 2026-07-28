"use client";

import { useEffect, useState } from "react";
import { getRepositories } from "@/lib/github";

export default function GithubSidebar() {
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    getRepositories().then(setRepos);
  }, []);

  return (
    <div className="p-2">
      <h2 className="font-bold mb-2">GitHub Repositories</h2>

      {repos.map((repo) => (
        <div
          key={repo.id}
          className="cursor-pointer rounded p-2 hover:bg-zinc-800"
        >
          {repo.name}
        </div>
      ))}
    </div>
  );
}
