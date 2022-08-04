import React, { useEffect, useRef } from "react";
import {
  ADD_SEARCH_HISTORY,
  ADD_TAB,
  UPDATE_TAB,
} from "../../constants/renderer/actions";
import uniqid from "uniqid";
import { defaultTab } from "../utils/tabs";

const Webview = ({
  id,
  url,
  active,
  tabsDispatch,
  setLoginDialogInfo,
  passwords,
  searchHistoryDispatcher,
}) => {
  const webviewRef = useRef();
  const handleStartLoading = () => {
    tabsDispatch({
      type: UPDATE_TAB,
      payload: {
        tab: {
          id,
          loading: true,
        },
      },
    });
  };
  const handleFinishLoading = () => {
    tabsDispatch({
      type: UPDATE_TAB,
      payload: {
        tab: {
          id,
          title: webviewRef.current.getTitle(),
          url: webviewRef.current.getURL(),
          loading: false,
        },
      },
    });
  };

  useEffect(() => {
    webviewRef.current.addEventListener("dom-ready", () => {
      webviewRef.current.addEventListener("new-window", (e) => {
        tabsDispatch({
          type: ADD_TAB,
          payload: { tab: { ...defaultTab(window.id), url: e.url } },
        });
      });
      webviewRef.current.send("ready");
      const info = passwords.find(
        ({ site }) => site === webviewRef.current.getURL()
      );
      if (info) {
        webviewRef.current.send("login-info", info);
      }
      webviewRef.current.addEventListener("ipc-message", (event) => {
        switch (event.channel) {
          case "get-login-info": {
            setLoginDialogInfo(event.args[0]);
          }
        }
      });
      webviewRef.current.addEventListener("did-start-loading", () => {
        handleStartLoading();
      });

      webviewRef.current.addEventListener("did-finish-load", () => {
        handleFinishLoading();
        searchHistoryDispatcher({
          type: ADD_SEARCH_HISTORY,
          payload: {
            history: {
              id: uniqid(),
              url: webviewRef.current.getURL(),
              time: new Date(Date.now()),
            },
          },
        });
      });
      webviewRef.current.addEventListener("did-frame-finish-load", () => {
        handleFinishLoading();
      });
    });
  }, [passwords]);
  return (
    <webview
      className={`${active && "active-webview"}`}
      src={url}
      id={`webview-${id}`}
      webpreferences="nativeWindowOpen=true"
      allowpopups="true"
      ref={webviewRef}
      preload={UNELMA_BROWSER_PRELOAD_WEBPACK_ENTRY}
    ></webview>
  );
};

export default Webview;
