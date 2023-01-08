const { app, BrowserWindow, ipcMain, session } = require("electron");
import { getTabsWindows, resetAllTabs } from "../controllers/tabs";
import { ContextMenu } from "./ContextMenu";
import { MainWindow } from "./MainWindow";
import { addBookmark, removeFromBookmarks } from "../controllers/bookmarks";
import { addAuthInfo, removeFromAuthInfo } from "../controllers/passwords";
import { removeFromSearchHistroy } from "../controllers/searchHistory";
import {
  ADD_AUTH_INFO,
  ADD_BOOKMARK,
  CREATE_WINDOW,
  REMOVE_FROM_AUTH_INFO,
  REMOVE_FROM_BOOKMARKS,
  REMOVE_FROM_SEARCH_HISTORY,
  RESET_ALL_TABS,
} from "../../constants/global/channels";

const fs = require("fs");
const path = require("path");
const Store = require("electron-store");
const store = new Store();
export class App {
  windows;
  constructor() {
    this.windows = [];
    let addWindow = this.addWindow.bind(this);
    let closeWindow = this.closeWindow.bind(this);
    app.on("web-contents-created", function (_, contents) {
      if (contents.getType() === "browserView") {
        new ContextMenu(contents, addWindow);
      }
    });

    app.whenReady().then(() => {
      let easyListTxt = fs.readFileSync(
        path.join(__dirname, "../../src/main/utils/adblocker/easylist.txt"),
        "utf-8"
      );
      store.set("easylist", easyListTxt);
      if (getTabsWindows().length > 0)
        getTabsWindows().forEach((windowId) => {
          addWindow(windowId);
        });
      else addWindow();
      app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0)
          if (getTabsWindows().length > 0)
            getTabsWindows().forEach((windowId) => {
              addWindow(windowId);
            });
          else addWindow();
      });
    });

    app.on("window-all-closed", function () {
      if (process.platform !== "darwin") app.quit();
    });

    ipcMain.on(RESET_ALL_TABS, (_, windowId) => {
      getTabsWindows().forEach((win) => closeWindow(win));
      resetAllTabs(windowId);
    });

    ipcMain.on(ADD_AUTH_INFO, (_, info) => {
      addAuthInfo(info);
    });

    ipcMain.on(ADD_BOOKMARK, (_, bookmark) => {
      addBookmark(bookmark);
    });
    ipcMain.on(REMOVE_FROM_BOOKMARKS, (_, url) => {
      removeFromBookmarks(url);
    });
    ipcMain.on(REMOVE_FROM_SEARCH_HISTORY, (_, id) => {
      removeFromSearchHistroy(id);
    });
    ipcMain.on(REMOVE_FROM_AUTH_INFO, (_, id) => {
      removeFromAuthInfo(id);
    });
    ipcMain.on(CREATE_WINDOW, () => {
      addWindow();
    });
  }
  addWindow(id) {
    const window = new MainWindow(id);
    this.windows.push(window);
  }
  closeWindow(id) {
    const currentWindow = this.windows.find((w) => w?.windowId === id);
    currentWindow?.close();
    this.windows = this.windows.filter((win) => win.id !== id);
  }
}