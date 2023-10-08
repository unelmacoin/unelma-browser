import React, { useEffect, useReducer } from "react";
import { GET_SEARCH_HISTORY } from "../../constants/global/channels";
import { SET_SEARCH_HISTORY } from "../../constants/renderer/actions";
import HistoryList from "./HistoryList.jsx";
import close from "../../img/close-icon.png";
import searchHistoryReducer from "../reducers/searchHistoryReducer";

const SearchList = ({ handleClose }) => {
  const [searchHistory, searchHistoryDispatcher] = useReducer(
    searchHistoryReducer,
    []
  );

  const getSearchHistory = async () => {
    try {
      await window.api.receive(GET_SEARCH_HISTORY, (searchHistoryVal) => {
        searchHistoryDispatcher({
          type: SET_SEARCH_HISTORY,
          payload: {
            searchHistory: searchHistoryVal,
          },
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
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

  searchHistory.sort((a, b) => urlOccurrences[b.url] - urlOccurrences[a.url]);
  const top3urls = Object.entries(urlOccurrences)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 3)
    .map(([url]) => url);

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
              <HistoryList key={i} item={url} parsedUrl={parsedUrl} />
            ))}
          </ul>
        </div>
      </>
    )
  );
};

export default SearchList;
