"use client";

import { useEffect } from "react";
import { useGithubStore } from "@/store/github";

export function useGithub() {
  const setRepos = useGithubStore((s) => s.setRepos);

  useEffect(() => {
    fetch("/api/github/repos")
      .then((r) => r.json())
      .then(setRepos);
  }, [setRepos]);
}

export async function loadRepository(
  fullName: string,
  setFiles: (files: any[]) => void,
  path = "",
) {
  const [owner, repo] = fullName.split("/");

  console.log("Loading path:", path);

  const url = `/api/github/contents?owner=${owner}&repo=${repo}&path=${encodeURIComponent(path)}`;

  console.log(url);

  const response = await fetch(url);

  const files = await response.json();

  console.log(files);

  setFiles(files);
}
