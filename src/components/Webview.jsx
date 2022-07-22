const { ipcRenderer } = window.require("electron");
import React, { useEffect, useRef } from "react";
import { UPDATE_TAB } from "../utils/actions";

const Webview = ({ id, url, active, tabsDispatch, setSearchHistory }) => {
  const webviewRef = useRef();
  const handleStartLoading = () => {
    tabsDispatch({
      type: UPDATE_TAB,
      tab: {
        id,
        loading: true,
      },
    });
  };
  const handleFinishLoading = () => {
    tabsDispatch({
      type: UPDATE_TAB,
      tab: {
        id,
        title: webviewRef.current.getTitle(),
        url: webviewRef.current.getURL(),
        loading: false,
      },
    });
  };
  useEffect(() => {
    webviewRef.current.addEventListener("dom-ready", () => {
      webviewRef.current.insertCSS("body::-webkit-scrollbar {width: 4px;}");
      webviewRef.current.insertCSS(
        "body:::-webkit-scrollbar-track {background: transparent;}"
      );
      webviewRef.current.insertCSS(
        "body::-webkit-scrollbar-thumb {background: rgba(51, 51, 51, 0.349);"
      );
    });
    webviewRef.current.addEventListener("did-start-loading", () => {
      handleStartLoading();
    });

    webviewRef.current.addEventListener("did-finish-load", () => {
      handleFinishLoading();
      ipcRenderer.send("add-history", webviewRef.current.getURL());
    });
    webviewRef.current.addEventListener("did-frame-finish-load", () => {
      handleFinishLoading();
    });
  }, []);
  return (
    <webview
      className={`${active && "active-webview"}`}
      src={url}
      id={`webview-${id}`}
      webpreferences="nativeWindowOpen=true"
      allowpopups="true"
      ref={webviewRef}
    ></webview>
  );
};

export default Webview;
