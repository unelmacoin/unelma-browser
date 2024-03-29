import React, { useState } from "react";
import EmptyList from "../../components/EmptyList/EmptyList.jsx";
import Layout from "../../components/Layout/Layout.jsx";
import PasswordItem from "../../components/PasswordItem/PasswordItem.jsx";
import AddPassword from "../../components/AddPassword.jsx";
import { settingsSidebarMenuItems } from "../../../constants/renderer/menus";
import "./settings.css";
import SiteData from "../../components/SiteData/SiteData.jsx";
import SettingsSidebar from "../../components/SettingsSidebar/SettingsSidebar.jsx";
import BrowserSettingsPage from "./BrowserSettingsPage.jsx";

const Settings = ({
  passwords,
  passwordsDispatch,
  bookmarksDispatcher,
  bookmarks,
  searchHistory,
  searchHistoryDispatcher,
}) => {
  const [renderTab, setRenderTab] = useState();
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [activeItem, setActiveItem] = useState(settingsSidebarMenuItems[0].id);

  const passwordsContainer = (
    <div className="passwords-container">
      {passwords.length > 0 ? (
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
        <EmptyList label="Password list" />
      )}
      {showAddPassword && (
        <AddPassword hideModal={() => setShowAddPassword(false)} />
      )}
    </div>
  );

  const settingMainWindow = () => {
    switch (renderTab) {
      case "password":
        return (
          <div className="passwords-wrapper">
            <h2 className="passwords-header">Saved Passwords</h2>
            <button
              className="add-password"
              onClick={() => setShowAddPassword(true)}
            >
              &#43; Add Password
            </button>
            {passwordsContainer}
          </div>
        );
      case "clearCache":
        return (
          <SiteData
            passwords={passwords}
            passwordsDispatch={passwordsDispatch}
            bookmarksDispatcher={bookmarksDispatcher}
            bookmarks={bookmarks}
            searchHistory={searchHistory}
            searchHistoryDispatcher={searchHistoryDispatcher}
          />
        );

      default:
        return <BrowserSettingsPage />;
    }
  };

  // render menu on the sidebar

  return (
    <Layout>
      <div className="settings">
        <SettingsSidebar
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          setRenderTab={setRenderTab}
        />
        <div id="settings-content">{settingMainWindow()}</div>
      </div>
    </Layout>
  );
};

export default Settings;
