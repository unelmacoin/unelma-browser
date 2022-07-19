import React from "react";
import { HiStar } from "react-icons/hi";
import { categorizeByDate } from "../utils/categorize";
import {
  addBookmark,
  getBookmarks,
  removeFromBookmarks,
} from "../utils/handleLocalStorage";

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
      addBookmark(activeTab.url, activeTab?.type);
      setBookmarks(categorizeByDate(getBookmarks()));
    } else {
      removeFromBookmarks(activeTab.url);
      setBookmarks(categorizeByDate(getBookmarks()));
    }
  };
  return (
    <button id="bookmark-btn" onClick={handleClick}>
      <HiStar fontSize={"18"} color={!active() ? "#333" : "gold"} />
    </button>
  );
};

export default BookmarkBtn;
