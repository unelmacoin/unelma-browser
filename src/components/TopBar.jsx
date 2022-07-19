import React, { useEffect, useState } from "react";
import { MdOutlineMinimize } from "react-icons/md";
import { FiMinimize2, FiMaximize2 } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
const { ipcRenderer } = window.require("electron");
const TopBar = () => {
  const [maximize, setMaximize] = useState(true);
  const handleMaximize = () => {
    ipcRenderer.send("maximize", window.id);
     setMaximize(true);
  };
  const handleUnMaximize = () => {
    ipcRenderer.send("unmaximize", window.id);
     setMaximize(false);
  };
  const handleMinimize = () => {
    ipcRenderer.send("minimize", window.id);
   
  };
  const handleClose = () => {
    ipcRenderer.send("close-window", window.id);
  };
  useEffect(() => {
    ipcRenderer.on("is-maximized", (_, isMaximized) => {
      setMaximize(isMaximized);
    });
  }, [maximize]);
  return (
    <div className="top-bar">
      <button id="window-controls-minimize" onClick={handleMinimize}>
        <MdOutlineMinimize fontSize="8px" />
      </button>
      {!maximize ?<button id="window-controls-maximize" onClick={handleMaximize}>
        <FiMaximize2 fontSize="8px" />
      </button>
      :<button id="window-controls-unmaximize" onClick={handleUnMaximize}>
        <FiMinimize2 fontSize="8px" />
      </button>}
      <button id="window-controls-close" onClick={handleClose}>
        <IoClose fontSize="8px" />
      </button>
    </div>
  );
};

export default TopBar;
