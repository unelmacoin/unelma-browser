import React from "react";
import "./empty-list.css";

const EmptyList = ({ label }) => {
  return <div id="empty-list">{label} is empty!</div>;
};

export default EmptyList;
