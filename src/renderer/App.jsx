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
import {
  CLOSE_WINDOW,
  CREATE_WINDOW,
  GET_AUTH_INFO,
  GET_BOOKMARKS,
  GET_CURRENT_TABS,
  GET_LOGIN_INFO,
  GET_SEARCH_HISTORY,
  mergeChannel,
  RESET_ALL_TABS,
  WINDOW_READY,
} from "../constants/global/channels";
import { getLocalStorage } from "../utils/localstorage";

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
  const [menu, setMenu] = useState(false);
  const initValue = getLocalStorage("initValue");
  const [ref, setRef] = useState(1);
  const initLoad = initValue.initLoad;
  const dialIsOpen = initValue.dialIsOpen;
  useEffect(() => {
    window.api.receive(WINDOW_READY, async (id) => {
      window.id = id;
      window.api.receive(mergeChannel(GET_CURRENT_TABS, id), async (tabs) => {
        try {
          if (initLoad == 1 && dialIsOpen == false) {


            if (initLoad == 1 && dialIsOpen == false) {
              const result = await window.api.openDialog();
              if (result.response === 1) {
                await window.api.send(RESET_ALL_TABS, id);
                window.api.send(CLOSE_WINDOW, window.id);
                await window.api.send(CREATE_WINDOW);
              } else  {
                setRef(2);
                window.location.reload();
                tabsDispatch({
                  type: "SET_TABS",
                  payload: {
                    tabs,
                  },
                });
              }
            } else {
              tabsDispatch({
                type: "SET_TABS",
                payload: {
                  tabs,
                },
              });
            }
          } else {
                       tabsDispatch({
              type: "SET_TABS",
              payload: {
                tabs,
              },
            });
          }
        } catch (error) {
          console.error("please review the folllowng error:", error);
        }
      });

      window.api.receive(GET_SEARCH_HISTORY, (searchHistoryVal) => {
        searchHistoryDispatcher({
          type: SET_SEARCH_HISTORY,
          payload: {
            searchHistory: searchHistoryVal,
          },
        });
      });
      window.api.receive(mergeChannel(GET_LOGIN_INFO, id), (info) => {
        setLoginDialogInfo(info);
      });
      window.api.receive(GET_BOOKMARKS, (bookmarks) => {
        bookmarksDispatcher({
          type: SET_BOOKMARKS,
          payload: {
            bookmarks,
          },
        });
      });
      window.api.receive(GET_AUTH_INFO, (info) => {
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

    // setLocalStorage('initValue',3)
  }, [openSidebar, ref]);

  const handleCloseThreeButtonMenu = () => {
    if (menu === true) setMenu(false);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (window.api && window.api.platform === 'darwin' && window.api.macOSVersion) {
      document.documentElement.setAttribute('data-macos-version', window.api.macOSVersion.toString());
    }
    if (storedTheme) {
      document.querySelector("#root").setAttribute("data-theme", storedTheme);
    }
  }, []);

  return (
    <div onClick={handleCloseThreeButtonMenu}>
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
            setMenu={setMenu}
            menu={menu}
          ></Home>
        </Route>
        <Route exact path="/settings">
          <Settings
            passwords={passwords}
            passwordsDispatch={passwordsDispatch}
            bookmarksDispatcher={bookmarksDispatcher}
            bookmarks={bookmarks}
            searchHistory={searchHistory}
            searchHistoryDispatcher={searchHistoryDispatcher}
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
