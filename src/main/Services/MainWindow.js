import { BrowserWindow, ipcMain } from "electron";
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

    ipcMain.on("add-view" + this.window.windowId, (_, tab) => {
      this.addView({
        url: tab.url,
        parentWindow: this.window,
        id: tab.id,
      });
    });
    ipcMain.on("save-login-info" + this.window.windowId, (_, info) => {
      addAuthInfo(info);
      this.contents.send("get-auth-info", getAuthInfo());
    });
    ipcMain.on("reorder-tabs" + this.window.windowId, (_, tabs) => {
      this.reOrderViews(tabs);
    });
    ipcMain.on("reset-window-tabs" + this.window.windowId, () => {
      resetWindowTabs(this.window.windowId);
      this.close();
    });
    ipcMain.on("go-back" + this.window.windowId, () => {
      this.goBack();
    });
    ipcMain.on("go-forward" + this.window.windowId, () => {
      this.goForward();
    });
    ipcMain.on("reload" + this.window.windowId, () => {
      this.reload();
    });
    ipcMain.on("hide-views" + this.window.windowId, () => {
      this.hideAllViews();
    });
    ipcMain.on("show-views" + this.window.windowId, () => {
      this.showViews();
    });
    ipcMain.on("activate-view" + this.window.windowId, (_, id) => {
      this.activeView(id);
    });
    ipcMain.on("toggle-window", (_, windowId) => {
      if (this.window.windowId === windowId) {
        this.views.find((v) => v.isActive).fit(this.isToggled);
        this.isToggled = !this.isToggled;
      }
    });
    ipcMain.on("go-to-location" + this.window.windowId, (_, url) => {
      this.goToLocation(url);
    });
    ipcMain.on("get-login-info", (_, v) => {
      const isExist = () =>
        getAuthInfo().find(
          ({ site, password, username }) =>
            site === v.site &&
            username === v.username &&
            password === v.password
        );
      if (!isExist()) {
        this.contents.send("get-login-info" + this.window.windowId, v);
      }
    });
    ipcMain.on("remove-view" + this.window.windowId, (_, id) => {
      this.removeView(id);
    });
    this.contents.on("did-finish-load", () => {
      this.window.addListener("resize", () => {
        this.views.find((v) => v.isActive)?.fit(!this.isToggled);
      });
      this.contents.send("window-ready", this.window.windowId);
      this.contents.addListener("ipc-message", (event) => {});
      this.contents.send("is-maximized", this.window.isMaximized());
      this.send(
        "get-current-tabs" + this.window.windowId,
        getWindowTabs(this.window.windowId)
      );
      this.send("get-search-history", getSearchHistory());
      this.send("get-bookmarks", getBookmarks());
      this.send("get-auth-info", getAuthInfo());
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
      });
    } else {
      windowTabs.forEach((tab) => {
        this.addView({
          url: tab.url,
          parentWindow: this.window,
          isActive: tab.active,
          id: tab.id,
        });
      });
    }
  }
  addView(props) {
    this.views.forEach((v) => v.deActive());
    const view = new View(props);
    this.views.push(view);
    this.window.addBrowserView(view.view);
    view.contents.addListener("did-start-loading", () => {
      view.startLoad();
      setTabs(this.mapViews(), this.window.windowId);
      this.send(
        "get-current-tabs" + this.window.windowId,
        getWindowTabs(this.window.windowId)
      );
    });
    view.contents.addListener("did-fail-load", () => {
      view.failLoad();
      setTabs(this.mapViews(), this.window.windowId);
      this.send(
        "get-current-tabs" + this.window.windowId,
        getWindowTabs(this.window.windowId)
      );
    });
    view.contents.addListener("did-finish-load", (e) => {
      view.finishLoad();
      setTabs(this.mapViews(), this.window.windowId);
      addHistory({
        id: uniqid(),
        url: e.sender.getURL(),
        time: new Date(Date.now()),
      });
      if (getAuthInfo().find((v) => v.site === e.sender.getURL())) {
        view.contents.send(
          "login-info",
          getAuthInfo().find((v) => v.site === e.sender.getURL())
        );
      }
      this.send("get-search-history", getSearchHistory());
      this.send(
        "get-current-tabs" + this.window.windowId,
        getWindowTabs(this.window.windowId)
      );
    });
    view.contents.addListener("did-frame-finish-load", () => {
      view.finishLoad();
      setTabs(this.mapViews(), this.window.windowId);
      this.send(
        "get-current-tabs" + this.window.windowId,
        getWindowTabs(this.window.windowId)
      );
    });
    view.contents.setWindowOpenHandler(({ url }) => {
      this.addView({
        url,
        parentWindow: this.window,
        id: uniqid(),
      });
      return { action: "deny" };
    });
    setTabs(this.mapViews(), this.window.windowId);
    this.send(
      "get-current-tabs" + this.window.windowId,
      getWindowTabs(this.window.windowId)
    );
  }
  activeView(id) {
    this.views.forEach((view) => view.deActive());
    this.views.find((view) => view.id === id).active();
    setTabs(this.mapViews(), this.window.windowId);
    this.send(
      "get-current-tabs" + this.window.windowId,
      getWindowTabs(this.window.windowId)
    );
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
    if (newActiveView) newActiveView.active();
    this.setViews(this.views.filter((elm) => elm.id !== id));
    this.window?.removeBrowserView(view.view);
    view.destroy();
    setTabs(this.mapViews(), this.window.windowId);
    this.send(
      "get-current-tabs" + this.window.windowId,
      getWindowTabs(this.window.windowId)
    );
  }
  setViews(views) {
    this.views = views;
  }
  goToLocation(url) {
    this.views.find((v) => v.isActive).loadURL(url);
    setTabs(this.mapViews(), this.window.windowId);
    this.send(
      "get-current-tabs" + this.window.windowId,
      getWindowTabs(this.window.windowId)
    );
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
    const newOrderedList = tabs.map(( id ) =>
      this.views.find((v) => v.id === id)
    );
    this.setViews(newOrderedList);
    setTabs(this.mapViews(), this.window.windowId);
    this.send(
      "get-current-tabs" + this.window.windowId,
      getWindowTabs(this.window.windowId)
    );
  }
  hideAllViews() {
    this.views.forEach((view) => view.hide());
  }
  showViews() {
    const activeView = this.views.find((v) => v.isActive);
    activeView.show();
  }
  mapView({ id, url, isActive, parentWindow, loading, title, fail }) {
    return {
      id,
      url,
      active: isActive,
      windowId: parentWindow.windowId,
      title,
      loading,
      fail,
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
  destroy() {
    if (!this.window.isDestroyed()) {
      this.window.destroy();
      this.window = null;
    }
  }
  close() {
    if (this.window.isClosable()) {
      this.window.close();
      this.destroy();
    }
  }
  send(channel, data) {
    if (!this.window.isDestroyed()) {
      this.contents.send(channel, data);
    }
  }
  get windowId() {
    return this.window?.windowId;
  }
  get contents() {
    return this.window.webContents;
  }
}
