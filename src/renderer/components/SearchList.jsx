import React from "react";
import earth from "../../img/earth-icon.png";
import rightArrow from "../../img/arrow-right-icon.png";
import close from "../../img/close-icon.png";

const SearchList = ({ handleClose }) => {
  return (
    <div className="suggestion-container">
      <div className="btn-container">
        <p style={{fontWeight:"bold"}}>Top-3 Searches</p>
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
          <li>
            <img
              className="list-image"
              src={earth}
              alt="earth icon"
              width={20}
              height={20}
              aria-disabled
            />
            <a className="list-link" href="/">
              Google
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
          <li>
            <img
              className="list-image"
              src={earth}
              alt="earth icon"
              width={20}
              height={20}
              aria-disabled
            />
            <a className="list-link" href="/">
              Google
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
          <li>
            <img
              className="list-image"
              src={earth}
              alt="earth icon"
              width={20}
              height={20}
              aria-disabled
            />
            <a className="list-link" href="/">
              Google
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
        </ul>
      </div>
    </div>
  );
};

export default SearchList;
