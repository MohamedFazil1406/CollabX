"use client";

import { CodeServiceMsg } from "@collabx/types";
import { socket } from "@/socket/client";
import { useEditorStore } from "@/store/editor";

const languages = [
  "html",
  "css",
  "javascript",
  "typescript",
  "java",
  "python",
  "go",
];

export default function LanguageSelector() {
  const { language, setLanguage } = useEditorStore();

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;

    setLanguage(lang);

    socket.emit(CodeServiceMsg.UPDATE_LANG, lang);
  };

  return (
    <select
      value={language}
      onChange={changeLanguage}
      className="border rounded p-2"
    >
      {languages.map((lang) => (
        <option key={lang}>{lang}</option>
      ))}
    </select>
  );
}
