import { useFloating, offset, flip, shift } from "@floating-ui/react";
import { useState } from "react";

type Placement = "top" | "bottom" | "left" | "right";

type TooltipProviderProps = {
  children: React.ReactNode;
  text: string;
  placement?: Placement;
  taskbarPosition?: Placement;
};

const oppositePlacement: Record<Placement, Placement> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

export default function TooltipProvider({
  children,
  text,
  placement,
  taskbarPosition = "bottom",
}: TooltipProviderProps) {
  const [open, setOpen] = useState(false);

  const finalPlacement: Placement =
    placement ?? oppositePlacement[taskbarPosition];

  const { refs, floatingStyles } = useFloating({
    placement: finalPlacement,
    middleware: [offset(8), flip(), shift({ padding: 6 })],
  });

  return (
    <div
      ref={refs.setReference}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{ display: "inline-flex" }}
    >
      {children}

      {open && (
        <div
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            fontFamily: "Seguo, sans-serif",
            background: "#252525",
            color: "white",
            padding: "6px 8px",
            borderRadius: "999px",
            fontSize: "14px",
            zIndex: 1000,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}
