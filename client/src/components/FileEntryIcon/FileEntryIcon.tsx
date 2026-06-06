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
}

export default function FileEntryIcon({
  entry,
  isSelected,
  onSelect,
}: FileEntryIconProps) {
  const isDir = entry.type === "dir";

  return (
    <div
      className={isSelected ? "file-entry selected" : "file-entry"}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <img className="file-entry-icon" src={isDir ? folderIcon : fileIcon} />

      <p className="file-entry-name">{isDir ? `/${entry.name}` : entry.name}</p>
    </div>
  );
}
