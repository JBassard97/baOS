import "./pdfviewer.scss";
import { useState, useEffect } from "react";
import { getFileFromPath } from "../../vfs-actions/getFileFromPath";

export default function PdfViewer({
  startFilePath = null,
}: {
  startFilePath?: string | null;
}) {
  const [pdfSrc, setPdfSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (!startFilePath) return;
    loadPdf(startFilePath);
  }, [startFilePath]);

  async function loadPdf(filePath: string) {
    try {
      const file = await getFileFromPath(filePath);

      const pdfFile = new File([file], file.name, { type: "application/pdf" });

      if (pdfSrc) {
        URL.revokeObjectURL(pdfSrc);
      }

      const url = URL.createObjectURL(pdfFile);

      setPdfSrc(url);
      setFileName(file.name);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="pdf-viewer">
      <div className="file-name-display">
        {fileName
          ? fileName
          : startFilePath !== null && fileName === null
            ? "Loading..."
            : ""}
      </div>
      <embed
        src={pdfSrc ?? ""}
        type="application/pdf"
        width="100%"
        height="100%"
      />
      <div className="file-path-display">
        {startFilePath === null ? "No file provided..." : `"${startFilePath}"`}
      </div>
    </div>
  );
}
