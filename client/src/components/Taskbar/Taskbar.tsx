import "./taskbar.scss";
import StartButton from "../StartButton/StartButton";
import SmallDateClock from "../SmallDateClock/SmallDateClock";
import FullscreenButton from "../FullscreenButton/FullscreenButton";
import TaskbarPositionSetter from "../TaskbarPositionSetter/TaskbarPositionSetter";
import TaskbarItem from "../TaskbarItem/TaskbarItem";
import { useUIStore } from "../../store";
import fileManagerIcon from "../../assets/icons/file-manager.svg";
import terminalIcon from "../../assets/icons/terminal.svg";
import settingsIcon from "../../assets/icons/settings-icon.svg";
import baosIcon from "../../assets/icons/baosNeon.png";
import DevPanel from "../../applications/DevPanel/DevPanel";
import devPanelIcon from "../../assets/icons/nut.svg";
import calculatorIcon from "../../assets/icons/calculator.svg";
import imageViewerIcon from "../../assets/icons/image-viewer.svg";
import videoPlayerIcon from "../../assets/icons/video-player.svg";
import VideoPlayer from "../../applications/VideoPlayer/VideoPlayer";
import Terminal from "../../applications/Terminal/Terminal";
import FileManager from "../../applications/FileManager/FileManager";
import meowMasherIcon from "../../assets/icons/meowmasher.png";
import { getOrientation } from "../../helpers";
import wikipediaIcon from "../../assets/icons/Wikipedia-logo-v2.svg";
import googleIcon from "../../assets/icons/google-icon.svg";
import textEditorIcon from "../../assets/icons/text-editor.svg";
import TextEditor from "../../applications/TextEditor/TextEditor";

const iframeApps = {
  google: {
    icon: googleIcon,
    title: "Google",
    src: "https://www.google.com/webhp?igu=1",
    isFullscreen: true,
  },
  wikipedia: {
    icon: wikipediaIcon,
    title: "Wikipedia",
    src: "https://www.wikipedia.org/",
    isFullscreen: false,
  },
  meowMasher: {
    icon: meowMasherIcon,
    title: "Meow Masher",
    src: "https://jbassard97.github.io/MeowMasher/",
    isFullscreen: true,
  },
};

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
            <div className="left-section">
              <span className="start-menu-title">
                <img src={baosIcon} />
                Start Menu
              </span>
            </div>
            <div className="right-section">
              <div
              // onClick={() => {
              //   setStartMenuOpen(false);
              // }}
              >
                <TaskbarItem
                  icon={settingsIcon}
                  title="Settings"
                  children={<></>}
                  // isMinimized={true}
                  isFullscreen={true}
                />
              </div>
            </div>
          </div>

          <div className="start-menu-middle"></div>

          <div className="main-sections">
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
                    children={<Terminal />}
                    dontShowTooltip={true}
                  />
                  <p className="item-name">Terminal</p>
                </div>
                <div>
                  <TaskbarItem
                    icon={devPanelIcon}
                    title={"Dev Panel"}
                    children={<DevPanel />}
                    dontShowTooltip={true}
                  />
                  <p className="item-name">Dev Panel</p>
                </div>
                <div>
                  <TaskbarItem
                    icon={calculatorIcon}
                    title="Calculator"
                    children={<h2>Calculator</h2>}
                    dontShowTooltip={true}
                  />
                  <p
                    className="item-name"
                    style={{ textDecoration: "line-through" }}
                  >
                    Calculator
                  </p>
                </div>
                <div>
                  <TaskbarItem
                    icon={textEditorIcon}
                    title="Text Editor"
                    children={<TextEditor />}
                    dontShowTooltip={true}
                  />
                  <p className="item-name">Text Editor</p>
                </div>
                <div>
                  <TaskbarItem
                    icon={imageViewerIcon}
                    title="Image Viewer"
                    children={<h2>Image Viewer</h2>}
                    dontShowTooltip={true}
                  />
                  <p className="item-name">Image Viewer</p>
                </div>
                <div>
                  <TaskbarItem
                    icon={videoPlayerIcon}
                    title="Video Player"
                    children={<VideoPlayer />}
                    dontShowTooltip={true}
                  />
                  <p className="item-name">Video Player</p>
                </div>
              </div>
            </div>

            <div className="start-menu-section">
              <div className="section-title-bar">
                <span>Applications</span>
              </div>
              <div className="section-container">
                {Object.values(iframeApps).map((app, index) => (
                  <div key={index}>
                    <TaskbarItem
                      icon={app.icon}
                      title={app.title}
                      children={
                        <iframe
                          src={app.src}
                          width="100%"
                          height="100%"
                          style={{ border: "none", display: "block" }}
                        />
                      }
                      isFullscreen={app.isFullscreen ?? false}
                      dontShowTooltip={true}
                    />
                    <p className="item-name">{app.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Taskbar;
