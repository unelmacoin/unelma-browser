import React from "react";
import historyIcon from "../../img/history-icon.png";

const HistoryList = ({ item, parsedUrl, handleAddTabClick }) => {
  return (
    <li>
      <img
        className="historyicon"
        src={historyIcon}
        alt="history icon"
        height={20}
        width={20}
      />
      <a className="list-link" onClick={() => handleAddTabClick(item)}>
        {parsedUrl(item)}
      </a>
    </li>
  );
};

export default HistoryList;
