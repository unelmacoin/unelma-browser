import React, { useEffect, useReducer, useState } from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import tabReducer from "./reducers/tabReducer";
import {
  SET_BOOKMARKS,
  SET_PASSWORDS,
  SET_SEARCH_HISTORY,
  SET_TABS,
} from "../constants/renderer/actions";
import passwordsReducer from "./reducers/passwordsReducer.js";
import bookmarksReducer from "./reducers/bookmarksReducer.js";
import searchHistoryReducer from "./reducers/searchHistoryReducer.js";
import { defaultTab } from "./utils/tabs.js";
import Home from "./views/Home/Home.jsx";
import Bookmarks from "./views/Bookmarks.jsx";
import History from "./views/History.jsx";
import Settings from "./views/Settings/Settings.jsx";

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
      window.api.receive("get-current-tabs" + id, (tabs) => {
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
      window.api.receive("get-login-info" + window.id, (info) => {
        setLoginDialogInfo(info);
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
  }, [openSidebar]);

  return (
    <div>
      <Router>
        <Route exact path="/">
          <Home
            loginDialogInfo={loginDialogInfo}
            setLoginDialogInfo={setLoginDialogInfo}
            tabsDispatch={tabsDispatch}
            bookmarksDispatcher={bookmarksDispatcher}
            openSidebar={openSidebar}
            setOpenSidebar={setOpenSidebar}
            bookmarks={bookmarks}
            tabs={tabs}
            searchHistory={searchHistory}
          ></Home>
        </Route>
        <Route exact path="/settings">
          <Settings
            passwords={passwords}
            passwordsDispatch={passwordsDispatch}
          />
        </Route>
        <Route exact path="/history">
          <History
            tabsDispatch={tabsDispatch}
            searchHistory={searchHistory}
            searchHistoryDispatcher={searchHistoryDispatcher}
          />
        </Route>
        <Route exact path="/bookmarks">
          <Bookmarks
            tabsDispatch={tabsDispatch}
            bookmarks={bookmarks}
            bookmarksDispatcher={bookmarksDispatcher}
          />
        </Route>
      </Router>
    </div>
  );
};

export default App;
