"use client";

import { useGithubStore } from "@/store/github";
import { openGithubFile } from "@/hooks/useGithubFile";
import { loadRepository } from "@/hooks/useGithub";

export default function GithubFileTree() {
  const files = useGithubStore((s) => s.files);
  const selectedRepo = useGithubStore((s) => s.selectedRepo);
  const setFiles = useGithubStore((s) => s.setFiles);

  const handleClick = async (file: (typeof files)[number]) => {
    console.log("Clicked:", file);
    if (!selectedRepo) return;

    try {
      if (file.type === "dir") {
        console.log("Opening folder:", file.path);
        await loadRepository(selectedRepo.full_name, setFiles, file.path);
        return;
      }

      const [owner, repo] = selectedRepo.full_name.split("/");

      await openGithubFile(owner, repo, file.path);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="border-t border-zinc-800">
      {files.map((file) => (
        <button
          key={file.path}
          type="button"
          onClick={() => handleClick(file)}
          className="flex w-full items-center gap-2 px-5 py-1 text-left text-sm hover:bg-zinc-800"
        >
          <span>{file.type === "dir" ? "📁" : "📄"}</span>
          <span>{file.name}</span>
        </button>
      ))}
    </div>
  );
}
