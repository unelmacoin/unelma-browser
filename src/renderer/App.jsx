import React, { useEffect, useReducer, useState } from "react";
import SavePasswordDialog from "./components/SavePasswordDialog.jsx";
import Sidebar from "./components/Sidebar.jsx";
import TopBar from "./components/TopBar.jsx";
import Webview from "./components/Webview.jsx";
import tabReducer from "./reducers/tabReducer";
import {
  SET_BOOKMARKS,
  SET_PASSWORDS,
  SET_SEARCH_HISTORY,
  SET_TABS,
} from "../constants/renderer/actions";
import Bookmarks from "./views/Bookmarks.jsx";
import History from "./views/History.jsx";
import Settings from "./views/Settings/Settings.jsx";
import passwordsReducer from "./reducers/passwordsReducer.js";
import bookmarksReducer from "./reducers/bookmarksReducer.js";
import searchHistoryReducer from "./reducers/searchHistoryReducer.js";
import { defaultTab } from "./utils/tabs.js";

const App = () => {
  const [openSidebar, setOpenSidebar] = useState(true);
  const [tabs, tabsDispatch] = useReducer(tabReducer, [defaultTab(0)]);
  const [bookmarks, bookmarksDispatcher] = useReducer(bookmarksReducer, []);
  const [searchHistory, searchHistoryDispatcher] = useReducer(
    searchHistoryReducer,
    []
  );
  const [passwords, passwordsDispatch] = useReducer(passwordsReducer, []);
  const [loginDialogInfo, setLoginDialogInfo] = useState();
  useEffect(() => {
    window.api.receive("window-ready", (id) => {
      window.id = id;
      window.api.receive("get-current-tabs", (tabs) => {
        tabsDispatch({
          type: SET_TABS,
          payload: {
            tabs,
          },
        });
      });

      window.api.receive("get-search-history", (searchHistoryVal) => {
        searchHistoryDispatcher({
          type: SET_SEARCH_HISTORY,
          payload: {
            searchHistory: searchHistoryVal,
          },
        });
      });
      window.api.receive("get-bookmarks", (bookmarks) => {
        bookmarksDispatcher({
          type: SET_BOOKMARKS,
          payload: {
            bookmarks,
          },
        });
      });
      window.api.receive("get-auth-info", (info) => {
        passwordsDispatch({
          type: SET_PASSWORDS,
          payload: {
            passwords: info,
          },
        });
      });
      window.addEventListener("resize", function () {
        document.getElementById("root").style.height =
          window.innerHeight + "px";
      });
    });
    if (
      passwords.find(
        (info) =>
          info.password === loginDialogInfo?.password &&
          info.username === loginDialogInfo?.username &&
          info.site === loginDialogInfo?.site
      )
    )
      setLoginDialogInfo(null);
  }, [loginDialogInfo]);
  const renderTabs = () =>
    tabs.map(({ id, url, active, type }) =>
      type === "webview" ? (
        <Webview
          key={id}
          url={url}
          id={id}
          passwords={passwords}
          active={active}
          tabsDispatch={tabsDispatch}
          setLoginDialogInfo={setLoginDialogInfo}
          searchHistoryDispatcher={searchHistoryDispatcher}
        />
      ) : type === "bookmarks" ? (
        <Bookmarks
          key={id}
          active={active}
          tabsDispatch={tabsDispatch}
          bookmarks={bookmarks}
          bookmarksDispatcher={bookmarksDispatcher}
        />
      ) : type === "history" ? (
        <History
          key={id}
          active={active}
          tabsDispatch={tabsDispatch}
          searchHistory={searchHistory}
          searchHistoryDispatcher={searchHistoryDispatcher}
        />
      ) : (
        <Settings
          key={id}
          passwords={passwords}
          passwordsDispatch={passwordsDispatch}
          active={active}
        />
      )
    );
  const renderSavePasswordDialog = () =>
    loginDialogInfo &&
    !passwords.find(
      (info) =>
        info.password === loginDialogInfo.password &&
        info.username === loginDialogInfo.username &&
        info.site === loginDialogInfo.site
    ) && (
      <SavePasswordDialog
        info={loginDialogInfo}
        setLoginDialogInfo={setLoginDialogInfo}
        passwordsDispatch={passwordsDispatch}
      />
    );

  return (
    <div id="root" style={{ height: `${window.window.innerHeight}px` }}>
      <Sidebar
        tabs={tabs}
        tabsDispatch={tabsDispatch}
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
        bookmarksDispatcher={bookmarksDispatcher}
        bookmarks={bookmarks}
      />
      <div
        id="webviews-container"
        className={`${!openSidebar && "toggled-container"}`}
      >
        {renderSavePasswordDialog()}
        {renderTabs()}
      </div>
      <TopBar />
    </div>
  );
};

export default App;
