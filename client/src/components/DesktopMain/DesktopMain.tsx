import "./desktopmain.scss";
import BackendStatusDisplay from "../BackendStatusDisplay/BackendStatusDisplay";
import MkdirAndTouch from "../MkdirAndTouch/MkdirAndTouch";
import DesktopFilesContainer from "../DesktopFilesContainer/DesktopFilesContainer";
import WindowsContainer from "../WindowsContainer/WindowsContainer";
import { isHorizontal } from "../../helpers/isHorizontal";
import { useUIStore } from "../../store/useUIStore";
// import DevPanel from "../DevPanel";

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
      <WindowsContainer />
      {/* <DevPanel/> */}
    </main>
  );
}
