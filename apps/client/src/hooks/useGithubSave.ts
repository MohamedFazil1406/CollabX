import { useActiveFile } from "./useActiveFile";

export function useGithubSave() {
  const { activeFile } = useActiveFile();

  async function save() {
    if (!activeFile?.github) return;

    const res = await fetch("/api/github/save", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        owner: activeFile.github.owner,
        repo: activeFile.github.repo,
        path: activeFile.github.path,
        sha: activeFile.github.sha,
        content: activeFile.content,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to save file");
    }

    return res.json();
  }

  return { save };
}
