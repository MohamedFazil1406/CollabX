"use client";

import { useEffect, useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";

import { socket } from "@/socket/client";
import { useEditorStore } from "@/store/editor";
import RemoteSelectionLayer from "@/components/editor/RemoteSelectionLayer";
import PointerLayer from "@/components/editor/PointerLayer";
import RemoteCursorLayer from "@/components/editor/RemoteCursorLayer";
import { useRemoteCursor } from "@/hooks/useRemoteCursors";
import { useRemotePointer } from "@/hooks/useRemotePointer";
import { useActiveFile } from "@/hooks/useActiveFile";
import { useGithubSave } from "@/hooks/useGithubSave";

import {
  CodeServiceMsg,
  PointerServiceMsg,
  type Cursor,
  type EditOp,
} from "@collabx/types";

interface CodeEditorProps {
  roomId: string;
}

export default function CodeEditor({ roomId }: CodeEditorProps) {
  useRemoteCursor();
  useRemotePointer();

  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const isRemoteUpdate = useRef(false);

  const { language, setLanguage } = useEditorStore();
  const { activeFile, setContent } = useActiveFile();
  const { save } = useGithubSave();

  // GitHub files are edited locally for now
  const isGithubFile = !!activeFile?.github;

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;

    if (!isGithubFile) {
      socket.emit(CodeServiceMsg.SYNC_CODE);
      socket.emit(CodeServiceMsg.SYNC_LANG);
    }

    editor.onDidChangeModelContent((event) => {
      if (isRemoteUpdate.current) {
        isRemoteUpdate.current = false;
        return;
      }

      const content = editor.getValue();

      setContent(content);

      if (isGithubFile) return;

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
      if (isGithubFile) return;

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

    const domNode = editor.getDomNode();

    if (domNode) {
      const handleMouseMove = (event: MouseEvent) => {
        if (isGithubFile) return;

        const rect = domNode.getBoundingClientRect();

        socket.emit(PointerServiceMsg.POINTER, {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      };

      domNode.addEventListener("mousemove", handleMouseMove);

      editor.onDidDispose(() => {
        domNode.removeEventListener("mousemove", handleMouseMove);
      });
    }
  };

  useEffect(() => {
    if (isGithubFile) return;

    const onSyncCode = (code: string) => {
      const editor = editorRef.current;
      if (!editor) return;

      if (editor.getValue() === code) return;

      isRemoteUpdate.current = true;
      editor.setValue(code);
    };

    socket.on(CodeServiceMsg.SYNC_CODE, onSyncCode);

    return () => {
      socket.off(CodeServiceMsg.SYNC_CODE, onSyncCode);
    };
  }, [isGithubFile]);

  useEffect(() => {
    if (isGithubFile) return;

    const onUpdateCode = (operation: EditOp) => {
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

    socket.on(CodeServiceMsg.UPDATE_CODE, onUpdateCode);

    return () => {
      socket.off(CodeServiceMsg.UPDATE_CODE, onUpdateCode);
    };
  }, [isGithubFile]);

  useEffect(() => {
    const handler = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();

        try {
          await save();
          console.log("GitHub file saved");
        } catch (err) {
          console.error(err);
        }
      }
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, [save]);

  useEffect(() => {
    if (isGithubFile) return;

    const onLanguage = (lang: string) => {
      setLanguage(lang);
    };

    socket.on(CodeServiceMsg.UPDATE_LANG, onLanguage);

    return () => {
      socket.off(CodeServiceMsg.UPDATE_LANG, onLanguage);
    };
  }, [isGithubFile, setLanguage]);

  useEffect(() => {
    const editor = editorRef.current;

    if (!editor || !activeFile) return;

    if (editor.getValue() === activeFile.content) return;

    isRemoteUpdate.current = true;
    editor.setValue(activeFile.content);
  }, [activeFile]);

  useEffect(() => {
    if (activeFile) {
      setLanguage(activeFile.language);
    }
  }, [activeFile, setLanguage]);

  return (
    <div className="relative h-full min-h-0">
      <Editor
        height="100%"
        theme="vs-dark"
        language={language}
        value={activeFile?.content ?? ""}
        onMount={handleMount}
        options={{
          automaticLayout: true,
          fontSize: 15,
          minimap: {
            enabled: false,
          },
        }}
      />

      {!isGithubFile && (
        <>
          <RemoteCursorLayer editor={editorRef.current} />
          <RemoteSelectionLayer editor={editorRef.current} />
          <PointerLayer />
        </>
      )}
    </div>
  );
}
