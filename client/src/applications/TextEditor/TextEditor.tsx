import "./texteditor.scss";
import { useState, useEffect } from "react";
import { getFileFromPath } from "../../vfs-actions/getFileFromPath";

export default function TextEditor({
  startFilePath = null,
}: {
  startFilePath?: string | null;
}) {
  //   const [currentFilePath, setCurrentFilePath] = useState<string | null>(
  //     startFilePath,
  //   );
  const [fileContent, setFileContent] = useState<string>("");

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
      console.log("loadFileContent:", { file, text });
    } catch (err) {
      console.error("Text Editor failed to load file:", err);
      setFileContent("");
    }
  }

  return (
    <div className="text-editor">
      <input
        type="text"
        value={fileContent}
        onChange={(e) => {
          setFileContent(e.target.value);
        }}
      />
    </div>
  );
}
