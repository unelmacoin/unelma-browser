import React from "react";
import { HiDotsHorizontal } from "react-icons/hi";

const MenuButton = ({ setMenu, openSidebar }) => {
  const handleClick = () => {
    setMenu((v) => !v);
    if (!openSidebar) {
      document.getElementById("toggle-btn").click();
    }
  };
  return (
    <button id="menu-button" onClick={handleClick}>
      <HiDotsHorizontal />
    </button>
  );
};

export default MenuButton;
