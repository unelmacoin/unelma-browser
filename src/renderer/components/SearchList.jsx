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

const SearchList = ({ handleClose, tabsDispatch, setShowSearchList }) => {
  const [searchHistory, searchHistoryDispatcher] = useReducer(
    searchHistoryReducer,
    []
  );

  const getSearchHistory = () => {
    try {
      window.api.receive(GET_SEARCH_HISTORY, (searchHistoryVal) => {
        searchHistoryDispatcher({
          type: SET_SEARCH_HISTORY,
          payload: {
            searchHistory: searchHistoryVal,
          },
        });
        // Set searchHistory to local storage.
        localStorage.setItem("searchHistory", JSON.stringify(searchHistoryVal));
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // fetch search history from the local storage -- if available.
    const savedSearchHistory = localStorage.getItem("searchHistory");
    if (savedSearchHistory) {
      const parsedSearchHistory = JSON.parse(savedSearchHistory);
      searchHistoryDispatcher({
        type: SET_SEARCH_HISTORY,
        payload: {
          searchHistory: parsedSearchHistory,
        },
      });
    } else {
      getSearchHistory();
    }
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
    setShowSearchList(false);
  };

  return (
    searchHistory.length > 0 && (
      <>
        <div className="btn-container">
          <p style={{ fontWeight: "bold", paddingLeft: "1rem" }}>
            Top Searches
          </p>
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
      </>
    )
  );
};

export default SearchList;
