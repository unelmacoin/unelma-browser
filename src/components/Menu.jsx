import React from "react";
import { BiHistory } from "react-icons/bi";
import { BsWindowSidebar } from "react-icons/bs";
import { IoBookmarksOutline, IoClose } from "react-icons/io5";
import { AiOutlineClear } from "react-icons/ai";
import { ACTIVATE_TAB, ADD_TAB } from "../utils/actions";
import { generateId } from "../utils/generateId";
import { closeTabs } from "../utils/tabs";

const { ipcRenderer } = window.require("electron");
const menuItems = (tabs, dispatcher) => [
  {
    label: "Bookmarks",
    icon: <IoBookmarksOutline fontSize="20" />,
    action: () => {
      const id = generateId();
      !tabs.find((tab) => tab.type === "bookmarks")
        ? dispatcher({
            type: ADD_TAB,
            tab: {
              id,
              type: "bookmarks",
              title: "Bookmarks",
              url: null,
              active: true,
              loading: false,
            },
          })
        : dispatcher({
            type: ACTIVATE_TAB,
            tabType: "bookmarks",
          });
    },
  },
  {
    label: "History",
    icon: <BiHistory fontSize="20" />,
    action: () => {
      const id = generateId();
      !tabs.find((tab) => tab.type === "history")
        ? dispatcher({
            type: ADD_TAB,
            tab: {
              id,
              type: "history",
              title: "History",
              url: null,
              active: true,
              loading: false,
            },
          })
        : dispatcher({
            type: ACTIVATE_TAB,
            tabType: "history",
          });
    },
  },
  {
    label: "New Window",
    icon: <BsWindowSidebar fontSize="20" />,
    action: () => {
      ipcRenderer.send("create-window");
    },
  },
  {
    label: "Close tabs",
    icon: <IoClose fontSize="20" />,
    action: () => {
      closeTabs(dispatcher);
    },
  },
  {
    label: "Clear all tabs",
    icon: <AiOutlineClear fontSize="20" />,
    action: () => {
     ipcRenderer.send("reset-all-tabs");
    },
  },
];
const Menu = ({ menu, setMenu, tabsDispatch, tabs }) => {
  const renderItems = menuItems(tabs, tabsDispatch).map(
    ({ label, icon, action }) => (
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
