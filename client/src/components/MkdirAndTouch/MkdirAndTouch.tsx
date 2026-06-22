import "./mkdirandtouch.scss";
import { useUIStore } from "../../store/useUIStore";
import { useDesktopStore } from "../../store/useDesktopStore";
import { FileIcon, FolderIcon, PlusIcon } from "../../icon-components";

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
        className="mkdir-button"
        onClick={() => {
          startMakingDesktopEntry("dir");
        }}
      >
        <PlusIcon />
        <FolderIcon />
      </div>
    </div>
  );
}
