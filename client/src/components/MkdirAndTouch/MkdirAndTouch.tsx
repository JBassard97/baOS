import "./mkdirandtouch.scss";
import { useUIStore } from "../../store/useUIStore";
import { useDesktopStore } from "../../store/useDesktopStore";
import {
  FileIcon,
  FolderIcon,
  PlusIcon,
  DownloadIcon,
} from "../../icon-components";
import {
  uploadFilesToVFS,
  uploadFolderToVFS,
} from "../../vfs-actions/uploadToVfs";

export default function MkdirAndTouch() {
  const taskbarPosition = useUIStore((s) => s.taskbarPosition);
  const setCreatingDesktopEntry = useDesktopStore(
    (s) => s.setCreatingDesktopEntry,
  );
  const setSelectedEntry = useDesktopStore((s) => s.setSelectedEntry);
  const setContextMenuEntry = useDesktopStore((s) => s.setContextMenuEntry);
  const setDesktopContextMenu = useDesktopStore((s) => s.setDesktopContextMenu);

  function startMakingDesktopEntry(creatingType: "file" | "dir") {
    setSelectedEntry(null);
    setContextMenuEntry(null);
    setDesktopContextMenu({ visible: false, x: 0, y: 0, entry: null });
    setCreatingDesktopEntry({
      isCreatingDesktopEntry: true,
      creatingType: creatingType,
    });
  }

  function startUploadingDesktopEntry(uploadingType: "file" | "dir") {
    setSelectedEntry(null);
    setContextMenuEntry(null);
    setDesktopContextMenu({ visible: false, x: 0, y: 0, entry: null });
    setCreatingDesktopEntry({
      isCreatingDesktopEntry: false,
      creatingType: null,
    });
    if (uploadingType === "file") {
      uploadFilesToVFS("/Desktop/");
    } else if (uploadingType === "dir") {
      uploadFolderToVFS("/Desktop/");
    }
  }

  return (
    <div className={`mkdir-and-touch ${taskbarPosition}`}>
      <div
        className="touch-button"
        onClick={() => {
          startMakingDesktopEntry("file");
        }}
      >
        <PlusIcon />
        <FileIcon />
      </div>
      <div
        className="download-files-button"
        onClick={() => {
          startUploadingDesktopEntry("file");
        }}
      >
        <DownloadIcon />
        <FileIcon />
      </div>

      <div
        className="mkdir-button"
        onClick={() => {
          startMakingDesktopEntry("dir");
        }}
      >
        <PlusIcon />
        <FolderIcon />
      </div>
      <div
        className="download-folder-button"
        onClick={() => {
          startUploadingDesktopEntry("dir");
        }}
      >
        <DownloadIcon />
        <FolderIcon />
      </div>
    </div>
  );
}
