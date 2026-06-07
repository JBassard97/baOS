import "./desktopmain.scss";
import BackendStatusDisplay from "../BackendStatusDisplay/BackendStatusDisplay";
import MkdirAndTouch from "../MkdirAndTouch/MkdirAndTouch";
import DesktopFilesContainer from "../DesktopFilesContainer/DesktopFilesContainer";
import { isHorizontal } from "../../helpers/isHorizontal";
import { useUIStore } from "../../store/useUIStore";

export default function DesktopMain() {
  const taskbarPosition = useUIStore((state) => state.taskbarPosition);

  return (
    <main
      className={`desktop-main ${
        isHorizontal(taskbarPosition) ? "horizontal" : "vertical"
      } ${taskbarPosition}`}
    >
      <BackendStatusDisplay />
      <MkdirAndTouch />
      <DesktopFilesContainer />
    </main>
  );
}
