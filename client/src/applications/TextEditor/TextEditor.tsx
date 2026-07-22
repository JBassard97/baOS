import "./texteditor.scss";
import { useState, useEffect, useRef } from "react";
import { getFileFromPath } from "../../vfs-actions/getFileFromPath";
import { touch } from "../../vfs-actions/touch";
import CodeMirror from "@uiw/react-codemirror";
import {
  abcdef,
  abyss,
  androidstudio,
  andromeda,
  atomone,
  aura,
  basicDark,
  basicLight,
  bbedit,
  bespin,
  consoleDark,
  consoleLight,
  copilot,
  darcula,
  dracula,
  duotoneDark,
  duotoneLight,
  eclipse,
  githubDark,
  githubLight,
  gruvboxDark,
  gruvboxLight,
  kimbie,
  materialDark,
  materialLight,
  monokai,
  monokaiDimmed,
  noctisLilac,
  nord,
  okaidia,
  quietlight,
  red,
  solarizedDark,
  solarizedLight,
  sublime,
  tokyoNight,
  tokyoNightStorm,
  tokyoNightDay,
  tomorrowNightBlue,
  vscodeDark,
  vscodeLight,
  whiteDark,
  whiteLight,
  xcodeDark,
  xcodeLight,
} from "@uiw/codemirror-themes-all";
import { getLanguageExtension } from "./getLangExtension";

const editorThemes = {
  Abcdef: abcdef,
  Abyss: abyss,
  "Android Studio": androidstudio,
  Andromeda: andromeda,
  "Atom One": atomone,
  Aura: aura,
  "Basic Dark": basicDark,
  "Basic Light": basicLight,
  BBEdit: bbedit,
  Bespin: bespin,
  "Console Dark": consoleDark,
  "Console Light": consoleLight,
  Copilot: copilot,
  Darcula: darcula,
  Dracula: dracula,
  "Duotone Dark": duotoneDark,
  "Duotone Light": duotoneLight,
  Eclipse: eclipse,
  "GitHub Dark": githubDark,
  "GitHub Light": githubLight,
  "Gruvbox Dark": gruvboxDark,
  "Gruvbox Light": gruvboxLight,
  Kimbie: kimbie,
  "Material Dark": materialDark,
  "Material Light": materialLight,
  Monokai: monokai,
  "Monokai Dimmed": monokaiDimmed,
  "Noctis Lilac": noctisLilac,
  Nord: nord,
  Okaidia: okaidia,
  Quietlight: quietlight,
  Red: red,
  "Solarized Dark": solarizedDark,
  "Solarized Light": solarizedLight,
  Sublime: sublime,
  "Tokyo Night": tokyoNight,
  "Tokyo Night Storm": tokyoNightStorm,
  "Tokyo Night Day": tokyoNightDay,
  "Tomorrow Night Blue": tomorrowNightBlue,
  "VS Code Dark": vscodeDark,
  "VS Code Light": vscodeLight,
  "White Dark": whiteDark,
  "White Light": whiteLight,
  "Xcode Dark": xcodeDark,
  "Xcode Light": xcodeLight,
};

type ThemeName = keyof typeof editorThemes;

export default function TextEditor({
  startFilePath = null,
}: {
  startFilePath?: string | null;
}) {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>(
    (localStorage.getItem("text-editor-code-theme") as ThemeName) ??
      "VS Code Dark",
  );
  const [editorBackground, setEditorBackground] =
    useState<string>("transparent");
  const [languageExtensions, setLanguageExtensions] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadLanguageExtension() {
      const extensions = await getLanguageExtension(fileName);

      if (!cancelled) {
        setLanguageExtensions(extensions);
      }
    }

    loadLanguageExtension();

    return () => {
      cancelled = true;
    };
  }, [fileName]);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const hasLanguageSupport =
    Array.isArray(languageExtensions) && languageExtensions.length > 0;

  const currentTheme = editorThemes[selectedTheme];

  useEffect(() => {
    if (!startFilePath) return;
    loadFileContent(startFilePath);
  }, [startFilePath]);

  useEffect(() => {
    if (!startFilePath) return;
    if (fileContent === null) return;
    touch(startFilePath, fileContent);
  }, [fileContent]);

  useEffect(() => {
    requestAnimationFrame(() => {
      const editor = editorContainerRef.current?.querySelector(".cm-editor");

      if (editor) {
        setEditorBackground(getComputedStyle(editor).backgroundColor);
      }
    });
  }, [selectedTheme, hasLanguageSupport]);

  async function loadFileContent(filePath: string) {
    if (!filePath) return;

    try {
      const file = await getFileFromPath(filePath);
      const text = await file.text();

      setFileContent(text);
      setFileName(file.name);
    } catch (err) {
      setFileContent(null);
      setFileName(null);
    }
  }

  return (
    <div className="text-editor">
      <div className="options-bar">
        <div>
          {hasLanguageSupport && (
            <select
              value={selectedTheme}
              onChange={(e) => {
                const theme = e.target.value as ThemeName;
                setSelectedTheme(theme);
                localStorage.setItem("text-editor-code-theme", theme);
              }}
            >
              {Object.keys(editorThemes).map((themeName) => (
                <option key={themeName} value={themeName}>
                  {themeName}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="file-name-display">
        {fileName
          ? fileName
          : startFilePath !== null && fileName === null
            ? "Loading..."
            : ""}
      </div>

      {hasLanguageSupport && (
        <div
          ref={editorContainerRef}
          className="editor-area"
          style={{ backgroundColor: editorBackground }}
        >
          <CodeMirror
            width="100%"
            height="100%"
            minHeight="100%"
            theme={currentTheme}
            extensions={languageExtensions}
            value={fileContent ?? ""}
            onChange={(value) => setFileContent(value)}
          />
        </div>
      )}

      {!hasLanguageSupport && (
        <textarea
          value={fileContent ?? ""}
          onChange={(e) => setFileContent(e.target.value)}
          spellCheck={false}
        />
      )}

      <div className="file-path-display">
        {startFilePath === null ? "No file provided..." : `"${startFilePath}"`}
      </div>
    </div>
  );
}
