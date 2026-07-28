"use client";

import CodeEditor from "@/components/editor/CodeEditor";
import RunButton from "@/components/editor/RunButton";
import Breadcrumbs from "@/components/explorer/Breadcrumbs";
import CommandPalette from "@/components/explorer/CommandPalette";
import FileTabs from "@/components/explorer/FileTabs";
import GithubSaveButton from "@/components/github/GithubSaveButton";

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
      <div className="flex h-full flex-col bg-zinc-950">
        {/* File Tabs */}
        <FileTabs />

        {/* Toolbar */}
        <div className="flex h-11 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4">
          <Breadcrumbs />

          <div className="flex items-center gap-2">
            <RunButton />
            <GithubSaveButton />
          </div>
        </div>

        {/* Editor */}
        <div className="min-h-0 flex-1 overflow-hidden">
          {activeFile ? (
            <CodeEditor key={activeFile.id} roomId={roomId} />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">
              Open a file from the explorer.
            </div>
          )}
        </div>
      </div>

      <CommandPalette open={open} onClose={close} />
    </>
  );
}
