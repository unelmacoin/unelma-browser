import React from "react";
import { FaTimes } from "react-icons/fa";
import { ACTIVATE_TAB, REMOVE_TAB } from "../../constants/renderer/actions";
import { handleFavicon } from "../utils/handleFavicon";
import LoadingIndicator from "./LoadingIndicator.jsx";
const Tab = ({ id, title, active, tabsDispatch, loading, url, type }) => {
  const handleClose = () => {
    tabsDispatch({ type: REMOVE_TAB, payload: { id } });
  };
  const closeNodes = ["path", "svg", "BUTTON"];
  const handleActivateTab = (e) => {
    if (closeNodes.find((elm) => elm === e.target.nodeName)) {
      handleClose();
    } else {
      tabsDispatch({
        type: ACTIVATE_TAB,
        payload: { id, windowId: window.id },
      });
    }
  };
  return (
    <div
      id={`tab-${id}`}
      onClick={handleActivateTab}
      className={`tab ${active && "active-tab"}`}
    >
      {loading ? (
        <LoadingIndicator />
      ) : (
        <img src={handleFavicon(url, type)} alt="favicon" />
      )}
      <p>{title}</p>
      <button className="close">
        <FaTimes />
      </button>
    </div>
  );
};

export default Tab;
