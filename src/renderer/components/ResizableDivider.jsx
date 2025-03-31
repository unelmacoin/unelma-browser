import React, { useState, useEffect } from "react";
import { RESIZE_WINDOW } from "../../constants/global/channels";
import "./ResizableDivider.css";

const ResizableDivider = ({
  position,
  onResize,
  minWidth = 100,
  collapseThreshold = 120,
  collapsedWidth = 40,
}) => {
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const newWidth = Math.max(0, e.clientX);

      // Handle collapsing
      if (newWidth <= collapseThreshold) {
        onResize(collapsedWidth);
        window.api.send(RESIZE_WINDOW, {
          windowId: window.id,
          width: collapsedWidth,
        });
        return;
      }

      // Handle expanding
      if (
        newWidth > collapseThreshold &&
        newWidth >= minWidth &&
        newWidth < window.innerWidth - 100
      ) {
        onResize(newWidth);
        window.api.send(RESIZE_WINDOW, {
          windowId: window.id,
          width: newWidth,
        });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "default";

      // Send final resize event
      window.api.send(RESIZE_WINDOW, {
        windowId: window.id,
        width: position,
      });
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
  }, [
    isResizing,
    position,
    onResize,
    minWidth,
    collapseThreshold,
    collapsedWidth,
  ]);

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
