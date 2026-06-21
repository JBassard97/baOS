import "./startbutton.scss";
import baoIcon from "../../assets/icons/baosNeon.png";
import TooltipProvider from "../../providers/TooltipProvider/TooltipProvider";
import { useUIStore } from "../../store/useUIStore";

interface StartButtonProps {
  orientation?: "horizontal" | "vertical";
  taskbarPosition?: "top" | "bottom" | "left" | "right";
}

function StartButton({
  orientation = "horizontal",
  taskbarPosition = "bottom",
}: StartButtonProps) {
  const setStartMenuOpen = useUIStore((s) => s.setStartMenuOpen);
  const startMenuOpen = useUIStore((s) => s.startMenuOpen);
  return (
    <TooltipProvider text="Start Menu" taskbarPosition={taskbarPosition}>
      <div
        className={`start-button ${orientation} ${startMenuOpen && "open"}`}
        onClick={() => {
          setStartMenuOpen(!startMenuOpen);
        }}
      >
        <img src={baoIcon} alt="Bao" />
      </div>
    </TooltipProvider>
  );
}

export default StartButton;
