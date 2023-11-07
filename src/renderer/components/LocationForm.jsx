import React, { useEffect, useState } from "react";
import { GO_TO_LOCATION, mergeChannel } from "../../constants/global/channels";
import { UNELMA_DEFAULT_URL } from "../../constants/global/urls";
import { UPDATE_ACTIVE_TAB } from "../../constants/renderer/actions";
import { handleSearch } from "../utils/handleSearch";
import SearchList from "./SearchList.jsx";

const LocationForm = ({ tabsDispatch, tabs }) => {
  const activeTabURL = tabs.find((tab) => tab.active)?.url;
  const [location, setLocation] = useState(UNELMA_DEFAULT_URL);
  const [showSearchList, setShowSearchList] = useState(false);

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
    window.api.send(
      mergeChannel(GO_TO_LOCATION, window.id),
      handleSearch(location)
    );
    setShowSearchList(false); // Close search suggestions in url submit/search **
  };

  const handleInputFocus = () => {
    setTimeout(() => {
      setShowSearchList(true), 200;
    });
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSearchList(false), 200);
  };

  useEffect(() => {
    setLocation(activeTabURL || UNELMA_DEFAULT_URL);
  }, [tabs]);

  return (
    <div className="location-container">
      <form
        id="location-form"
        onSubmit={handleSubmit}
        onClick={handleInputFocus}
        onBlur={handleInputBlur}
      >
        <input
          id="location-input"
          type="text"
          value={location}
          onChange={handleChange}
          placeholder={location ? "" : "Search with Google or enter address…"}
        />
      </form>
      <SearchList
        handleClose={() => setShowSearchList(false)}
        tabsDispatch={tabsDispatch}
        setShowSearchList={() => setShowSearchList(false)}
        showSearchList={showSearchList}
      />
    </div>
  );
};

export default LocationForm;
