import "./fileentryicon.scss";
import type { FileEntry } from "../../interfaces/FileEntry";
import { getFileIcon } from "../../helpers";
import { useWindowStore, useUIStore } from "../../store";
import FileManager from "../../applications/FileManager/FileManager";
import fileManagerIcon from "../../assets/icons/file-manager.svg";
import { isImageFile, isVideoFile } from "../../helpers";

interface FileEntryIconProps {
  entry: FileEntry;
  isSelected: boolean;
  showActions: boolean;
  onSelect: () => void;
  onContextMenuOpen: (x: number, y: number) => void;
  onDelete: () => void;
  parentPath: string;
}

export default function FileEntryIcon({
  entry,
  isSelected,
  showActions,
  onSelect,
  onContextMenuOpen,
  onDelete,
  parentPath,
}: FileEntryIconProps) {
  const isDir = entry.type === "dir";
  const setCurrentBackground = useUIStore((s) => s.setCurrentBackground);
  const activeWindows = useWindowStore((s) => s.activeWindows);
  const addActiveWindow = useWindowStore((s) => s.addActiveWindow);

  return (
    <div style={{ position: "relative" }}>
      <div
        className={isSelected ? "file-entry selected" : "file-entry"}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onDoubleClick={() => {
          if (isDir) {
            addActiveWindow({
              isFullscreen: false,
              isMinimized: false,
              id: String(activeWindows.length),
              isFocused: true,
              children: (
                <FileManager
                  startPath={`${parentPath}${isDir ? `${entry.name}/` : entry.name}`}
                />
              ),
              title: "File Manager",
              icon: fileManagerIcon,
            });
          } else {
            alert(`Attempted to open: \n${parentPath}${entry.name}`);
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onContextMenuOpen(e.clientX, e.clientY);
        }}
      >
        {/* ICON */}
        {entry.previewType === "video" ? (
          <video
            className="file-entry-icon"
            src={entry.previewUrl}
            loop
            muted
            playsInline
            autoPlay
          />
        ) : (
          <img
            className="file-entry-icon"
            src={
              entry.previewUrl ?? getFileIcon(entry.name, entry.type === "dir")
            }
          />
        )}

        <p className="file-entry-name">
          {isDir ? `${entry.name}/` : entry.name}
        </p>
      </div>

      <div className="actions-section">
        {showActions && (
          <div className="file-entry-actions">
            <div
              className="action"
              onClick={() => {
                if (isDir) {
                  addActiveWindow({
                    isFullscreen: false,
                    isMinimized: false,
                    id: String(activeWindows.length),
                    isFocused: true,
                    children: (
                      <FileManager
                        startPath={`${parentPath}${isDir ? `${entry.name}/` : entry.name}`}
                      />
                    ),
                    title: "File Manager",
                    icon: fileManagerIcon,
                  });
                } else {
                  alert(`Attempted to open: \n${parentPath}${entry.name}`);
                }
              }}
            >
              Open
            </div>
            <div className="action">Rename</div>
            <div
              className="action"
              onClick={() =>
                alert(
                  `Path Copied: \n${parentPath}${isDir ? `${entry.name}/` : entry.name}`,
                )
              }
            >
              Copy Path
            </div>
            {/* ONLY FOR IMAGE AND VID FILES */}
            {(isImageFile(entry.name) || isVideoFile(entry.name)) && (
              <div
                className="action"
                onClick={() =>
                  setCurrentBackground(`${parentPath}${entry.name}`)
                }
              >
                Set as Background
              </div>
            )}
            {/* ALWAYS SHOWS */}
            <div className="action" onClick={onDelete}>
              Delete
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
