import React, { useState } from "react";
import "./siteData.css";
import {
  REMOVE_BOOKMARK,
  REMOVE_PASSWORD,
  REMOVE_SEARCH_HISTORY,
} from "../../../constants/renderer/actions";

const SiteData = ({
  bookmarks,
  bookmarksDispatcher,
  passwordsDispatch,
  passwords,
  searchHistory,
  searchHistoryDispatcher,
}) => {
  const smalltalk = require("smalltalk");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [duration, setDuration] = useState("");

  const handleOptionChange = (e) => {
    const optionValue = e.target.value;
    if (e.target.checked) {
      setSelectedOptions([...selectedOptions, optionValue]);
    } else {
      setSelectedOptions(
        selectedOptions.filter((option) => option !== optionValue)
      );
    }
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      if (selectedOptions.length > 0 ) {
      const confirmation = await smalltalk.prompt(
        "Confirmation",
        "This action is Irreversible. To confirm deletion, type 'DEL' and press OK:"
      );
      if (confirmation === "DEL") {
          for (let selectedOption of selectedOptions) {
            switch (selectedOption) {
              case "password":
                const passwordFilters =
                  duration > 0 ? filterByDays(passwords, duration) : passwords;
                for (let passwordFilter of passwordFilters) {
                  passwordsDispatch({
                    type: REMOVE_PASSWORD,
                    payload: {
                      id: passwordFilter.id,
                    },
                  });
                }
                break;
              case "history":
                const historyFilters =
                  duration > 0
                    ? filterByDays(searchHistory, duration)
                    : searchHistory;
                for (let historyFilter of historyFilters) {
                  searchHistoryDispatcher({
                    type: REMOVE_SEARCH_HISTORY,
                    payload: {
                      id: historyFilter.id,
                    },
                  });
                }
                break;

              case "bookmarks":
                const bookmarkFilters =
                  duration > 0 ? filterByDays(bookmarks, duration) : bookmarks;
                for (let bookmarkFilter of bookmarkFilters) {
                  bookmarksDispatcher({
                    type: REMOVE_BOOKMARK,
                    payload: {
                      url: bookmarkFilter.url,
                    },
                  });
                }

                break;
                case "cacheData":
                  try {
                    const result = await window.api.clearCacheAndCookies();
                    console.log(result); 
                  } catch (error) {
                    console.error(error); 
                  }
                  break;
              default:
                break;
            }
          }
          new Notification(
            `${selectedOptions.join(", ").toString()} : Deleted`
          );
   
      } else {
        new Notification("Confirmation Value Error");
      }
    } else {
      new Notification("Make a selection to Delete");
    }
    } catch (error) {
      console.log(error);
      new Notification("Deletion cancelled");
    }
  };

  function filterByDays(items, maxDays) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - maxDays);

    return items.filter((item) => {
      const time = new Date(item.time);
      return time >= cutoff;
    });
  }

  return (
    <div className="container">
      <h2>Clear Browser Data</h2>
      <div className="options">
        <label>
          <input
            type="checkbox"
            value="password"
            onChange={handleOptionChange}
          />
          Password
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            value="history"
            onChange={handleOptionChange}
          />
          History
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            value="bookmarks"
            onChange={handleOptionChange}
          />
          Bookmarks
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            value="cacheData"
            // checked={clearCacheChecked}
            onChange={handleOptionChange}
          />
          Clear Cache / Cookies
        </label>
      </div>
      <br />
      <div className="duration">
        <label>
          Duration (in days) to delete (starts from today):
          <input
            type="number"
            value={duration}
            onChange={handleDurationChange}
            placeholder="Days Number e.g. 3"
            title="Previous number('s) of days data will be deleted"
          />
        </label>
      </div>
      <br />
      <button className="deleteButton" onClick={(e) => handleDelete(e)}>
        Delete
      </button>
    </div>
  );
};

export default SiteData;
