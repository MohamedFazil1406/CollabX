"use client";

import { useMemo } from "react";
import { usePointerStore } from "@/store/pointers";

const COLORS = [
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
];

function getPointerColor(id: string) {
  let hash = 0;

  for (const ch of id) {
    hash += ch.charCodeAt(0);
  }

  return COLORS[hash % COLORS.length];
}

export default function PointerLayer() {
  const { pointers } = usePointerStore();

  const pointerEntries = useMemo(() => Object.entries(pointers), [pointers]);

  return (
    <div className="pointer-events-none absolute inset-0 z-50">
      {pointerEntries.map(([userId, [x, y]]) => {
        const color = getPointerColor(userId);

        return (
          <div
            key={userId}
            className="absolute flex flex-col items-start"
            style={{
              left: x,
              top: y,
              transform: "translate(-2px, -2px)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={color}>
              <path d="M4 3L18 13L12 14L15 21L12.5 22L9.5 15.5L4 20V3Z" />
            </svg>

            <div
              className="mt-1 rounded px-2 py-0.5 text-xs text-white"
              style={{
                backgroundColor: color,
              }}
            >
              {userId}
            </div>
          </div>
        );
      })}
    </div>
  );
}
