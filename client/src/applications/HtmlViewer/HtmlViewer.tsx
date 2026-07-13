import "./htmlviewer.scss";
// import { getFileFromPath } from "../../vfs-actions/getFileFromPath";
import { useState } from "react";
import { useFileSystemChanged } from "../../hooks";

export default function HtmlViewer({
  startFilePath = null,
}: {
  startFilePath?: string | null;
}) {
  const [numberOfChanges, setNumberOfChanges] = useState<number>(0);
  //   const [htmlSrc, setHtmlSrc] = useState<string | null>(null);
  //   const [fileName, setFileName] = useState<string | null>(null);

  //   useEffect(() => {
  //     if (!startFilePath) return;
  //     loadHtml(startFilePath);
  //   }, [startFilePath]);

  //   async function loadHtml(filePath: string) {
  //     if (!filePath) return;
  //     try {
  //       const file = await getFileFromPath(filePath);
  //       const html = await file.text();

  //       const blob = new Blob([html], { type: "text/html" });
  //       const url = URL.createObjectURL(blob);

  //       setHtmlSrc(url);
  //       setFileName(file.name);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }

  useFileSystemChanged(() => {
    setNumberOfChanges((n) => n + 1);
  });

  return (
    <iframe
      key={numberOfChanges}
      src={`/opfs${startFilePath}`}
      width="100%"
      height="100%"
      style={{ border: "none" }}
      onClick={() => {console.log("iframe clicked") }}
    />
  );
}
