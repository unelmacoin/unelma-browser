import React from "react";
import {
  TbLayoutSidebarRightExpand,
  TbLayoutSidebarLeftExpand,
} from "react-icons/tb";

const WindowControllers = ({
  openSidebar,
  setOpenSidebar,
  setMenu,
  setLoginDialogInfo,
}) => {
  const handleClick = () => {
    setOpenSidebar(!openSidebar);
    window.api.send("toggle-window", window.id);
    if (openSidebar) {
      setMenu(false);
      setLoginDialogInfo(null);
    }
  };
  return (
    <div id="window-controllers">
      <button id="toggle-btn" onClick={handleClick}>
        {openSidebar ? (
          <TbLayoutSidebarRightExpand color="#333333b2" fontSize="25" />
        ) : (
          <TbLayoutSidebarLeftExpand color="#333333b2" fontSize="25" />
        )}
      </button>
    </div>
  );
};

export default WindowControllers;
