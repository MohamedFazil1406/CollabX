"use client";

import { useEffect, useRef } from "react";
import type * as Monaco from "monaco-editor";

import { useCursorStore } from "@/store/cursors";

interface Props {
  editor: Monaco.editor.IStandaloneCodeEditor | null;
}

export default function RemoteSelectionLayer({ editor }: Props) {
  const { cursors } = useCursorStore();

  const decorationIds = useRef<string[]>([]);

  useEffect(() => {
    if (!editor) return;

    const decorations: Monaco.editor.IModelDeltaDecoration[] = [];

    Object.entries(cursors).forEach(([userId, cursor], index) => {
      if (cursor.length < 6) return;

      const [, , startLine, startColumn, endLine, endColumn] = cursor;

      if (
        startLine === undefined ||
        startColumn === undefined ||
        endLine === undefined ||
        endColumn === undefined
      ) {
        return;
      }

      decorations.push({
        range: {
          startLineNumber: startLine,
          startColumn,
          endLineNumber: endLine,
          endColumn,
        },
        options: {
          className: `remote-selection-${index % 6}`,
          isWholeLine: false,
          hoverMessage: {
            value: `Selection by ${userId}`,
          },
        },
      });
    });

    decorationIds.current = editor.deltaDecorations(
      decorationIds.current,
      decorations,
    );

    return () => {
      decorationIds.current = editor.deltaDecorations(
        decorationIds.current,
        [],
      );
    };
  }, [editor, cursors]);

  return null;
}
