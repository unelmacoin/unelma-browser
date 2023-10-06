import React from "react";
import { useSelector } from "react-redux";
import earth from "../../img/earth-icon.png";
import rightArrow from "../../img/arrow-right-icon.png";
import close from "../../img/close-icon.png";

const SearchList = ({ handleClose }) => {
  const searchHistory = useSelector((state) => state.searchHistory);
  console.log(searchHistory);

  // const searchHistory = [
  //   { id: 1, url: "sample url", website: "sample website" },
  //   { id: 1, url: "sample url", website: "sample website" },
  //   { id: 1, url: "sample url", website: "sample website" },
  // ];

  const renderHistoryList = (items) =>
    items.map(({ id, url, website }) => (
      <li key={id}>
        <img
          className="list-image"
          src={earth}
          alt="earth icon"
          width={20}
          height={20}
          aria-disabled
        />
        <a className="list-link" href={url} target="_blank noreferer">
          {website}
        </a>
        <img
          className="list-image"
          src={rightArrow}
          alt="right arrow icon"
          aria-disabled
          width={20}
          height={20}
        />
      </li>
    ));

  return (
    <div className="suggestion-container">
      <div className="btn-container">
        <p style={{ fontWeight: "bold", paddingLeft: "1rem" }}>Top Searches</p>
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
        <ul>{renderHistoryList(searchHistory)}</ul>
      </div>
    </div>
  );
};

export default SearchList;
