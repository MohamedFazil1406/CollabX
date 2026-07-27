"use client";

import CodeEditor from "@/components/editor/CodeEditor";
import Breadcrumbs from "@/components/explorer/Breadcrumbs";
import CommandPalette from "@/components/explorer/CommandPalette";
import FileTabs from "@/components/explorer/FileTabs";

import { useCommandPalette } from "@/hooks/useCommandPalette";
import { useExplorerStore } from "@/store/explorer";

interface EditorWorkspaceProps {
  roomId: string;
}

export default function EditorWorkspace({ roomId }: EditorWorkspaceProps) {
  const { files, activeFileId } = useExplorerStore();

  const { open, close } = useCommandPalette();

  const activeFile = files.find((file) => file.id === activeFileId);

  return (
    <>
      <div className="flex h-full flex-col">
        <FileTabs />

        <Breadcrumbs />

        <div className="min-h-0 flex-1">
          {activeFile ? (
            <CodeEditor key={activeFile.id} roomId={roomId} />
          ) : (
            <div className="flex h-full items-center justify-center bg-zinc-950 text-zinc-500">
              Open a file from the explorer.
            </div>
          )}
        </div>
      </div>

      <CommandPalette open={open} onClose={close} />
    </>
  );
}
