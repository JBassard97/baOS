import "./fileentryicon.scss";
import fileIcon from "../../assets/icons/file-icon.svg";
import folderIcon from "../../assets/icons/folder-icon.svg";
interface FileEntry {
  name: string;
  type: string;
}

interface FileEntryIconProps {
  entry: FileEntry;
  isSelected: boolean;
  onSelect: () => void;
  parentPath: string;
}

export default function FileEntryIcon({
  entry,
  isSelected,
  onSelect,
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
      >
        <img className="file-entry-icon" src={isDir ? folderIcon : fileIcon} />

        <p className="file-entry-name">
          {isDir ? `/${entry.name}` : entry.name}
        </p>
      </div>

      <div className="actions-section">
        {isSelected && (
          <div className="file-entry-actions">
            <div className="action">Open</div>
            <div className="action">Rename</div>
            <div className="action" onClick={() => alert(`Path Copied: \n${parentPath}/${entry.name}`)}>
              Copy Path
            </div>
            <div className="action">Delete</div>
          </div>
        )}
      </div>
    </div>
  );
}
