"use client";

import FileNode from "./FileNode";
import { useExplorerStore } from "@/store/explorer";

export default function FileTree() {
  const { files } = useExplorerStore();

  if (files.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-zinc-500">
        No files
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {files.map((file) => (
        <FileNode key={file.id} file={file} />
      ))}
    </div>
  );
}
