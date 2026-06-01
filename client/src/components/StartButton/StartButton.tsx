import "./startbutton.scss";
import baoIcon from "../../assets/icons/baosNeon.png";
import TooltipProvider from "../../providers/TooltipProvider/TooltipProvider";

interface StartButtonProps {
  orientation?: "horizontal" | "vertical";
  taskbarPosition?: "top" | "bottom" | "left" | "right";
}

function StartButton({
  orientation = "horizontal",
  taskbarPosition = "bottom",
}: StartButtonProps) {
  return (
    <TooltipProvider
      text="Start Menu"
      taskbarPosition={taskbarPosition}
    >
      <div className={`start-button ${orientation}`}>
        <img src={baoIcon} alt="Bao" />
      </div>
    </TooltipProvider>
  );
}

export default StartButton;
