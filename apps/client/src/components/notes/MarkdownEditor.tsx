"use client";

import { ChangeEvent, useEffect } from "react";
import ReactMarkdown from "react-markdown";

import { socket } from "@/socket/client";
import { useNotes } from "@/hooks/useNotes";
import { useNotesStore } from "@/store/notes";

import { RoomServiceMsg } from "@collabx/types";

export default function MarkdownEditor() {
  useNotes();

  const { note, setNote } = useNotesStore();

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    setNote(value);
    socket.emit(RoomServiceMsg.UPDATE_MD, value);
  };

  useEffect(() => {
    socket.emit(RoomServiceMsg.SYNC_MD);
  }, []);

  return (
    <div className="flex h-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
      {/* Editor */}
      <div className="flex flex-1 flex-col border-r border-zinc-800">
        <div className="border-b border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300">
          Notes
        </div>

        <textarea
          value={note}
          onChange={handleChange}
          placeholder="Write collaborative markdown..."
          className="flex-1 resize-none bg-transparent p-4 font-mono text-sm text-zinc-100 outline-none"
        />
      </div>

      {/* Preview */}
      <div className="flex flex-1 flex-col">
        <div className="border-b border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300">
          Preview
        </div>

        <div className="prose prose-invert max-w-none flex-1 overflow-y-auto p-4">
          <ReactMarkdown>{note}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}