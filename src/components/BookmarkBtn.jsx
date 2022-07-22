const { ipcRenderer } = window.require("electron/renderer");
import React from "react";
import { HiStar } from "react-icons/hi";

const BookmarkBtn = ({ tabs, setBookmarks, bookmarks }) => {
  const activeTab = tabs.find((tab) => tab.active);
  const basicBookmarks = Object.values(bookmarks).reduce((acc, elm) => {
    acc = [...acc, ...elm];
    return acc;
  }, []);
  let active = () =>
    !!basicBookmarks.find((item) => item.url === activeTab?.url);

  const handleClick = () => {
    const activeTab = tabs.find((tab) => tab.active);
    if (!basicBookmarks.find((item) => item.url === activeTab.url)) {
      // addBookmark(activeTab.url, activeTab?.type);
      ipcRenderer.send("add-bookmark", [activeTab.url, activeTab?.type])
      
    } else {
     
      ipcRenderer.send("remove-from-bookmarks", activeTab.url);
    }
  };
  return (
    <button id="bookmark-btn" onClick={handleClick}>
      <HiStar fontSize={"18"} color={!active() ? "#333" : "gold"} />
    </button>
  );
};

export default BookmarkBtn;
