import React from "react";
import { Link } from "react-router-dom";
import { mergeChannel , CREATE_WINDOW,
  HIDE_VIEWS,
  RESET_ALL_TABS,
  RESET_WINDOW_TABS, } from "../../constants/global/channels";
import { BiHistory } from "react-icons/bi";
import { BsWindowSidebar } from "react-icons/bs";
import { IoBookmarksOutline, IoClose } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { AiOutlineClear } from "react-icons/ai";

const menuItems = () => [
  {
    label: "Bookmarks",
    icon: <IoBookmarksOutline fontSize="20" />,
    path: "/bookmarks",
    action: () => {
      window.api.send(mergeChannel(HIDE_VIEWS, window.id));
    },
  },
  {
    label: "History",
    icon: <BiHistory fontSize="20" />,
    path: "/history",
    action: () => {
      window.api.send(mergeChannel(HIDE_VIEWS, window.id));
    },
  },
  {
    label: "New Window",
    icon: <BsWindowSidebar fontSize="20" />,
    action: () => {
      window.api.send(CREATE_WINDOW);
    },
  },
  {
    label: "Close tabs",
    icon: <IoClose fontSize="20" />,
    action: () => {
      window.api.send((RESET_WINDOW_TABS, window.id));
    },
  },
  {
    label: "Clear all tabs",
    icon: <AiOutlineClear fontSize="20" />,
    action: () => {
      window.api.send(RESET_ALL_TABS, window.id);
    },
  },
  {
    label: "Settings",
    icon: <FiSettings fontSize="20" />,
    path: "/settings",
    action: () => {
      window.api.send(mergeChannel(HIDE_VIEWS, window.id));
    },
  },
];
const Menu = ({ menu, setMenu}) => {
  const renderItems = menuItems().map(
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
