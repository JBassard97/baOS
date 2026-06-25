import "./taskbar.scss";
import StartButton from "../StartButton/StartButton";
import SmallDateClock from "../SmallDateClock/SmallDateClock";
import FullscreenButton from "../FullscreenButton/FullscreenButton";
import TaskbarPositionSetter from "../TaskbarPositionSetter/TaskbarPositionSetter";
import TaskbarItem from "../TaskbarItem/TaskbarItem";
import { useUIStore } from "../../store";
import fileManagerIcon from "../../assets/icons/file-manager.svg";
import terminalIcon from "../../assets/icons/terminal.svg";
import baosIcon from "../../assets/icons/baosNeon.png";
import DevPanel from "../DevPanel";
import devPanelIcon from "../../assets/icons/nut.svg";
import FileManager from "../../applications/FileManager/FileManager";
import { getOrientation } from "../../helpers";

function Taskbar() {
  const position = useUIStore((s) => s.taskbarPosition);
  const startMenuOpen = useUIStore((s) => s.startMenuOpen);
  const setStartMenuOpen = useUIStore((s) => s.setStartMenuOpen);

  const closeStartMenuIfOpen = () => {
    if (startMenuOpen) setStartMenuOpen(false);
  };

  return (
    <div
      className={`taskbar ${getOrientation(position)} ${position} ${startMenuOpen && "open"}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeStartMenuIfOpen();
        }
      }}
    >
      <div className="taskbar-main">
        <div className="left-or-top-group">
          <StartButton />
          <TaskbarItem
            icon={fileManagerIcon}
            title={"File Manager"}
            children={<FileManager />}
          />
          <TaskbarItem
            icon={devPanelIcon}
            title={"Dev Panel"}
            children={<DevPanel />}
          />
        </div>
        <div className="right-or-bottom-group">
          <TaskbarPositionSetter />
          <FullscreenButton />
          <SmallDateClock />
        </div>
      </div>
      {startMenuOpen && (
        <div className="start-menu">
          <div className="start-menu-title-bar">
            <span className="start-menu-title">
              <img src={baosIcon} />
              Start Menu
            </span>
          </div>
          <div className="start-menu-section">
            <div className="section-title-bar">
              <span>Utilities</span>
            </div>
            <div className="section-container">
              <div>
                <TaskbarItem
                  icon={fileManagerIcon}
                  title={"File Manager"}
                  children={<FileManager />}
                  dontShowTooltip={true}
                />
                <p className="item-name">File Manager</p>
              </div>
              <div>
                <TaskbarItem
                  icon={terminalIcon}
                  title={"Terminal"}
                  children={<h1>Terminal </h1>}
                  dontShowTooltip={true}
                />
                <p className="item-name">Terminal</p>
              </div>
            </div>
          </div>
          <div className="start-menu-section">
            <div className="section-title-bar">
              <span>IDK yet</span>
            </div>
            <div className="section-container"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Taskbar;
