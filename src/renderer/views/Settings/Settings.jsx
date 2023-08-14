import React, { useState } from "react";
import EmptyList from "../../components/EmptyList/EmptyList.jsx";
import Layout from "../../components/Layout/Layout.jsx";
import PasswordItem from "../../components/PasswordItem/PasswordItem.jsx";
import { settingsSidebarMenuItems } from "../../../constants/renderer/menus";
// import SettingsSidebar from "../../components/SettingsSidebar/SettingsSidebar.jsx";
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
  const [activeItem, setActiveItem] = useState(settingsSidebarMenuItems[0].id);

  const settingMainWindow = () => {
    switch (renderTab) {
      case "password":
        return passwords.length > 0 ? (
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
        break;
      case "clearCache":
        return <SiteData 
        passwords={passwords}
        passwordsDispatch={passwordsDispatch}
        bookmarksDispatcher={bookmarksDispatcher}
        bookmarks={bookmarks}
        searchHistory={searchHistory}
        searchHistoryDispatcher={searchHistoryDispatcher}
        />;
        break;
      default:
        return <BrowserSettingsPage />;
        break;
    }
  };

  // render menu on the sidebar

  return (
    <Layout>
      <div class="settings">
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
