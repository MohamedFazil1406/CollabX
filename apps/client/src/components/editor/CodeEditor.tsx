"use client";

import { useEffect, useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";

import { socket } from "@/socket/client";
import { useEditorStore } from "@/store/editor";
import { useCursorStore } from "@/store/cursors";

import {
  CodeServiceMsg,
  RoomServiceMsg,
  type Cursor,
  type EditOp,
} from "@collabx/types";

interface CodeEditorProps {
  roomId: string;
}

export default function CodeEditor({ roomId }: CodeEditorProps) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  const decorationIds = useRef<string[]>([]);
  const isRemoteUpdate = useRef(false);

  const { language, setLanguage } = useEditorStore();

  const { cursors, updateCursor, removeCursor } = useCursorStore();

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;

    socket.emit(CodeServiceMsg.SYNC_CODE);
    socket.emit(CodeServiceMsg.SYNC_LANG);

    editor.onDidChangeModelContent((event) => {
      if (isRemoteUpdate.current) {
        isRemoteUpdate.current = false;
        return;
      }

      for (const change of event.changes) {
        const operation: EditOp = [
          change.text,
          change.range.startLineNumber,
          change.range.startColumn,
          change.range.endLineNumber,
          change.range.endColumn,
        ];

        socket.emit(CodeServiceMsg.UPDATE_CODE, operation);
      }
    });

    editor.onDidChangeCursorSelection((e) => {
      const cursor: Cursor = [
        e.selection.positionLineNumber,
        e.selection.positionColumn,
        e.selection.startLineNumber,
        e.selection.startColumn,
        e.selection.endLineNumber,
        e.selection.endColumn,
      ];

      socket.emit(CodeServiceMsg.UPDATE_CURSOR, cursor);
    });
  };

  /**
   * Initial code sync
   */
  useEffect(() => {
    const handleSyncCode = (code: string) => {
      if (!editorRef.current) return;

      isRemoteUpdate.current = true;
      editorRef.current.setValue(code);
    };

    socket.on(CodeServiceMsg.SYNC_CODE, handleSyncCode);

    return () => {
      socket.off(CodeServiceMsg.SYNC_CODE, handleSyncCode);
    };
  }, []);

  /**
   * Remote edits
   */
  useEffect(() => {
    const handleUpdateCode = (operation: EditOp) => {
      const editor = editorRef.current;
      if (!editor) return;

      const [text, sl, sc, el, ec] = operation;

      isRemoteUpdate.current = true;

      editor.executeEdits("remote", [
        {
          range: {
            startLineNumber: sl,
            startColumn: sc,
            endLineNumber: el,
            endColumn: ec,
          },
          text,
        },
      ]);
    };

    socket.on(CodeServiceMsg.UPDATE_CODE, handleUpdateCode);

    return () => {
      socket.off(CodeServiceMsg.UPDATE_CODE, handleUpdateCode);
    };
  }, []);

  /**
   * Language sync
   */
  useEffect(() => {
    const handleLanguage = (lang: string) => {
      setLanguage(lang);
    };

    socket.on(CodeServiceMsg.UPDATE_LANG, handleLanguage);

    return () => {
      socket.off(CodeServiceMsg.UPDATE_LANG, handleLanguage);
    };
  }, [setLanguage]);

  /**
   * Remote cursor updates
   */
  useEffect(() => {
    const handleCursor = (userId: string, cursor: Cursor) => {
      updateCursor(userId, cursor);
    };

    socket.on(CodeServiceMsg.UPDATE_CURSOR, handleCursor);

    return () => {
      socket.off(CodeServiceMsg.UPDATE_CURSOR, handleCursor);
    };
  }, [updateCursor]);

  /**
   * Remove cursor when user leaves
   */
  useEffect(() => {
    const handleLeave = (userId: string) => {
      removeCursor(userId);
    };

    socket.on(RoomServiceMsg.LEAVE, handleLeave);

    return () => {
      socket.off(RoomServiceMsg.LEAVE, handleLeave);
    };
  }, [removeCursor]);

  /**
   * Render remote cursors
   */
  useEffect(() => {
    const editor = editorRef.current;

    if (!editor) return;

    const decorations: Monaco.editor.IModelDeltaDecoration[] = Object.entries(
      cursors,
    ).map(([userId, cursor]) => {
      const [line, column] = cursor;

      return {
        range: {
          startLineNumber: line,
          startColumn: column,
          endLineNumber: line,
          endColumn: column,
        },
        options: {
          className: "remote-cursor",
          hoverMessage: {
            value: `User: ${userId}`,
          },
        },
      };
    });

    decorationIds.current = editor.deltaDecorations(
      decorationIds.current,
      decorations,
    );
  }, [cursors]);

  return (
    <div className="h-screen">
      <Editor
        height="100%"
        theme="vs-dark"
        language={language}
        defaultValue=""
        onMount={handleMount}
        options={{
          automaticLayout: true,
          fontSize: 15,
          minimap: {
            enabled: false,
          },
        }}
      />
    </div>
  );
}
