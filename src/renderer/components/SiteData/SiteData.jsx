import React, { useState } from "react";
import "./siteData.css";
import {
  REMOVE_BOOKMARK,
  REMOVE_PASSWORD,
  REMOVE_SEARCH_HISTORY,
} from "../../../constants/renderer/actions";
import Modal from "../Modal.jsx";

const SiteData = ({
  bookmarks,
  bookmarksDispatcher,
  passwordsDispatch,
  passwords,
  searchHistory,
  searchHistoryDispatcher,
}) => {
  const checkboxValues = ["passwords", "history", "bookmark", "cacheData"];
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [duration, setDuration] = useState("");
  const [inputText, setInputText] = useState("");
  const [showModal, setShowModal] = useState(false);

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

  const inputChangeHandler = (e) => {
    setInputText(e.target.value.trim());
  };

  const deletetionSuccessNotification = () => {
    setShowModal(false);
    alert(`${selectedOptions.join(", ").toString()} successfully deleted.`);
    setSelectedOptions([]);
    setDuration("");
    setInputText("");
  };

  const closeModalHandler = () => {
    setShowModal(false);
    setInputText("");
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      if (selectedOptions.length > 0) {
        setShowModal(true);
        if (inputText === "DEL") {
          for (let selectedOption of selectedOptions) {
            switch (selectedOption) {
              case "passwords":
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
              case "bookmark":
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
          deletetionSuccessNotification();
        }
      } else {
        alert("Make a selection to delete.");
      }
    } catch (error) {
      console.log(error);
      setShowModal(false);
      alert("Deletion process cancelled.");
    }
  };

  const filterByDays = (items, maxDays) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - maxDays);

    return items.filter((item) => {
      const time = new Date(item.time);
      return time >= cutoff;
    });
  };

  return (
    <div className="browserData-container" style={{ position: "relative" }}>
      <h2 className="browserData-container__header">Clear Browser Data</h2>
      <form className="options">
        {checkboxValues.map((value) => (
          <div key={value} className="inputSet">
            <label htmlFor={value}>Delete {value}</label>
            <input
              id={value}
              type="checkbox"
              value={value}
              checked={selectedOptions.includes(value)}
              onChange={(e) => handleOptionChange(e)}
            />
          </div>
        ))}
        <div className="inputSet">
          <label htmlFor="duration">
            Choose duration in days, starting from today
          </label>
          <input
            type="number"
            value={duration}
            onChange={handleDurationChange}
            placeholder="No. of days e.g. 3"
            title="Previous number('s) of days data will be deleted"
          />
        </div>
        <button
          disabled={selectedOptions.length <= 0}
          className={`deleteButton ${
            selectedOptions.length <= 0 ? "disabled" : ""
          }`}
          onClick={(e) => handleDelete(e)}
        >
          Delete
        </button>
      </form>
      {showModal && (
        <Modal
          changeHandler={inputChangeHandler}
          deleteHandler={handleDelete}
          closeModalHandler={closeModalHandler}
          inputText={inputText}
        />
      )}
    </div>
  );
};

export default SiteData;
