import { app,BrowserWindow, ipcMain, session } from "electron";
import {
  ACTIVATE_VIEW,
  ADD_VIEW,
  GET_AUTH_INFO,
  GET_BOOKMARKS,
  GET_CURRENT_TABS,
  GET_LOGIN_INFO,
  GET_SEARCH_HISTORY,
  GO_BACK,
  GO_FORWARD,
  GO_TO_LOCATION,
  HIDE_VIEWS,
  IS_MAXIMIZED,
  LOGIN_INFO,
  mergeChannel,
  RELOAD,
  REMOVE_VIEW,
  REQUEST_START,
  RESET_WINDOW_TABS,
  RE_ORDER_VIEWS,
  SAVE_LOGIN_INFO,
  SHOW_VIEWS,
  TOGGLE_WINDOW,
  WINDOW_READY,
  FINISH_NAVIGATE,
} from "../../constants/global/channels";
import { UNELMA_DEFAULT_URL } from "../../constants/global/urls";
import { getBookmarks } from "../controllers/bookmarks";
import { addAuthInfo, getAuthInfo } from "../controllers/passwords";
import { addHistory, getSearchHistory } from "../controllers/searchHistory";
import { getWindowTabs, setTabs, resetWindowTabs } from "../controllers/tabs";
import { handleWindowsControlsMessaging } from "../utils/ipc";
import { View } from "./View";
const fs = require("fs");
const uniqid = require("uniqid");
const path = require("path");
const Store = require("electron-store");
import * as ABPFilterParser from "abp-filter-parser";

const store = new Store();
export class MainWindow {
  window;
  views;
  isToggled;
  constructor(id, initialUrl) {
    this.views = [];
    this.isToggled = false;
    this.window = new BrowserWindow({
      transparent: true,
      title: "UnelmaSearch - Browser",
      width: 1024,
      height: 768,
      backgroundColor: "rgba(0,0,0,0)",
      icon: path.join(__dirname, "./img/unp.ico"),
      frame: false,
      titleBarStyle: "hidden",
      minHeight: 600,
      minWidth: 1000,
      webPreferences: {
        nodeIntegration: true,
        devTools: true,
        contextIsolation: true,
        nodeIntegrationInSubFrames: true,
        preload: UNELMA_BROWSER_PRELOAD_WEBPACK_ENTRY,
      },
    });
    this.window.windowId = id || uniqid();
    this.window.loadURL(UNELMA_BROWSER_WEBPACK_ENTRY);
    handleWindowsControlsMessaging(this.window);

    if (this.window) {
      ipcMain.on(mergeChannel(ADD_VIEW, this.window.windowId), (_, tab) => {
        this.addView({
          url: tab.url,
          parentWindow: this.window,
          id: tab.id,
          isToggled: this.isToggled,
        });
      });
      ipcMain.on(
        mergeChannel(SAVE_LOGIN_INFO, this.window.windowId),
        (_, info) => {
          addAuthInfo(info);
          if (this.window) {
            this.window.webContents.send(GET_AUTH_INFO, getAuthInfo());
          }
        }
      );
      ipcMain.on(
        mergeChannel(RE_ORDER_VIEWS, this.window.windowId),
        (_, tabs) => {
          this.reOrderViews(tabs);
        }
      );
      ipcMain.on(mergeChannel(RESET_WINDOW_TABS, this.window.windowId), () => {
        resetWindowTabs(this.window.windowId);
        this.close();
      });
      ipcMain.on(mergeChannel(GO_BACK, this.window.windowId), () => {
        this.goBack();
      });
      ipcMain.on(mergeChannel(GO_FORWARD, this.window.windowId), () => {
        this.goForward();
      });
      ipcMain.on(mergeChannel(RELOAD, this.window.windowId), () => {
        this.reload();
      });
      ipcMain.on(mergeChannel(HIDE_VIEWS, this.window.windowId), () => {
        this.hideAllViews();
      });
      ipcMain.on(mergeChannel(SHOW_VIEWS, this.window.windowId), () => {
        this.showViews();
      });
      ipcMain.on(mergeChannel(ACTIVATE_VIEW, this.window.windowId), (_, id) => {
        this.activeView(id);
      });
      ipcMain.on(TOGGLE_WINDOW, (_, windowId) => {
        if (this.window) {
          if (this.window.windowId === windowId) {
            this.views.forEach((v) => v.fit(this.isToggled));
            this.views.forEach((v) => !v.isActive && v.hide());
            this.isToggled = !this.isToggled;
          }
        }
      });
      ipcMain.on(
        mergeChannel(GO_TO_LOCATION, this.window.windowId),
        (_, url) => {
          this.goToLocation(url);
        }
      );
      ipcMain.on(GET_LOGIN_INFO, (_, v) => {
        const isExist = () =>
          getAuthInfo().find(
            ({ site, password, username }) =>
              new URL(site).origin === new URL(v.site).origin &&
              username === v.username &&
              password === v.password
          );
        if (!isExist()) {
          if (this.window) {
            this.window.webContents.send(
              mergeChannel(GET_LOGIN_INFO, this.window.windowId),
              v
            );
          }
        }
      });
      ipcMain.on(mergeChannel(REMOVE_VIEW, this.window.windowId), (_, id) => {
        this.removeView(id);
      });
      this.window.webContents.on("did-finish-load", () => {
        this.window.addListener("resize", () => {
          this.views.find((v) => v.isActive && !v.hidden)?.fit(!this.isToggled);
        });
        this.send(WINDOW_READY, this.window.windowId);
        this.send(IS_MAXIMIZED, this.window.isMaximized());
        this.sendTabs();
        this.send(GET_SEARCH_HISTORY, getSearchHistory());
        this.send(GET_BOOKMARKS, getBookmarks());
        this.send(GET_AUTH_INFO, getAuthInfo());
        this.window.on("closed", () => {
          this.window = null;
        });
      });
      this.window.setMenu(null);
      this.window.maximize();
      const windowTabs = getWindowTabs(this.window.windowId);
        if (windowTabs.length === 0) {
          this.addView({
            url: !initialUrl ? UNELMA_DEFAULT_URL : initialUrl, // Loads custom link if given a paremeter otherwise loads, default url.
            parentWindow: this.window,
            isActive: true,
            id: uniqid(),
            isToggled: this.isToggled,
          });
        } else {
          windowTabs.forEach((tab) => {
            this.addView({
              url: tab.url,
              parentWindow: this.window,
              isActive: tab.active,
              id: tab.id,
              isToggled: this.isToggled,
            });
          });
        }
      session.defaultSession.webRequest.onSendHeaders(
        { urls: ["https://*/*"] },
        function (details) {
          if (details?.webContents?.getType() === "browserView") {
            details?.webContents?.send(
              REQUEST_START,
              details?.webContents?.getURL()
            );
          }
        }
      );

      let parsedFilterData = {};

      let currentPageDomain = "slashdot.org";
      ABPFilterParser.parse(store.get("easylist"), parsedFilterData);
      this.window.webContents.session.webRequest.onBeforeRequest(
        { urls: ["https://*/*"] },
        (details, callback) => {
          let urlToCheck = details.url;
          if (
            ABPFilterParser.matches(parsedFilterData, urlToCheck, {
              domain: currentPageDomain,
              elementTypeMaskMap: ABPFilterParser.elementTypes.SCRIPT,
            })
          ) {
            callback({ cancel: true });
            if (details?.webContents?.getType() === "browserView") {
              details?.webContents?.send("as", details?.webContents?.getURL());
            }
          } else {
            if (details?.webContents?.getType() === "browserView") {
              details?.webContents?.send("as", details?.webContents?.getURL());
            }
            callback({});
          }
        }
      );
    }
  }
  addView(props) {
    if (this.window) {
      this.views.forEach((v) => v?.deActive());
      const view = new View(props);
      this.views.push(view);
      this.window.addBrowserView(view.view);
      const finishLoading = (e) => {
        const authInfo = getAuthInfo().find((v) => {
          return e.sender?.getURL()
            ? new URL(v.site).origin === new URL(e.sender?.getURL()).origin
            : null;
        });
        if (authInfo) {
          view?.contents?.send(LOGIN_INFO, authInfo);
        }
        view.finishLoad();
        this.sendTabs();
        if (!e.sender?.getURL()) this.removeView(props.id);
        view?.contents?.send(FINISH_NAVIGATE);
      };
      view?.contents?.addListener("did-start-loading", (e) => {
        view.startLoad();
        this.sendTabs();
      });
      view?.contents?.addListener("did-navigate", () => {
        view?.contents?.send(FINISH_NAVIGATE);
      });
      view?.contents?.addListener("did-fail-load", () => {
        view.failLoad();
        this.sendTabs();
      });
      view?.contents?.addListener("did-stop-loading", (e) => {
        e.sender = view?.contents;
        finishLoading(e);
      });
      view?.contents?.addListener("did-finish-load", (e) => {
        e.sender = view?.contents;
        finishLoading(e);
        addHistory({
          id: uniqid(),
          url: e.sender?.getURL(),
          time: new Date(Date.now()),
        });

        this.send(GET_SEARCH_HISTORY, getSearchHistory());
      });
      view?.contents?.addListener("did-frame-finish-load", (e) => {
        e.sender = view?.contents;
        finishLoading(e);
      });
      view?.contents?.setWindowOpenHandler(({ url }) => {
        this.addView({
          url,
          parentWindow: this.window,
          id: uniqid(),
          isToggled: this.isToggled,
        });
        return { action: "deny" };
      });
      this.sendTabs();
    }
  }
  activeView(id) {
    try {
      const view = this.views.find((view) => view?.id === id);
      if (view) {
        this.views.forEach((view) => view?.deActive());
        view.active(!this.isToggled);
        this.sendTabs();
      }
    } catch (error) {
      console.error(error);
    }
  }
  removeView(id) {
    try {
      if (
        !this.window ||
        this.views.length !== 1 ||
        this.window.isDestroyed() ||
        !this.window.isClosable()
      ) {
        const view = this.views.find((elm) => elm?.id === id);
        const newActiveView = view?.isActive
          ? this.isFirst(id)
            ? this.getNextView(id)
            : this.getPrevView(id)
          : null;
        newActiveView?.active(!this.isToggled);
        this.setViews(this.views.filter((elm) => elm?.id !== id));
        this.window?.removeBrowserView(view?.view);
        view?.destroy();
        this.sendTabs();
      } else {
        setTabs([], this.window.windowId);
        this.close();
      }
    } catch (error) {
      console.error(error);
    }
  }
  setViews(views) {
    this.views = views;
  }
  goToLocation(url) {
    try {
      const activeView = this.views.find((v) => v?.isActive);
      if (activeView) {
        activeView.loadURL(url);
        this.sendTabs();
      }
    } catch (error) {
      console.error(error);
    }
  }
  getViews() {
    return this.views;
  }
  getNextView(id) {
    const viewIndex = this.views.findIndex((view) => view.id === id);
    return this.views[viewIndex + 1];
  }
  getPrevView(id) {
    const viewIndex = this.views.findIndex((view) => view.id === id);
    return this.views[viewIndex - 1];
  }
  isFirst(id) {
    return this.views[0].id === id;
  }
  mapViews() {
    try {
      return this.views.map(({ id, url, isActive, parentWindow, loading, title, fail }) => ({
        id,
        url,
        active: isActive,
        windowId: parentWindow.windowId,
        title,
        loading,
        fail,
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  reOrderViews(tabs) {
    try {
      const newOrderedList = tabs.map((id) =>
        this.views.find((v) => v?.id === id)
      );
      this.setViews(newOrderedList);
      this.sendTabs();
    } catch (error) {
      console.error(error);
    }
  }
  
  hideAllViews() {
    this.views.forEach((view) => view.hide());
  }
  showViews() {
    const activeView = this.views.find((v) => v.isActive);
    activeView?.show();
  }
  mapView(props) {
    return {
      ...props,
      active: props.isActive,
      windowId: props.parentWindow.windowId,
    };
  }
  goForward() {
    this.views.find((view) => view.isActive).goForward();
  }
  goBack() {
    this.views.find((view) => view.isActive).goBack();
  }
  reload() {
    this.views.find((view) => view.isActive).reload();
  }
  close() {
    if (this.window.isClosable()) this.window.close();
  }
  send(channel, data) {
    if (this.window && !this.window.isDestroyed())
      if (this.window) this.window.webContents.send(channel, data);
  }
  sendTabs() {
    setTabs(this.mapViews(), this.window?.windowId);
    this.send(
      mergeChannel(GET_CURRENT_TABS, this.window?.windowId),
      getWindowTabs(this.window?.windowId)
    );
  }

  get windowId() {
    return this.window?.windowId;
  }
  get contents() {
    return this.window?.webContents;
  }
}
