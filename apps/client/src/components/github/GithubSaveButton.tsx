"use client";

import { Save } from "lucide-react";

import { useGithubSave } from "@/hooks/useGithubSave";
import { useActiveFile } from "@/hooks/useActiveFile";

export default function GithubSaveButton() {
  const { activeFile } = useActiveFile();
  const { save, isSaving } = useGithubSave();

  if (!activeFile?.github) {
    return null;
  }

  const handleSave = async () => {
    try {
      await save();
      alert("File saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save file.");
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={isSaving}
      className="flex items-center gap-2 rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Save size={16} />

      {isSaving ? "Saving..." : "Save"}
    </button>
  );
}
