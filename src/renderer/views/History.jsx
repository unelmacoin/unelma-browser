import React from "react";
import "../css/history.css";
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
  const renderHistoryItems = (items) =>
    items.map(({ id, url, time }) => (
      <li key={id} className="item">
        <div className="item-content">
          <p className="time">{dateFormat(new Date(time), "h:MM TT")}</p>
          <button
            onClick={() => {
               window.api.send(mergeChannel(ADD_VIEW, window.id), {
                 id: uniqid(),
                 url,
               });
               document.querySelector(".backward-btn a").click();
            }}
          >
            {url.length > 40 ? `${url.slice(0, 40)}...` : url}
          </button>
        </div>
        <button
          onClick={() => {
            searchHistoryDispatcher({
              type: REMOVE_SEARCH_HISTORY,
              payload: {
                id,
              },
            });
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
      <div id="search-history">
        <BackwardBtn />
        <ul id="categories-list">{renderHistoryCategories()}</ul>
      </div>
    </Layout>
  );
};

export default History;
