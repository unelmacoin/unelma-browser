import React from "react";
import {
  TbLayoutSidebarRightExpand,
  TbLayoutSidebarLeftExpand,
} from "react-icons/tb";
import { TOGGLE_WINDOW } from "../../constants/global/channels";

const WindowControllers = ({
  openSidebar,
  setOpenSidebar,
  setMenu,
  setLoginDialogInfo,
}) => {
  const handleClick = () => {
    setOpenSidebar(!openSidebar);
    window.api.send(TOGGLE_WINDOW, window.id);
    if (openSidebar) {
      setMenu(false);
      setLoginDialogInfo(null);
    }
  };
  return (
    <div id="window-controllers">
      <button id="toggle-btn" onClick={handleClick}>
        {openSidebar ? (
          <TbLayoutSidebarRightExpand className="window-controllers-icon" fontSize="25" />
        ) : (
          <TbLayoutSidebarLeftExpand className="window-controllers-icon" fontSize="25" />
        )}
      </button>
    </div>
  );
};

export default WindowControllers;
