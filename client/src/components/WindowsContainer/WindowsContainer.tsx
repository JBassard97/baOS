import "./windowscontainer.scss";
import { useUIStore } from "../../store/useUIStore";
// import Window from "../Window/Window";
// import fileManagerIcon from "../../assets/icons/file-manager.svg";

export default function WindowsContainer() {
  const taskbarPosition = useUIStore((s) => s.taskbarPosition);

  return (
    <div className={`windows-container ${taskbarPosition}`}>
      {/* <Window icon={fileManagerIcon} title="File Manager"/> */}
    </div>
  );
}
