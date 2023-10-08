import React from "react";
import historyIcon from "../../img/history-icon.png";

const HistoryList = ({ id, item, parsedUrl, handleAddTab }) => {
  return (
    <li key={id}>
      <img
        className="historyicon"
        src={historyIcon}
        alt="history icon"
        height={20}
        width={20}
      />
      <a className="list-link" href={item} target="_blank noreferer" onClick={handleAddTab}>
        {parsedUrl(item)}
      </a>
    </li>
  );
};

export default HistoryList;
