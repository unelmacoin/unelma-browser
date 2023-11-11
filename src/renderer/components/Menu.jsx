import React from "react";
import { Link } from "react-router-dom";
import {
  mergeChannel,
  CREATE_WINDOW,
  HIDE_VIEWS,
  RESET_ALL_TABS,
  RESET_WINDOW_TABS,
} from "../../constants/global/channels";
import { BiHistory } from "react-icons/bi";
import { BsWindowSidebar } from "react-icons/bs";
import { IoBookmarksOutline, IoClose } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { AiOutlineClear } from "react-icons/ai";
import "../css/theme.css";

const menuItems = () => [
  {
    label: "Bookmarks",
    icon: <IoBookmarksOutline />,
    path: "/bookmarks",
    action: () => {
      window.api.send(mergeChannel(HIDE_VIEWS, window.id));
    },
  },
  {
    label: "History",
    icon: <BiHistory />,
    path: "/history",
    action: () => {
      window.api.send(mergeChannel(HIDE_VIEWS, window.id));
    },
  },
  {
    label: "New Window",
    icon: <BsWindowSidebar />,
    action: () => {
      window.api.send(CREATE_WINDOW);
    },
  },
  {
    label: "Close tabs",
    icon: <IoClose />,
    action: () => {
      window.api.send((RESET_WINDOW_TABS, window.id));
    },
  },
  {
    label: "Clear all tabs",
    icon: <AiOutlineClear />,
    action: () => {
      window.api.send(RESET_ALL_TABS, window.id);
    },
  },
  {
    label: "Settings",
    icon: <FiSettings />,
    path: "/settings",
    action: () => {
      window.api.send(mergeChannel(HIDE_VIEWS, window.id));
    },
  },
];
const Menu = ({ menu, setMenu }) => {
  const renderItems = menuItems().map(({ label, icon, action, path }) =>
    path ? (
      <li key={label} className="menu-item">
        <Link
          className="menu-item-link"
          to={path}
          onClick={() => {
            action();
            setMenu(false);
          }}
        >
          <span>{icon}</span>
          <span>{label}</span>
        </Link>
      </li>
    ) : (
      <li key={label} className="menu-item">
        <button
          className="menu-item-link"
          onClick={() => {
            action();
            setMenu(false);
          }}
        >
          <span>{icon}</span>
          <span>{label}</span>
        </button>
      </li>
    )
  );
  const handleCloseThreeButtonMenu = () => {
    if (menu === true) setMenu(false);
  };
  return (
    <div id="menu" className={`${menu && "open"} popMenu`}>
      <div className="closeMenu-container">
        <button id="closeMenu" onClick={handleCloseThreeButtonMenu}>
          &times;
        </button>
      </div>
      <ul id="menu-list">{renderItems}</ul>
    </div>
  );
};

export default Menu;
