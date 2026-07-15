import { useWindowStore } from "../store";
import { doesDirExist } from "../vfs-actions/doesDirExist";
import { doesFileExist } from "../vfs-actions/doesFileExist";
import fileManagerIcon from "../assets/icons/file-manager.svg";
import FileManager from "../applications/FileManager/FileManager";
import textEditorIcon from "../assets/icons/text-editor.svg";
import TextEditor from "../applications/TextEditor/TextEditor";
import imageViewerIcon from "../assets/icons/image-viewer.svg";
import ImageViewer from "../applications/ImageViewer/ImageViewer";
import videoPlayerIcon from "../assets/icons/video-player.svg";
import VideoPlayer from "../applications/VideoPlayer/VideoPlayer";
import pdfViewerIcon from "../assets/icons/pdf.svg";
import PdfViewer from "../applications/PdfViewer/PdfViewer";
// import HtmlViewer from "../applications/HtmlViewer/HtmlViewer";
// import htmlViewerIcon from "../assets/icons/html.svg";
import { isImageFile, isVideoFile } from "../helpers";

export async function openFile(filePath: string) {
  if (!filePath) return;

  const isDir = await doesDirExist(filePath);
  const isFile = await doesFileExist(filePath);

  if (!isDir && !isFile) {
    throw new Error(`Entry requested at "${filePath}" does not exist`);
  }

  if (isDir) {
    useWindowStore.getState().addActiveWindow({
      isFullscreen: false,
      isMinimized: false,
      id: crypto.randomUUID(),
      isFocused: true,
      children: (
        <FileManager
          startPath={filePath.endsWith("/") ? filePath : `${filePath}/`}
        />
      ),
      title: "File Manager",
      icon: fileManagerIcon,
    });
  } else if (isImageFile(filePath)) {
    useWindowStore.getState().addActiveWindow({
      isFullscreen: false,
      isMinimized: false,
      id: crypto.randomUUID(),
      isFocused: true,
      title: "Image Viewer",
      icon: imageViewerIcon,
      children: <ImageViewer startFilePath={filePath} />,
    });
  } else if (isVideoFile(filePath)) {
    useWindowStore.getState().addActiveWindow({
      isFullscreen: false,
      isMinimized: false,
      id: crypto.randomUUID(),
      isFocused: true,
      title: "Video Player",
      icon: videoPlayerIcon,
      children: <VideoPlayer startFilePath={filePath} />,
    });
  } else if (filePath.endsWith(".pdf")) {
    useWindowStore.getState().addActiveWindow({
      title: "PDF Viewer",
      icon: pdfViewerIcon,
      isFocused: true,
      isFullscreen: false,
      isMinimized: false,
      id: crypto.randomUUID(),
      children: <PdfViewer startFilePath={filePath} />,
    });
  } else {
    useWindowStore.getState().addActiveWindow({
      title: "Text Editor",
      icon: textEditorIcon,
      isFocused: true,
      children: <TextEditor startFilePath={filePath} />,
      isFullscreen: false,
      isMinimized: false,
      id: crypto.randomUUID(),
    });
  }
}
