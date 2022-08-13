import React from "react";
import { VscLoading } from "react-icons/vsc";
const LoadingIndicator = () => {
  return (
    <div className="loading-indicator">
      <VscLoading fontWeight="bold" fontSize="20px" color="#fff" />
    </div>
  );
};

export default LoadingIndicator;
