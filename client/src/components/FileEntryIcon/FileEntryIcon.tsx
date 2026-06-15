import "./fileentryicon.scss";
import type { FileEntry } from "../../interfaces/FileEntry";
import { getFileIcon } from "../../helpers/getFileIcon";

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

  return (
    <div style={{ position: "relative" }}>
      <div
        className={isSelected ? "file-entry selected" : "file-entry"}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onDoubleClick={() => {
          alert(
            `Attempted to open: \n${parentPath}${isDir ? `${entry.name}/` : entry.name}`,
          );
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onContextMenuOpen(e.clientX, e.clientY);
        }}
      >
        <img className="file-entry-icon" src={getFileIcon(entry.name, isDir)} />

        <p className="file-entry-name">
          {isDir ? `${entry.name}/` : entry.name}
        </p>
      </div>

      <div className="actions-section">
        {showActions && (
          <div className="file-entry-actions">
            <div className="action">Open</div>
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
            <div className="action" onClick={onDelete}>
              Delete
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
