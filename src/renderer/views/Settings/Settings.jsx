import React from "react";
import EmptyList from "../../components/EmptyList/EmptyList.jsx";
import Layout from "../../components/Layout/Layout.jsx";
import PasswordItem from "../../components/PasswordItem/PasswordItem.jsx";
import SettingsSidebar from "../../components/SettingsSidebar/SettingsSidebar.jsx";
import "./settings.css";

const Settings = ({ passwords, passwordsDispatch }) => {
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
    <Layout>
      <div class="settings">
        <SettingsSidebar />
        <div id="settings-content">{renderAuthInfo()}</div>
      </div>
    </Layout>
  );
};

export default Settings;
