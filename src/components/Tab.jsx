import React from "react";
import { FaTimes } from "react-icons/fa";
import { ACTIVATE_TAB, REMOVE_TAB } from "../utils/actions";
import LoadingIndicator from "./LoadingIndicator.jsx";
const Tab = ({ id, favIcon, title, active, tabsDispatch, loading }) => {
  const handleClose = () => {
    tabsDispatch({ type: REMOVE_TAB, id });
  };
  const closeNodes = ["path", "svg", "BUTTON"];
  const handleActivateTab = (e) => {
    if (closeNodes.find((elm) => elm === e.target.nodeName)) {
      handleClose();
    } else {
      tabsDispatch({ type: ACTIVATE_TAB, id });
    }
  };
  return (
    <div
      id={`tab-${id}`}
      onClick={handleActivateTab}
      className={`tab ${active && "active-tab"}`}
    >
      {loading ? <LoadingIndicator /> : <img src={favIcon} alt="favicon" />}
      <p>{title}</p>
      <button className="close">
        <FaTimes />
      </button>
    </div>
  );
};

export default Tab;
