"use client";

import { ChevronRight, FileText } from "lucide-react";

import { useExplorerStore } from "@/store/explorer";

export default function Breadcrumbs() {
  const { files, activeFileId } = useExplorerStore();

  const activeFile = files.find((file) => file.id === activeFileId);

  if (!activeFile) {
    return (
      <div className="flex h-10 items-center border-b border-zinc-800 px-4 text-sm text-zinc-500">
        No file selected
      </div>
    );
  }

  // Future-proof for folders
  const parts = activeFile.name.split("/");

  return (
    <div className="flex h-10 items-center border-b border-zinc-800 bg-zinc-900 px-4 text-sm">
      {parts.map((part, index) => {
        const isLast = index === parts.length - 1;

        return (
          <div key={`${part}-${index}`} className="flex items-center">
            {isLast ? (
              <FileText className="mr-2 h-4 w-4 text-blue-400" />
            ) : null}

            <span
              className={isLast ? "font-medium text-white" : "text-zinc-400"}
            >
              {part}
            </span>

            {!isLast && <ChevronRight className="mx-2 h-4 w-4 text-zinc-600" />}
          </div>
        );
      })}
    </div>
  );
}
