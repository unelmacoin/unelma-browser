import React, { useState, useEffect, useCallback } from "react";
import { RESIZE_WINDOW } from "../../constants/global/channels";
import "./ResizableDivider.css";

const ResizableDivider = ({ position, onResize, minWidth }) => {
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isResizing) return;
      const newWidth = Math.max(minWidth, e.clientX);
      onResize(newWidth);
    },
    [isResizing, minWidth, onResize]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = "default";
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove, {
        passive: true,
      });
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

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
