import React, { useEffect, useReducer } from "react";
import {
  GET_SEARCH_HISTORY,
  ADD_VIEW,
  ADD_TAB,
  mergeChannel,
} from "../../constants/global/channels";
import { SET_SEARCH_HISTORY } from "../../constants/renderer/actions";
import { defaultTab } from "../utils/tabs";
import searchHistoryReducer from "../reducers/searchHistoryReducer";
import HistoryList from "./HistoryList.jsx";
import close from "../../img/close-icon.png";
import "../css/SearchList.css";

const SearchList = ({
  handleClose,
  tabsDispatch,
  showSearchList,
  setShowSearchList,
}) => {
  const [searchHistory, searchHistoryDispatcher] = useReducer(
    searchHistoryReducer,
    []
  );

  useEffect(() => {
    const getSearchHistory = async () => {
      try {
        const receiveCallback = (searchHistoryVal) => {
          searchHistoryDispatcher({
            type: SET_SEARCH_HISTORY,
            payload: {
              searchHistory: searchHistoryVal,
            },
          });
        };

        // Subscribe to the event
        window.api.receive(GET_SEARCH_HISTORY, receiveCallback);

        return receiveCallback; // Return the callback for later cleanup
      } catch (error) {
        console.log(error);
      }
    };
    getSearchHistory();
  }, []);

  // Get url hostname
  const parsedUrl = (url) => {
    const link = new URL(url);
    let hostName = link.hostname;
    hostName = hostName.replace(/^https?:\/\//, "");
    return hostName;
  };

  // Getting top 3 urls
  const urlOccurrences = {};
  //counting url ocurrences for each url
  searchHistory.forEach((search) => {
    const url = search.url;
    urlOccurrences[url] = (urlOccurrences[url] || 0) + 1;
  });
  // Sorting according to ocurrences

  searchHistory.sort((a, b) => urlOccurrences[b.url] - urlOccurrences[a.url]);
  const top3urls = Object.entries(urlOccurrences)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 3)
    .map(([url]) => url);

  const handleAddTab = (url) => {
    const newTab = defaultTab(window.id, url);
    window.api.send(mergeChannel(ADD_VIEW, window.id), { ...newTab });
    tabsDispatch({
      type: ADD_TAB,
      payload: {
        tab: { ...newTab },
      },
    });
    console.log("new tab added");
    setShowSearchList(false);
  };

  return (
    <div
      className={`suggestion-container ${
        !showSearchList ||
        searchHistory.length === 0 ||
        searchHistory === undefined
          ? "hide"
          : ""
      }`}
    >
      <div className="btn-container">
        <p style={{ paddingLeft: "1rem" }}>Top Searches</p>
        <button className="btn-container__close-btn" onClick={handleClose}>
          <img
            src={close}
            alt="close icon"
            width={20}
            height={20}
            aria-label="close icon"
          />
        </button>
      </div>
      <div className="suggestion-container__list">
        <ul>
          {top3urls.map((url, i) => (
            <HistoryList
              key={i}
              item={url}
              parsedUrl={parsedUrl}
              handleAddTabClick={() => handleAddTab(url)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchList;
