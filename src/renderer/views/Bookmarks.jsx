import React, { useState } from "react";
import "../css/bookmarks.css";
import "../css/pagesResponsive.css";
import { FaTimes } from "react-icons/fa";
import { REMOVE_BOOKMARK } from "../../constants/renderer/actions";
import uniqid from "uniqid";
import dateFormat from "dateformat";
import { categorizeByDate } from "../utils/categorize";
import EmptyList from "../components/EmptyList/EmptyList.jsx";
import BackwardBtn from "../components/BackwardBtn/BackwardBtn.jsx";
import Layout from "../components/Layout/Layout.jsx";
import { ADD_VIEW, mergeChannel } from "../../constants/global/channels";

const Bookmarks = ({ bookmarks, bookmarksDispatcher }) => {
  const [expanded, setExpanded] = useState(false);
  const sortedKeys = Object.keys(categorizeByDate(bookmarks)).sort((a, b) => {
    if (a.includes("Today")) return -1;
    if (b.includes("Today")) return 1;
    if (a.includes("Yesterday")) return -1;
    if (b.includes("Yesterday")) return 1;
    if (a.includes("Last Week")) return -1;
    if (b.includes("Last Week")) return 1;
    if (a.includes("Older")) return -1;
    if (b.includes("Older")) return 1;
    return 0;
  });

  const handleBookmarkClick = (url) => {
    try {
      setExpanded(true);
      window.api.send(mergeChannel(ADD_VIEW, window.id), {
        id: uniqid(),
        url,
      });
      // Use history.back() as a fallback if the backward button isn't available
      if (window.history && window.history.length > 1) {
        window.history.back();
      }
    } catch (error) {
      console.error('Error handling bookmark click:', error);
    }
  };

  const renderBookmarksItems = (items) =>
    items.map(({ id, url, time }) => (
      <li key={id} className="item">
        <div className="item-content">
          <p className="time">{dateFormat(new Date(time), "h:MM TT")}</p>
          <button 
            className="item-url-links"
            onClick={() => handleBookmarkClick(url)}
          >
            {expanded ? `${url.slice(0, 15)}...` : url.length > 40 ? `${url.slice(0, 40)}...` : url}
          </button>
        </div>
        <button 
          className="item-url-links"
          onClick={() => {
            try {
              bookmarksDispatcher({
                type: REMOVE_BOOKMARK,
                payload: { url },
              });
            } catch (error) {
              console.error('Error removing bookmark:', error);
            }
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
          <ul className="marks">
            {renderBookmarksItems(categorizeByDate(bookmarks)[key])}
          </ul>
        </li>
      ))
    ) : (
      <EmptyList label="Bookmark" />
    );

  return (
    <Layout>
      <div className={`pagesContainer ${expanded ? "pagesContainer_click" : "pagesContainer_default"}`}>
        <div id="bookmarks">
          <BackwardBtn />
          <ul id="categories-list">{renderBookmarksCategories()}</ul>
        </div>
      </div>
    </Layout>
  );
};

export default Bookmarks;
