import React from "react";
import { HiStar } from "react-icons/hi";
import {
  ADD_BOOKMARK,
  REMOVE_BOOKMARK,
} from "../../constants/renderer/actions";
import uniqid from "uniqid";
const BookmarkBtn = ({ tabs, bookmarks, bookmarksDispatcher }) => {
  const activeTab = tabs.find((tab) => tab.active);
  let active = () => !!bookmarks.find((item) => item.url === activeTab?.url);
  const handleClick = () => {
    const activeTab = tabs.find((tab) => tab.active);
    if (!bookmarks.find((item) => item.url === activeTab.url)) {
      bookmarksDispatcher({
        type: ADD_BOOKMARK,
        payload: {
          bookmark: {
            url: activeTab.url,
            id: uniqid(),
            time: new Date(Date.now()),
          },
          type: activeTab.type,
        },
      });
    } else {
      bookmarksDispatcher({
        type: REMOVE_BOOKMARK,
        payload: {
          url: activeTab.url,
        },
      });
    }
  };
  return (
    <button id="bookmark-btn" onClick={handleClick}>
      <HiStar fontSize={"18"} color={!active() ? "#333" : "gold"} />
    </button>
  );
};

export default BookmarkBtn;
