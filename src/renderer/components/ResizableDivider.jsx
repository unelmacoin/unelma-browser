import React, { useState, useEffect } from "react";
import { RESIZE_WINDOW } from "../../constants/global/channels";
import "./ResizableDivider.css";

const ResizableDivider = ({ position, onResize, minWidth }) => {
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const newWidth = Math.max(minWidth, e.clientX);
      onResize(newWidth);
      window.api.send(RESIZE_WINDOW, {
        windowId: window.id,
        width: newWidth,
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "default";
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove, {
        passive: true,
      });
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, position, onResize, minWidth]);

  const startResizing = (e) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = "col-resize";
  };

  return (
    <div
      className={`resizer ${isResizing ? "dragging" : ""}`}
      onMouseDown={startResizing}
      style={{
        left: `${position}px`,
        cursor: "col-resize",
      }}
    />
  );
};

export default ResizableDivider;
