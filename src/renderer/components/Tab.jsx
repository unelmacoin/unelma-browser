import React from "react";
import { FaTimes } from "react-icons/fa";
import {
  ACTIVATE_VIEW,
  mergeChannel,
  REMOVE_VIEW,
} from "../../constants/global/channels";
import { ACTIVATE_TAB, CLOSE_TAB } from "../../constants/renderer/actions";
import { handleFavicon } from "../utils/handleFavicon";
import LoadingIndicator from "./LoadingIndicator.jsx";
const Tab = ({
  id,
  title,
  active,
  tabsDispatch,
  loading,
  url,
  type,
  fail,
  workspaceId,
}) => {
  const handleClose = () => {
    tabsDispatch({ type: CLOSE_TAB, payload: { tabId: id, workspaceId } });
  };
  const closeNodes = ["path", "svg", "BUTTON"];
  const handleActivateTab = (e) => {
    if (closeNodes.find((elm) => elm === e.target.nodeName)) {
      handleClose();
      window.api.send(mergeChannel(REMOVE_VIEW, window.id), id);
    } else {
      window.api.send(mergeChannel(ACTIVATE_VIEW, window.id), id);
      tabsDispatch({
        type: ACTIVATE_TAB,
        payload: { tabId: id, workspaceId },
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
        <img src={handleFavicon(url, type, fail)} alt="favicon" />
      )}
      <p>{title}</p>
      <button className="close">
        <FaTimes />
      </button>
    </div>
  );
};

export default Tab;
