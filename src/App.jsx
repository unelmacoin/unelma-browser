const { ipcRenderer } = window.require("electron");
import React, { useEffect, useReducer, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import TopBar from "./components/TopBar.jsx";
import Webview from "./components/Webview.jsx";
import tabReducer from "./reducers/tabReducer";
import { SET_TABS } from "./utils/actions";
import { categorizeByDate } from "./utils/categorize";
import {
  getBookmarks,
  getCurrentTabs,
  getSearchHistory,
} from "./utils/handleLocalStorage";
import { defaultTab } from "./utils/tabs";
import Bookmarks from "./views/Bookmarks.jsx";
import History from "./views/History.jsx";

const App = () => {
  const [tabs, tabsDispatch] = useReducer(tabReducer, []);
  const [openSidebar, setOpenSidebar] = useState(true);
  const [bookmarks, setBookmarks] = useState(categorizeByDate(getBookmarks()));
  const [searchHistory, setSearchHistory] = useState(
    categorizeByDate(getSearchHistory())
    );
  useEffect(() => {
    ipcRenderer.on("window-ready", (_, id) => {
      window.id = id;
      tabsDispatch({
        type: SET_TABS,
        tabs:
          getCurrentTabs().length > 0
            ? [...getCurrentTabs()]
            : [{ ...defaultTab() }],
      });
      window.addEventListener("resize", function () {
        document.getElementById("root").style.height =
          window.innerHeight + "px";
      });
    });
  }, []);
  const renderTabs = () =>
    tabs.map(({ id, url, active, type }) =>
      type === "webview" ? (
        <Webview
          key={id}
          url={url}
          id={id}
          active={active}
          tabsDispatch={tabsDispatch}
          setSearchHistory={setSearchHistory}
        />
      ) : type === "bookmarks" ? (
        <Bookmarks
          key={id}
          active={active}
          tabsDispatch={tabsDispatch}
          bookmarks={bookmarks}
          setBookmarks={setBookmarks}
        />
      ) : (
        <History
          key={id}
          active={active}
          tabsDispatch={tabsDispatch}
          searchHistory={searchHistory}
          setHistory={setSearchHistory}
        />
      )
    );
  return (
    <div id="root" style={{ height: `${window.window.innerHeight}px` }}>
      <Sidebar
        tabs={tabs}
        tabsDispatch={tabsDispatch}
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
        setBookmarks={setBookmarks}
        bookmarks={bookmarks}
      />
      <div
        id="webviews-container"
        className={`${!openSidebar && "toggled-container"}`}
      >
        {renderTabs()}
      </div>
      <TopBar/>
    </div>
  );
};

export default App;
