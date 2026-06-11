import { resetOpfs } from "../vfs-actions/resetOpfs";

export default function DevPanel() {
  return (
    <div
      style={{
        width: "5rem",
        height: "5rem",
        background: "darkslategray",
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        top: "50%",
      }}
    >
      <button onClick={resetOpfs}>Reset OPFS</button>
      <button onClick={() => localStorage.clear()}>Reset State</button>
    </div>
  );
}
