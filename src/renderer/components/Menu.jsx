import React from "react";
import { BiHistory } from "react-icons/bi";
import { BsWindowSidebar } from "react-icons/bs";
import { IoBookmarksOutline, IoClose } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { AiOutlineClear } from "react-icons/ai";
import { Link } from "react-router-dom";
const menuItems = () => [
  {
    label: "Bookmarks",
    icon: <IoBookmarksOutline fontSize="20" />,
    path: "/bookmarks",
    action: () => {
      window.api.send("hide-views" + window.id);
    },
  },
  {
    label: "History",
    icon: <BiHistory fontSize="20" />,
    path: "/history",
    action: () => {
      window.api.send("hide-views" + window.id);
    },
  },
  {
    label: "New Window",
    icon: <BsWindowSidebar fontSize="20" />,
    action: () => {
      window.api.send("create-window");
    },
  },
  {
    label: "Close tabs",
    icon: <IoClose fontSize="20" />,
    action: () => {
      window.api.send("reset-window-tabs" + window.id);
    },
  },
  {
    label: "Clear all tabs",
    icon: <AiOutlineClear fontSize="20" />,
    action: () => {
      window.api.send("reset-all-tabs", window.id);
    },
  },
  {
    label: "Settings",
    icon: <FiSettings fontSize="20" />,
    path: "/settings",
    action: () => {
      window.api.send("hide-views" + window.id);
    },
  },
];
const Menu = ({ menu, setMenu, tabsDispatch, tabs }) => {
  const renderItems = menuItems(tabs, tabsDispatch).map(
    ({ label, icon, action, path }) =>
      path ? (
        <li key={label} className="menu-item">
          <Link
            to={path}
            onClick={() => {
              action();
              setMenu(false);
            }}
          >
            {icon}
            <span> {label}</span>
          </Link>
        </li>
      ) : (
        <li key={label} className="menu-item">
          <button
            onClick={() => {
              action();
              setMenu(false);
            }}
          >
            {icon}
            <span> {label}</span>
          </button>
        </li>
      )
  );
  return (
    <div id="menu" className={`${menu && "open"}`}>
      <ul id="menu-list">{renderItems}</ul>
    </div>
  );
};

export default Menu;
