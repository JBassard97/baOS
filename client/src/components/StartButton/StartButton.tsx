import "./startbutton.scss";
import baoIcon from "../../assets/icons/baosNeon.png";

interface StartButtonProps {
  orientation?: "horizontal" | "vertical";
}

function StartButton({ orientation = "horizontal" }: StartButtonProps) {
  return (
    <div className={`start-button ${orientation}`}>
      <img src={baoIcon} alt="Bao" />
    </div>
  );
}

export default StartButton;
