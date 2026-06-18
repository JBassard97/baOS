import "./filemanager.scss";
import { useState, useEffect } from "react";
import { VFS_ROOT } from "../../constants/constants";
import { ls } from "../../vfs-actions/ls";

export default function FileManager() {
  const [pathInputState, setPathInputState] = useState<string>(VFS_ROOT);
  const [entriesFound, setEntriesFound] = useState([]);

  async function fetchPath(path: string) {
    try {
      const result = await ls(path);
      if (result.entries) {
        setEntriesFound(result.entries);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchPath(pathInputState);
  }, [pathInputState]);

  return (
    <div className="file-manager">
      <input
        type="text"
        name="path-input"
        id="path-input"
        value={pathInputState}
        onChange={(e) => setPathInputState(e.target.value)}
      />
      {entriesFound.length > 0 &&
        entriesFound.map((entry: { name: string }, index) => (
          <p key={index}>{entry.name}</p>
        ))}
    </div>
  );
}
