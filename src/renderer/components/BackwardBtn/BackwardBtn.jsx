import React from "react";
import { HiArrowLeft } from "react-icons/hi";
import { Link } from "react-router-dom";
import "./backward-btn.css";
const BackwardBtn = () => {
  const handleClick = () => {
    window.api.send("show-views" + window.id);
  };
  return (
    <button className="backward-btn" onClick={handleClick}>
      <Link exact to="/">
        <HiArrowLeft fontSize='20px'/>
      </Link>
    </button>
  );
};

export default BackwardBtn;
