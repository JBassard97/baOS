import "./windowscontainer.scss";
import { useUIStore } from "../../store/useUIStore";

export default function WindowsContainer() {
  const taskbarPosition = useUIStore((s) => s.taskbarPosition);

  return <div className={`windows-container ${taskbarPosition}`}></div>;
}
