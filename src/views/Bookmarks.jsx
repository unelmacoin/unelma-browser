import React from "react";
import "../css/bookmarks.css";
import { FaTimes } from "react-icons/fa";
const { ipcRenderer } = window.require("electron/renderer");
import { ADD_TAB } from "../utils/actions";
import { generateId } from "../utils/generateId";
import dateFormat from "dateformat";
const Bookmarks = ({ active, tabsDispatch, bookmarks }) => {
  const sortedKeys = Object.keys(bookmarks).sort((a, b) => {
    if (a.includes("Today")) return -1;
    if (b.includes("Today")) return 1;
    if (a.includes("Yesterday")) return -1;
    if (b.includes("Yesterday")) return 1;
    if (a.includes("Last 7 days")) return -1;
    if (b.includes("Last 7 days")) return 1;
    if (a.includes("Older")) return -1;
    if (b.includes("Older")) return 1;
    return 0;
  });
  const renderBookmarksItems = (items) =>
    items.map(({ id, url, time }) => (
      <li key={id} className="item">
        <div className="item-content">
          <p className="time">{dateFormat(new Date(time), "h:MM TT")}</p>
          <button
            onClick={() => {
              tabsDispatch({
                type: ADD_TAB,
                tab: {
                  id: generateId(),
                  url,
                  type: "webview",
                  active: true,
                  title: "loading...",
                },
              });
            }}
          >
            {url}
          </button>
        </div>
        <button
          onClick={() => {
            ipcRenderer.send("remove-from-bookmarks", url);
          }}
        >
          <FaTimes fontSize="10px" />
        </button>
      </li>
    ));
  const renderBookmarksCategories = () =>
    sortedKeys.length > 0 ? (
      sortedKeys.map((key) => (
        <li key={key} className="category">
          <h4>{key}</h4>
          <ul className="marks">{renderBookmarksItems(bookmarks[key])}</ul>
        </li>
      ))
    ) : (
      <div>No Bookmarks</div>
    );
  return (
    <div id="bookmarks" className={`${active && "active-bookmarks"}`}>
      <ul id="categories-list">{renderBookmarksCategories()}</ul>
    </div>
  );
};

export default Bookmarks;
