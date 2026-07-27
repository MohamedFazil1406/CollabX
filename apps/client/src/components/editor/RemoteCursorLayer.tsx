"use client";

import { useEffect, useRef } from "react";
import * as Monaco from "monaco-editor";

import { useCursorStore } from "@/store/cursors";

interface RemoteCursorLayerProps {
  editor: Monaco.editor.IStandaloneCodeEditor | null;
}

export default function RemoteCursorLayer({ editor }: RemoteCursorLayerProps) {
  const { cursors } = useCursorStore();

  const decorationIds = useRef<string[]>([]);

  useEffect(() => {
    if (!editor) return;

    const decorations: Monaco.editor.IModelDeltaDecoration[] = Object.entries(
      cursors,
    ).map(([userId, cursor], index) => {
      const [line, column] = cursor;

      const className = `remote-cursor-${index % 6}`;

      return {
        range: {
          startLineNumber: line,
          startColumn: column,
          endLineNumber: line,
          endColumn: column,
        },
        options: {
          className,
          stickiness:
            Monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          hoverMessage: {
            value: `**${userId}**`,
          },
          afterContentClassName: `${className}-label`,
        },
      };
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
