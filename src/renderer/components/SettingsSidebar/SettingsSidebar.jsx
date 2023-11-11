import React from "react";
import { settingsSidebarMenuItems } from "../../../constants/renderer/menus";
import BackwardBtn from "../BackwardBtn/BackwardBtn.jsx";
import "./settingsSidebar.css";


const SettingsSidebar = ({ activeItem, setActiveItem, setRenderTab }) => {
  const renderItems = () => {
    try {
      return settingsSidebarMenuItems.map(({ id, name, label, icon }) =>
          <li
            key={id}
            className={`${id === activeItem ? "active" : ""}`}
            onClick={() => {
              setActiveItem(id);
              setRenderTab(name);
            }}
          >
            <span>{icon(id === activeItem)}</span>
            {label}
          </li>
        
      );
    } catch (error) {
      // Handle the error here (e.g., log the error or show an error message)
      console.error("Error while rendering sidebar items:", error.message);
      return null; // or return a fallback UI component
    }
  };

  return (
    <div id="settingsSidebar">
      <BackwardBtn />
      <ul>{renderItems()}</ul>
    </div>
  );
};

export default SettingsSidebar;
