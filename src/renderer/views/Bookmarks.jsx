import React from "react";
import "../css/bookmarks.css";
import { FaTimes } from "react-icons/fa";
import {  REMOVE_BOOKMARK } from "../../constants/renderer/actions";
import uniqid from "uniqid";
import dateFormat from "dateformat";
import { categorizeByDate } from "../utils/categorize";
import EmptyList from "../components/EmptyList/EmptyList.jsx";
import BackwardBtn from "../components/BackwardBtn/BackwardBtn.jsx";
import Layout from "../components/Layout/Layout.jsx";
const Bookmarks = ({ bookmarks, bookmarksDispatcher }) => {
  const sortedKeys = Object.keys(categorizeByDate(bookmarks)).sort((a, b) => {
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
              window.api.send("add-view" + window.id, { id: uniqid(), url });
              document.querySelector(".backward-btn a").click();
            }}
          >
            {url.length > 40 ? `${url.slice(0, 40)}...` : url}
          </button>
        </div>
        <button
          onClick={() => {
            bookmarksDispatcher({
              type: REMOVE_BOOKMARK,
              payload: {
                url,
              },
            });
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
      <div id="bookmarks" className="active-bookmarks">
        <BackwardBtn />
        <ul id="categories-list">{renderBookmarksCategories()}</ul>
      </div>
    </Layout>
  );
};

export default Bookmarks;
