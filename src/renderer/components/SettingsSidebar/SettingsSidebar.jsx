import React, { useState } from "react";
import { settingsSidebarMenuItems } from "../../../constants/renderer/menus";
import "./settingsSidebar.css";

const SettingsSidebar = () => {
  const [activeItem, setActiveItem] = useState(settingsSidebarMenuItems[0].id);
  const handleSelect = (id) => () => {
    setActiveItem(id);
  };
  const renderItems = () =>
    settingsSidebarMenuItems.map(({ id, label, icon }) => (
      <li
        key={id}
        className={`${id === activeItem ? "active" : ""}`}
        onClick={handleSelect(id)}
      >
        <span>{icon(id === activeItem)}</span>
        {label}
      </li>
    ));
  return (
    <div id="settingsSidebar">
      <ul>{renderItems()}</ul>
    </div>
  );
};

export default SettingsSidebar;
