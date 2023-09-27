import React, { useEffect, useState } from "react";
import { MdOutlineMinimize } from "react-icons/md";
import { FiMinimize2, FiMaximize2 } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import {
  CLOSE_WINDOW,
  IS_MAXIMIZED,
  MAXIMIZE,
  MINIMIZE,
  UN_MAXIMIZE,
} from "../../constants/global/channels";

const TopBar = ({ menu, setMenu }) => {
  const [maximize, setMaximize] = useState(true);
  const handleMaximize = () => {
    window.api.send(MAXIMIZE, window.id);
    setMaximize(true);
  };
  const handleUnMaximize = () => {
    window.api.send(UN_MAXIMIZE, window.id);
    setMaximize(false);
  };
  const handleMinimize = () => {
    window.api.send(MINIMIZE, window.id);
  };
  const handleClose = () => {
    window.api.send(CLOSE_WINDOW, window.id);
  };
  useEffect(() => {
    window.api.receive(IS_MAXIMIZED, (_, isMaximized) => {
      setMaximize(isMaximized);
    });
  }, [maximize]);
  const handle_CloseThreeButtonMenu = () => {
    if (menu === true) setMenu(false);
  };

  return (
    <div
      className="top-bar"
      onClick={handle_CloseThreeButtonMenu}
      onDoubleClick={maximize ? handleUnMaximize : handleMaximize}
    >
      <button id="window-controls-minimize" onClick={handleMinimize}>
        <MdOutlineMinimize fontSize="8px" />
      </button>
      {!maximize ? (
        <button id="window-controls-maximize" onClick={handleMaximize}>
          <FiMaximize2 fontSize="8px" />
        </button>
      ) : (
        <button id="window-controls-unmaximize" onClick={handleUnMaximize}>
          <FiMinimize2 fontSize="8px" />
        </button>
      )}
      <button id="window-controls-close" onClick={handleClose}>
        <IoClose fontSize="8px" />
      </button>
    </div>
  );
};

export default TopBar;
