import React from "react";
import EmptyList from "../../components/EmptyList/EmptyList.jsx";
import PasswordItem from "../../components/PasswordItem/PasswordItem.jsx";
import SettingsSidebar from "../../components/SettingsSidebar/SettingsSidebar.jsx";
import "./settings.css";

const Settings = ({ passwords, active, passwordsDispatch }) => {
  const renderAuthInfo = () =>
    passwords.length > 0 ? (
      passwords.map(({ id, site, password, username }) => (
        <PasswordItem
          key={id}
          site={site}
          password={password}
          username={username}
          id={id}
          passwordsDispatch={passwordsDispatch}
        />
      ))
    ) : (
      <EmptyList label="password list" />
    );
  return (
    <div id="settings" className={`${active && "active-settings"}`}>
      <SettingsSidebar />
      <div id="settings-content">{renderAuthInfo()}</div>
    </div>
  );
};

export default Settings;
