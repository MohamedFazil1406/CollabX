const languageMap: Record<string, string> = {
  // JavaScript / TypeScript
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",

  // Web
  html: "html",
  css: "css",
  scss: "scss",
  less: "less",

  // Data
  json: "json",
  yaml: "yaml",
  yml: "yaml",
  xml: "xml",

  // Markdown
  md: "markdown",

  // Backend
  java: "java",
  go: "go",
  py: "python",
  php: "php",
  rb: "ruby",
  rs: "rust",
  cs: "csharp",

  // C/C++
  c: "c",
  cpp: "cpp",
  h: "cpp",

  // Shell
  sh: "shell",
  bash: "shell",

  // SQL
  sql: "sql",

  // Config
  dockerfile: "dockerfile",
};

export function getLanguageFromFilename(filename: string): string {
  const lower = filename.toLowerCase();

  if (lower === "dockerfile") {
    return "dockerfile";
  }

  const extension = lower.split(".").pop();

  if (!extension) {
    return "plaintext";
  }

  return languageMap[extension] ?? "plaintext";
}
