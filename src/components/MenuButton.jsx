import React from "react";
import { HiDotsHorizontal } from "react-icons/hi";

const MenuButton = ({ setMenu }) => {
  const handleClick = () => {
    setMenu((v) => !v);
  };
  return (
    <button id="menu-button" onClick={handleClick}>
      <HiDotsHorizontal />
    </button>
  );
};

export default MenuButton;
