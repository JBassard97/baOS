import "./texteditor.scss";
import { useState, useEffect } from "react";
import { getFileFromPath } from "../../vfs-actions/getFileFromPath";
import { touch } from "../../vfs-actions/touch";

export default function TextEditor({
  startFilePath = null,
}: {
  startFilePath?: string | null;
}) {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (!startFilePath) return;
    loadFileContent(startFilePath);
  }, [startFilePath]);

  useEffect(() => {
    if (!startFilePath) return;
    if (fileContent === null) return;
    touch(startFilePath, fileContent);
  }, [fileContent]);

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
      <div className="file-name-display">
        {fileName
          ? fileName
          : startFilePath !== null && fileName === null
            ? "Loading..."
            : ""}
      </div>
      <textarea
        value={fileContent ?? ""}
        onChange={(e) => {
          setFileContent(e.target.value);
        }}
        spellCheck={false}
      />
      <div className="file-path-display">
        {startFilePath === null ? "No file provided..." : `"${startFilePath}"`}
      </div>
    </div>
  );
}
