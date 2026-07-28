import { useExplorerStore } from "@/store/explorer";
import { getLanguageFromFilename } from "@/utils/fileLanguage";

export async function openGithubFile(
  owner: string,
  repo: string,
  path: string,
) {
  const response = await fetch(
    `/api/github/file?owner=${owner}&repo=${repo}&path=${encodeURIComponent(path)}`,
  );

  const githubFile = await response.json();

  const explorer = useExplorerStore.getState();

  const id = `github:${owner}/${repo}/${path}`;

  explorer.createFile({
    id,
    name: githubFile.name,
    language: getLanguageFromFilename(githubFile.name),
    content: githubFile.content,

    github: {
      owner,
      repo,
      path,
      sha: githubFile.sha,
    },
  });

  explorer.openFile(id);
}
