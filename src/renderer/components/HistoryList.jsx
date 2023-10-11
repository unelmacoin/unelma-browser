import React from "react";
import historyIcon from "../../img/history-icon.png";

const HistoryList = ({ id, item, parsedUrl, handleAddTabClick }) => {

  return (
    <li key={id}>
      <img
        className="historyicon"
        src={historyIcon}
        alt="history icon"
        height={20}
        width={20}
      />
      <p className="list-link" onClick={() => handleAddTabClick(item)}>
        {parsedUrl(item)}
      </p>
    </li>
  );
};

export default HistoryList;
