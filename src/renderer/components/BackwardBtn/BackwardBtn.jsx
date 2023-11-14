import React from "react";
import { HiArrowLeft } from "react-icons/hi";
import { Link } from "react-router-dom";
import { mergeChannel, SHOW_VIEWS } from "../../../constants/global/channels";
import "./backward-btn.css";
const BackwardBtn = () => {
  const handleClick = () => {
    window.api.send(mergeChannel(SHOW_VIEWS, window.id));
  };
  return (
    <button className="backward-btn" onClick={handleClick}>
      <Link to="/">
        <HiArrowLeft fontSize="20px" />
      </Link>
    </button>
  );
};

export default BackwardBtn;
