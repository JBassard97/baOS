import "./fileentryicon.scss";
import fileIcon from "../../assets/icons/file-icon.svg";
import folderIcon from "../../assets/icons/folder-icon.svg";

interface FileEntry {
  name: string;
  type: string;
}

interface FileEntryIconProps {
  entry: FileEntry;
}

export default function FileEntryIcon({ entry }: FileEntryIconProps) {
  const isDir: boolean = entry.type === "dir";

  return (
    <div className="file-entry">
      <img src={isDir ? folderIcon : fileIcon} />
      <p>{isDir ? `/${entry.name}` : entry.name}</p>
    </div>
  );
}
