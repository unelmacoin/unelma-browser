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
    <Link to="/" className="backward-btn" onClick={handleClick}>
      <HiArrowLeft className="backward-btn__icon" />
      <span>Go Back</span>
    </Link>
  );
};

export default BackwardBtn;
