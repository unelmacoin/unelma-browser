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
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [duration, setDuration] = useState("");
  const [books, setBooks] = useState(bookmarks);
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

  const handleDelete = (e) => {
    e.preventDefault();
    const confirmation = window.prompt(
      "This action is Irreversible. To confirm deletion, type 'DEL' and press OK:"
    );
    if (confirmation === "DEL") {
    if (duration > 0) {
      for (let selectedOption of selectedOptions) {
        switch (selectedOption) {
          case "password":
            const passwordFilters = filterByDays(passwords, duration);
            for (let passwordFilter of passwordFilters) {
              passwordsDispatch({
                type: REMOVE_PASSWORD,
                payload: {
                  id: passwordFilter.id,
                },
              });
            }
            break;
          case "cookies":
            break;
          case "cache":
            break;

          case "history":
            const historyFilters = filterByDays(searchHistory, duration);
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
            const bookmarkFilters = filterByDays(bookmarks, duration);
            for (let bookmarkFilter of bookmarkFilters) {
              bookmarksDispatcher({
                type: REMOVE_BOOKMARK,
                payload: {
                  url: bookmarkFilter.url,
                },
              });
            }

            break;
          default:
            break;
        }
      }
    } else {
      const books =
        JSON.stringify(bookmarks) ||
        bookmarks.length ||
        JSON.stringify(searchHistory) ||
        "no bookmarks";
      alert(books);
    }
  }
    else {
      alert("Deletion cancelled");
    }
  };

  function filterByDays(items, maxDays) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - maxDays); //get the base to start deleting from

    return items.filter((item) => {
      const time = new Date(item.time); //get item.time from the array and asign it to time
      return time >= cutoff; //filter all the item with date freater than the base to be deleted
    });
  }

  return (
    <div className="container">
      {/* <>
      {books && books.map(hist =>
        <li key={hist.id}>{hist.url}, {hist.time.toString()}</li>)}
      </> */}
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
            value="cookies"
            onChange={handleOptionChange}
          />
          Cookies
        </label>
        <br />
        <label>
          <input type="checkbox" value="cache" onChange={handleOptionChange} />
          Cache
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
