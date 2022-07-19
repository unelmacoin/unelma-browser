import React from "react";
import "../css/history.css";
import { categorizeByDate } from "../utils/categorize";
import { getSearchHistory, removeFromSearchHistroy } from "../utils/handleLocalStorage";
import { FaTimes } from "react-icons/fa";
import { ADD_TAB } from "../utils/actions";
import { generateId } from "../utils/generateId";
const History = ({ active, tabsDispatch, searchHistory, setHistory }) => {
  const sortedKeys = Object.keys(searchHistory).sort((a, b) => {
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
  const renderHistoryItems = (items) =>
    items.map(({ id, url, time }) => (
      <li key={id} className="item">
        <div className="item-content">
          <p className="time">{new Date(time).toLocaleTimeString()}</p>
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
            removeFromSearchHistroy(id);
            setHistory(categorizeByDate(getSearchHistory()));
          }}
        >
          <FaTimes />
        </button>
      </li>
    ));
  const renderHistoryCategories = () =>
    sortedKeys.length > 0 ? (
      sortedKeys.map((key) => (
        <li key={key} className="category">
          <h4>{key}</h4>
          <ul className="marks">{renderHistoryItems(searchHistory[key])}</ul>
        </li>
      ))
    ) : (
      <div>History is empty.</div>
    );
  return (
    <div id="search-history" className={`${active && "active-history"}`}>
      <ul id="categories-list">{renderHistoryCategories()}</ul>
    </div>
  );
};

export default History;
