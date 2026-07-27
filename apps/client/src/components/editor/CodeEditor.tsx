"use client";

import { useEffect, useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import { useCursorStore } from "@/store/cursors";
import { socket } from "@/socket/client";
import { useEditorStore } from "@/store/editor";
import { CodeServiceMsg, type EditOp, type Cursor } from "@collabx/types";

interface CodeEditorProps {
  roomId: string;
}

export default function CodeEditor({ roomId }: CodeEditorProps) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  const isRemoteUpdate = useRef(false);

  const { language, setLanguage } = useEditorStore();
  const { updateCursor } = useCursorStore();

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;

    // Request current room state
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
      const selection = e.selection;

      const cursor: Cursor = [
        selection.positionLineNumber,
        selection.positionColumn,
        selection.startLineNumber,
        selection.startColumn,
        selection.endLineNumber,
        selection.endColumn,
      ];

      socket.emit(CodeServiceMsg.UPDATE_CURSOR, cursor);
    });

    editor.onDidChangeCursorPosition((e) => {
      socket.emit(CodeServiceMsg.UPDATE_CURSOR, {
        lineNumber: e.position.lineNumber,
        column: e.position.column,
      });
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
   * Remote code updates
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
   * Language updates
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

  useEffect(() => {
    const handleCursor = (userId: string, cursor: Cursor) => {
      updateCursor(userId, cursor);
    };

    socket.on(CodeServiceMsg.UPDATE_CURSOR, handleCursor);

    return () => {
      socket.off(CodeServiceMsg.UPDATE_CURSOR, handleCursor);
    };
  }, [updateCursor]);

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
