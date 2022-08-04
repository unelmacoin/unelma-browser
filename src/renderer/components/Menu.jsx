import React from "react";
import uniqid from "uniqid";
import { BiHistory } from "react-icons/bi";
import { BsWindowSidebar } from "react-icons/bs";
import { IoBookmarksOutline, IoClose } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { AiOutlineClear } from "react-icons/ai";
import {
  ACTIVATE_TAB,
  ADD_TAB,
  SET_TABS,
} from "../../constants/renderer/actions";
import { closeTabs, defaultTab } from "../utils/tabs";

const menuItems = (tabs, dispatcher) => [
  {
    label: "Bookmarks",
    icon: <IoBookmarksOutline fontSize="20" />,
    action: () => {
      const id = uniqid();
      !tabs.find((tab) => tab.type === "bookmarks")
        ? dispatcher({
            type: ADD_TAB,
            payload: {
              tab: {
                id,
                type: "bookmarks",
                title: "Bookmarks",
                url: "unelma://bookmarks",
                active: true,
                loading: false,
                windowId: window.id,
              },
            },
          })
        : dispatcher({
            type: ACTIVATE_TAB,
            payload: {
              tabType: "bookmarks",
              windowId: window.id,
            },
          });
    },
  },
  {
    label: "History",
    icon: <BiHistory fontSize="20" />,
    action: () => {
      const id = uniqid();
      !tabs.find((tab) => tab.type === "history")
        ? dispatcher({
            type: ADD_TAB,
            payload: {
              tab: {
                id,
                type: "history",
                title: "History",
                url: "unelma://history",
                active: true,
                loading: false,
                windowId: window.id,
              },
            },
          })
        : dispatcher({
            type: ACTIVATE_TAB,
            payload: {
              tabType: "history",
              windowId: window.id,
            },
          });
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
      dispatcher({
        type: SET_TABS,
        payload: {
          tabs: [defaultTab(window.id)],
        },
      });
    },
  },
  {
    label: "Clear all tabs",
    icon: <AiOutlineClear fontSize="20" />,
    action: () => {
      dispatcher({
        type: SET_TABS,
        payload: {
          tabs: [defaultTab(window.id)],
        },
      });
      window.api.send("reset-all-tabs", window.id);
    },
  },
  {
    label: "Settings",
    icon: <FiSettings fontSize="20" />,
    action: () => {
      const id = uniqid();
      !tabs.find((tab) => tab.type === "settings")
        ? dispatcher({
            type: ADD_TAB,
            payload: {
              tab: {
                id,
                type: "settings",
                title: "Settings",
                url: "unelma://settings",
                active: true,
                loading: false,
                windowId: window.id,
              },
            },
          })
        : dispatcher({
            type: ACTIVATE_TAB,
            payload: {
              tabType: "bookmarks",
              windowId: window.id,
            },
          });
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
