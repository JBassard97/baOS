import "./fileentryicon.scss";
import type { FileEntry } from "../../interfaces/FileEntry";
import { getFileIcon } from "../../helpers";
import { useUIStore, useWindowStore, useDesktopStore } from "../../store";
import { isImageFile, isVideoFile } from "../../helpers";
import { openFile } from "../../utils/openFile";
import MarkdownViewer from "../../applications/MarkdownViewer/MarkdownViewer";
import markdownViewerIcon from "../../assets/icons/markdown.svg";
import { useState } from "react";
import HtmlViewer from "../../applications/HtmlViewer/HtmlViewer";
import htmlViewerIcon from "../../assets/icons/html.svg";

interface FileEntryIconProps {
  entry: FileEntry;
  isSelected: boolean;
  showActions: boolean;
  onSelect: () => void;
  onContextMenuOpen: (x: number, y: number) => void;
  onDelete: () => void;
  parentPath: string;
}

interface ActionProps {
  label: string;
  onClick?: () => void;
  children?: React.ReactNode;
  danger?: boolean;
}

function Action({ label, onClick, children, danger = false }: ActionProps) {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const setSelectedEntry = useDesktopStore((state) => state.setSelectedEntry);
  const setContextMenuEntry = useDesktopStore(
    (state) => state.setContextMenuEntry,
  );

  const hasChildren = !!children;

  return (
    <div
      className="action-wrapper"
      onClick={(e) => {
        if (hasChildren) {
          e.stopPropagation();
          setSubmenuOpen(true);
        }
      }}
      // onMouseLeave={() => setSubmenuOpen(false)}
    >
      <div
        className="action"
        style={danger ? { color: "pink" } : undefined}
        onClick={() => {
          if (hasChildren) {
            setSubmenuOpen((prev) => !prev);
          } else {
            onClick?.();
            setContextMenuEntry(null);
            setSelectedEntry(null);
          }
        }}
      >
        <span>{label}</span>
        {hasChildren && <span className="submenu-arrow">▶</span>}
      </div>
      {hasChildren && (
        <div
          className="submenu"
          style={{
            visibility: submenuOpen ? "visible" : "hidden",
            opacity: submenuOpen ? 1 : 0,
            pointerEvents: submenuOpen ? "auto" : "none",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
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

  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "delete" && isSelected) onDelete();
  });

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
            <Action
              label="Open"
              onClick={() => {
                openFile(`${parentPath}${entry.name}`);
              }}
            />

            {entry.name.endsWith(".html") && (
              <Action label="Open With">
                <Action
                  label="HTML Viewer"
                  onClick={() =>
                    addActiveWindow({
                      id: crypto.randomUUID(),
                      title: "HTML Viewer",
                      icon: htmlViewerIcon,
                      children: (
                        <HtmlViewer
                          startFilePath={`${parentPath}${entry.name}`}
                        />
                      ),
                      isMinimized: false,
                      isFullscreen: false,
                      isFocused: true,
                    })
                  }
                />
                <Action
                  label="Text Editor"
                  onClick={() => {
                    openFile(`${parentPath}${entry.name}`);
                  }}
                />
              </Action>
            )}

            {entry.name.endsWith(".md") && (
              <Action label="Open With">
                <Action
                  label="Markdown Viewer"
                  onClick={() =>
                    addActiveWindow({
                      id: crypto.randomUUID(),
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
                />
                <Action
                  label="Text Editor"
                  onClick={() => {
                    openFile(`${parentPath}${entry.name}`);
                  }}
                />
              </Action>
            )}

            <Action label="Rename" />

            <Action
              label="Copy Path"
              onClick={() =>
                alert(
                  `Path Copied:\n${parentPath}${isDir ? `${entry.name}/` : entry.name}`,
                )
              }
            />

            {(isImageFile(entry.name) || isVideoFile(entry.name)) && (
              <Action
                label="Set as Background"
                onClick={() =>
                  setCurrentBackground(`${parentPath}${entry.name}`)
                }
              />
            )}

            <Action label="Delete" danger onClick={onDelete} />
          </div>
        )}
      </div>
    </div>
  );
}
