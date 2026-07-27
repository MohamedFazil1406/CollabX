const colors = [
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
];

export function getCursorColor(id: string) {
  let hash = 0;

  for (const ch of id) {
    hash += ch.charCodeAt(0);
  }

  return colors[hash % colors.length];
}
