import React, { useState } from "react";
import "../css/history.css";
import "../css/pagesResponsive.css";
import { FaTimes } from "react-icons/fa";
import {
  REMOVE_SEARCH_HISTORY,
} from "../../constants/renderer/actions";
import uniqid from "uniqid";
import dateFormat from "dateformat";
import EmptyList from "../components/EmptyList/EmptyList.jsx";
import { categorizeByDate } from "../utils/categorize";
import BackwardBtn from "../components/BackwardBtn/BackwardBtn.jsx";
import Layout from "../components/Layout/Layout.jsx";
import { ADD_VIEW, mergeChannel } from "../../constants/global/channels";

const History = ({  searchHistory, searchHistoryDispatcher }) => {
  const [expanded, setExpanded] = useState(false);
  const sortedKeys = Object.keys(categorizeByDate(searchHistory)).sort(
    (a, b) => {
      if (a.includes("Today")) return -1;
      if (b.includes("Today")) return 1;
      if (a.includes("Yesterday")) return -1;
      if (b.includes("Yesterday")) return 1;
      if (a.includes("Last Week")) return -1;
      if (b.includes("Last Week")) return 1;
      if (a.includes("Older")) return -1;
      if (b.includes("Older")) return 1;
      return 0;
    }
  );

  const handleHistoryItemClick = (url) => {
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
      console.error('Error handling history item click:', error);
    }
  };

  const renderHistoryItems = (items) =>
    items.map(({ id, url, time }) => (
      <li key={id} className="item">
        <div className="item-content">
          <p className="time">{dateFormat(new Date(time), "h:MM TT")}</p>
          <button 
            className="item-url-links"
            onClick={() => handleHistoryItemClick(url)}
          >
            {expanded ? `${url.slice(0, 15)}...` : url.length > 40 ? `${url.slice(0, 40)}...` : url}
          </button>
        </div>
        <button 
          className="item-url-links"
          onClick={() => {
            try {
              searchHistoryDispatcher({
                type: REMOVE_SEARCH_HISTORY,
                payload: { id },
              });
            } catch (error) {
              console.error('Error removing history item:', error);
            }
          }}
        >
          <FaTimes fontSize="10px" />
        </button>
      </li>
    ));

  const renderHistoryCategories = () =>
    sortedKeys.length > 0 ? (
      sortedKeys.map((key) => (
        <li key={key} className="category">
          <h4>{key}</h4>
          <ul className="marks">
            {renderHistoryItems(categorizeByDate(searchHistory)[key])}
          </ul>
        </li>
      ))
    ) : (
      <EmptyList label="Search history" />
    );

  return (
    <Layout>
      <div className={`pagesContainer ${expanded ? "pagesContainer_click" : "pagesContainer_default"}`}>
        <div id="search-history">
          <BackwardBtn />
          <ul id="categories-list">{renderHistoryCategories()}</ul>
        </div>
      </div>
    </Layout>
  );
};

export default History;
