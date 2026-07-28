"use client";

import { useGithubStore } from "@/store/github";
import { openGithubFile } from "@/hooks/useGithubFile";

export default function GithubFileTree() {
  const files = useGithubStore((s) => s.files);
  const selectedRepo = useGithubStore((s) => s.selectedRepo);

  const handleOpen = async (path: string) => {
    if (!selectedRepo) return;

    const [owner, repo] = selectedRepo.full_name.split("/");

    try {
      await openGithubFile(owner, repo, path);
    } catch (error) {
      console.error("Failed to open GitHub file:", error);
    }
  };

  return (
    <div className="border-t border-zinc-800">
      {files.map((file) => (
        <button
          key={file.path}
          type="button"
          onClick={() => {
            if (file.type === "file") {
              handleOpen(file.path);
            }
          }}
          className="flex w-full items-center gap-2 px-5 py-1 text-left text-sm hover:bg-zinc-800"
        >
          <span>{file.type === "dir" ? "📁" : "📄"}</span>
          <span>{file.name}</span>
        </button>
      ))}
    </div>
  );
}
