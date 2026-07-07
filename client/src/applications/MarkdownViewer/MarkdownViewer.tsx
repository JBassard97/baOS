import "./markdownviewer.scss";
import { useState, useEffect, useMemo } from "react";
import { getFileFromPath } from "../../vfs-actions/getFileFromPath";
import ReactMarkdown from "react-markdown";
import * as themes from "react-syntax-highlighter/dist/esm/styles/prism";

const themeNames: string[] = [];
const themeMap: Record<string, any> = {};

for (const [key, value] of Object.entries(themes)) {
  themeNames.push(key);
  themeMap[key] = value;
}

// Prism theme objects are keyed by token class name (e.g. 'keyword', 'string',
// 'comment'). Not every theme defines every token, so each semantic role
// tries a list of fallback token names until it finds a usable color.
function pickColor(
  theme: Record<string, any>,
  tokenNames: string[],
  fallback: string,
): string {
  for (const name of tokenNames) {
    const color = theme?.[name]?.color;
    if (color) return color;
  }
  return fallback;
}

function pickBackground(
  theme: Record<string, any>,
  selectorNames: string[],
  fallback: string,
): string {
  for (const name of selectorNames) {
    const bg = theme?.[name]?.background;
    if (bg) return bg;
  }
  return fallback;
}

function getThemeVars(theme: Record<string, any>): React.CSSProperties {
  return {
    "--md-bg": pickBackground(
      theme,
      ['pre[class*="language-"]', 'code[class*="language-"]'],
      "#1e1e1e",
    ),
    "--md-heading": pickColor(
      theme,
      ["title", "keyword", "important"],
      "#c792ea",
    ),
    "--md-bold": pickColor(theme, ["bold", "important", "keyword"], "#f78c6c"),
    "--md-italic": pickColor(theme, ["italic", "comment", "cdata"], "#89ddff"),
    "--md-list-marker": pickColor(
      theme,
      ["punctuation", "operator", "comment"],
      "#89ddff",
    ),
    "--md-link": pickColor(theme, ["function", "url", "attr-value"], "#82aaff"),
    "--md-code": pickColor(theme, ["string", "attr-value"], "#c3e88d"),
    "--md-blockquote": pickColor(theme, ["comment", "cdata"], "#697098"),
    "--md-hr": pickColor(theme, ["punctuation", "operator"], "#697098"),
    "--md-text": theme?.["comment"]?.color || "inherit",
  } as React.CSSProperties;
}

export default function MarkdownViewer({
  startFilePath = null,
}: {
  startFilePath?: string | null;
}) {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<string>(
    localStorage.getItem("md-viewer-theme") || "dracula",
  );

  useEffect(() => {
    if (!startFilePath) return;
    loadFileContent(startFilePath);
  }, [startFilePath]);

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
      console.error(err);
    }
  }

  const themeStyle = useMemo(
    () => getThemeVars(themeMap[currentTheme]),
    [currentTheme],
  );

  return (
    <div className="markdown-viewer">
      <div className="options-bar">
        <span>Theme:</span>
        <select
          value={currentTheme}
          onChange={(e) => {
            setCurrentTheme(e.target.value);
            localStorage.setItem("md-viewer-theme", e.target.value);
          }}
        >
          {themeNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="file-name-display">
        {fileName
          ? fileName
          : startFilePath !== null && fileName === null
            ? "Loading..."
            : ""}
      </div>

      <div className="markdown-content" style={themeStyle}>
        <ReactMarkdown>{fileContent}</ReactMarkdown>
      </div>

      <div className="file-path-display">
        {startFilePath === null ? "No file provided..." : `"${startFilePath}"`}
      </div>
    </div>
  );
}
