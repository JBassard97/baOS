import "./fileentryicon.scss";
import type { FileEntry } from "../../interfaces/FileEntry";
import { getFileIcon } from "../../helpers";
import { useUIStore, useWindowStore } from "../../store";
import { isImageFile, isVideoFile } from "../../helpers";
import { openFile } from "../../utils/openFile";
import MarkdownViewer from "../../applications/MarkdownViewer/MarkdownViewer";
import markdownViewerIcon from "../../assets/icons/markdown.svg";

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
  const addActiveWindow = useWindowStore((s) => s.addActiveWindow);
  const activeWindows = useWindowStore((s) => s.activeWindows);

  // document.addEventListener("keydown", (e) => {
  //   e.preventDefault();
  //   if (e.key.toLowerCase() !== "delete") return;
  //   if (isSelected) onDelete();
  // });

  return (
    <div style={{ position: "relative" }}>
      <div
        draggable
        className={isSelected ? "file-entry selected" : "file-entry"}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onDoubleClick={() => {
          openFile(`${parentPath}${entry.name}`);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onContextMenuOpen(e.clientX, e.clientY);
        }}
        onDragStart={(e) =>
          e.dataTransfer.setData(
            "application/x-baos-entry",
            JSON.stringify({
              path: `${parentPath}${entry.name}`,
              name: entry.name,
            }),
          )
        }
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
                openFile(`${parentPath}${entry.name}`);
              }}
            >
              Open
            </div>
            {entry.name.endsWith(".md") && (
              <div
                className="action"
                onClick={() =>
                  addActiveWindow({
                    id: String(activeWindows.length),
                    title: "Markdown Viewer",
                    icon: markdownViewerIcon,
                    children: (
                      <MarkdownViewer
                        startFilePath={`${parentPath}${entry.name}`}
                      />
                    ),
                    isMinimized: false,
                    isFullscreen: false,
                    isFocused: true,
                  })
                }
              >
                Open in Markdown Viewer
              </div>
            )}
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
            <div
              className="action"
              onClick={onDelete}
              style={{ color: "pink" }}
            >
              Delete
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
