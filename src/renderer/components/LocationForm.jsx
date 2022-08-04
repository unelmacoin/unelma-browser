import React, { useEffect, useState } from "react";
import { UPDATE_ACTIVE_TAB } from "../../constants/renderer/actions";
import { handleSearch } from "../utils/handleSearch";

const LocationForm = ({ tabsDispatch, tabs }) => {
  const activeTabURL = tabs.find((tab) => tab.active)?.url;
  const [location, setLocation] = useState("https://www.unelma.xyz/");
  const handleChange = (e) => {
    setLocation(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    tabsDispatch({
      type: UPDATE_ACTIVE_TAB,
      payload: { tab: { url: handleSearch(location) } },
    });
    setLocation(handleSearch(location));
  };
  useEffect(() => {
    setLocation(activeTabURL || "https://www.unelma.xyz/");
  }, [tabs]);
  return (
    <div className="location-container">
      <form id="location-form" onSubmit={handleSubmit}>
        <input
          id="location-input"
          type="text"
          value={location}
          onChange={handleChange}
        />
      </form>
    </div>
  );
};

export default LocationForm;
