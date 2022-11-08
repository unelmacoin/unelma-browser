import { BrowserWindow, ipcMain, session } from "electron";
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
  OPEN_SIDEBAR,
  RELOAD,
  REMOVE_VIEW,
  REQUEST_START,
  RESET_WINDOW_TABS,
  RE_ORDER_VIEWS,
  SAVE_LOGIN_INFO,
  SHOW_VIEWS,
  TOGGLE_WINDOW,
  WINDOW_READY,
} from "../../constants/global/channels";
import { UNELMA_DEFAULT_URL } from "../../constants/global/urls";
import { getBookmarks } from "../controllers/bookmarks";
import { addAuthInfo, getAuthInfo } from "../controllers/passwords";
import { addHistory, getSearchHistory } from "../controllers/searchHistory";
import { getWindowTabs, setTabs, resetWindowTabs } from "../controllers/tabs";
import { handleWindowsControlsMessaging } from "../utils/ipc";
import { View } from "./View";
const uniqid = require("uniqid");
const path = require("path");
export class MainWindow {
  window;
  views;
  isToggled;

  constructor(id) {
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
        nodeIntegration: false,
        webviewTag: true,
        devTools: true,
        contextIsolation: true,
        preload: UNELMA_BROWSER_PRELOAD_WEBPACK_ENTRY,
      },
    });
    this.window.windowId = id || uniqid();
    this.window.loadURL(UNELMA_BROWSER_WEBPACK_ENTRY);
    handleWindowsControlsMessaging(this.window);

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
        this.contents.send(GET_AUTH_INFO, getAuthInfo());
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
      if (this.window.windowId === windowId) {
        this.views.forEach((v) => v.fit(this.isToggled));
        this.views.forEach((v) => !v.isActive && v.hide());
        this.isToggled = !this.isToggled;
      }
    });
    ipcMain.on(mergeChannel(GO_TO_LOCATION, this.window.windowId), (_, url) => {
      this.goToLocation(url);
    });
    ipcMain.on(GET_LOGIN_INFO, (_, v) => {
      const isExist = () =>
        getAuthInfo().find(
          ({ site, password, username }) =>
            new URL(site).origin === new URL(v.site).origin &&
            username === v.username &&
            password === v.password
        );
      if (!isExist()) {
        this.contents.send(
          mergeChannel(GET_LOGIN_INFO, this.window.windowId),
          v
        );
      }
    });
    ipcMain.on(mergeChannel(REMOVE_VIEW, this.window.windowId), (_, id) => {
      this.removeView(id);
    });
    this.contents.on("did-finish-load", () => {
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
        url: UNELMA_DEFAULT_URL,
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
      function ({ webContents }) {
        if (webContents?.getType() === "browserView") {
          webContents?.send(REQUEST_START, webContents?.getURL());
        }
      }
    );
  }
  addView(props) {
    this.views.forEach((v) => v.deActive());
    const view = new View(props);
    this.views.push(view);
    this.window.addBrowserView(view.view);
    const finishLoading = (e) => {
      const authInfo = getAuthInfo().find(
        (v) => new URL(v.site).origin === new URL(e.sender.getURL()).origin
      );
      if (authInfo) {
        view.contents.send(LOGIN_INFO, authInfo);
      }
       view.finishLoad();
       this.sendTabs();
    };
    view.contents.addListener("did-start-loading", (e) => {
      view.startLoad();
      this.sendTabs();
    });
    view.contents.addListener("did-fail-load", () => {
      view.failLoad();
      this.sendTabs();
    });
    view.contents.addListener("did-stop-loading", (e) => {
     finishLoading(e)
    });
    view.contents.addListener("did-finish-load", (e) => {
     finishLoading(e);
      addHistory({
        id: uniqid(),
        url: e.sender.getURL(),
        time: new Date(Date.now()),
      });

      this.send(GET_SEARCH_HISTORY, getSearchHistory());
    });
    view.contents.addListener("did-frame-finish-load", (e) => {
      finishLoading(e);
    });
    view.contents.setWindowOpenHandler(({ url }) => {
      // this.send(OPEN_SIDEBAR);
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
  activeView(id) {
    this.views.forEach((view) => view.deActive());
    this.views.find((view) => view.id === id).active(!this.isToggled);
    this.sendTabs();
  }
  removeView(id) {
    if (
      this.views.length === 1 &&
      !this.window.isDestroyed() &&
      this.window.isClosable()
    ) {
      setTabs([], this.window.windowId);
      this.close();
    }
    const view = this.views.find((elm) => elm.id === id);
    const newActiveView =
      view && view.isActive
        ? this.isFirst(id)
          ? this.getNextView(id)
          : this.getPrevView(id)
        : null;
    newActiveView?.active(!this.isToggled);
    this.setViews(this.views.filter((elm) => elm.id !== id));
    this.window?.removeBrowserView(view.view);
    view.destroy();
    this.sendTabs();
  }
  setViews(views) {
    this.views = views;
  }
  goToLocation(url) {
    this.views.find((v) => v.isActive).loadURL(url);
    this.sendTabs();
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
    return this.views.map(
      ({ id, url, isActive, parentWindow, loading, title, fail }) => ({
        id,
        url,
        active: isActive,
        windowId: parentWindow.windowId,
        title,
        loading,
        fail,
      })
    );
  }
  reOrderViews(tabs) {
    const newOrderedList = tabs.map((id) =>
      this.views.find((v) => v.id === id)
    );
    this.setViews(newOrderedList);
    this.sendTabs();
  }
  hideAllViews() {
    this.views.forEach((view) => view.hide());
  }
  showViews() {
    const activeView = this.views.find((v) => v.isActive);
    activeView.show();
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
    if (!this.window.isDestroyed()) this.contents.send(channel, data);
  }
  sendTabs() {
    setTabs(this.mapViews(), this.window.windowId);
    this.send(
      mergeChannel(GET_CURRENT_TABS, this.window.windowId),
      getWindowTabs(this.window.windowId)
    );
  }

  get windowId() {
    return this.window?.windowId;
  }
  get contents() {
    return this.window.webContents;
  }
}
