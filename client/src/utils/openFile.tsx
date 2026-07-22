import { useWindowStore } from "../store";
import { doesDirExist } from "../vfs-actions/doesDirExist";
import { doesFileExist } from "../vfs-actions/doesFileExist";
import fileManagerIcon from "../assets/icons/file-manager.svg";
import textEditorIcon from "../assets/icons/text-editor.svg";
import imageViewerIcon from "../assets/icons/image-viewer.svg";
import videoPlayerIcon from "../assets/icons/video-player.svg";
import pdfViewerIcon from "../assets/icons/pdf.svg";
import audioPlayerIcon from "../assets/icons/audio-player-icon.svg";
import { isImageFile, isVideoFile, isAudioFile } from "../helpers";

export async function openFile(filePath: string) {
  if (!filePath) return;

  const isDir = await doesDirExist(filePath);
  const isFile = await doesFileExist(filePath);

  if (!isDir && !isFile) {
    throw new Error(`Entry requested at "${filePath}" does not exist`);
  }

  if (isDir) {
    const { default: FileManager } =
      await import("../applications/FileManager/FileManager");

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
    const { default: ImageViewer } =
      await import("../applications/ImageViewer/ImageViewer");

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
    const { default: VideoPlayer } =
      await import("../applications/VideoPlayer/VideoPlayer");

    useWindowStore.getState().addActiveWindow({
      isFullscreen: false,
      isMinimized: false,
      id: crypto.randomUUID(),
      isFocused: true,
      title: "Video Player",
      icon: videoPlayerIcon,
      children: <VideoPlayer startFilePath={filePath} />,
    });
  } else if (isAudioFile(filePath)) {
    const { default: AudioPlayer } =
      await import("../applications/AudioPlayer/AudioPlayer");

    useWindowStore.getState().addActiveWindow({
      title: "Audio Player",
      icon: audioPlayerIcon,
      isFocused: true,
      isFullscreen: false,
      isMinimized: false,
      id: crypto.randomUUID(),
      children: <AudioPlayer startFilePath={filePath} />,
    });
  } else if (filePath.endsWith(".pdf")) {
    const { default: PdfViewer } =
      await import("../applications/PdfViewer/PdfViewer");

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
    const { default: TextEditor } =
      await import("../applications/TextEditor/TextEditor");

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
