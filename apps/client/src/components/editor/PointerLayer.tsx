"use client";

import { usePointerStore } from "@/store/pointers";

export default function PointerLayer() {
  const { pointers } = usePointerStore();

  return (
    <div className="pointer-events-none absolute inset-0 z-50">
      {Object.entries(pointers).map(([userId, [x, y]]) => (
        <div
          key={userId}
          className="absolute transition-transform duration-75"
          style={{
            transform: `translate(${x}px, ${y}px)`,
          }}
        >
          {/* Cursor */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="#3b82f6"
            stroke="white"
            strokeWidth="1.5"
          >
            <path d="M4 3L19 15L13 16L15 22L12.5 23L10.5 17L5 20L4 3Z" />
          </svg>

          {/* User Label */}
          <div className="mt-1 rounded bg-blue-600 px-2 py-0.5 text-xs font-medium text-white shadow">
            {userId}
          </div>
        </div>
      ))}
    </div>
  );
}
