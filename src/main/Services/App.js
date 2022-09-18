import { getTabsWindows, resetAllTabs } from "../controllers/tabs";
import { ContextMenu } from "./ContextMenu";
import { MainWindow } from "./MainWindow";
import { addBookmark, removeFromBookmarks } from "../controllers/bookmarks";
import { addAuthInfo, removeFromAuthInfo } from "../controllers/passwords";
import { removeFromSearchHistroy } from "../controllers/searchHistory";
const { app, BrowserWindow, ipcMain } = require("electron");

export class App {
  windows;
  constructor() {
    this.windows = [];
    let addWindow = this.addWindow.bind(this);
    app.on("web-contents-created", function (_, contents) {
      if (contents.getType() === "browserView") {
        new ContextMenu(contents, addWindow);
      }
    });

    app.whenReady().then(() => {
      if (getTabsWindows().length > 0)
        getTabsWindows().forEach((windowId) => {
          this.addWindow(windowId);
        });
      else this.addWindow();
      app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0)
          if (getTabsWindows().length > 0)
            getTabsWindows().forEach((windowId) => {
              this.addWindow(windowId);
            });
          else this.addWindow();
      });
    });

    app.on("window-all-closed", function () {
      if (process.platform !== "darwin") app.quit();
    });

    ipcMain.on("reset-all-tabs", (_, windowId) => {
      getTabsWindows().forEach((win) => this.closeWindow(win));
      resetAllTabs(windowId);
    });

    ipcMain.on("add-auth-info", (_, info) => {
      addAuthInfo(info);
    });

    ipcMain.on("add-bookmark", (_, bookmark) => {
      addBookmark(bookmark);
    });
    ipcMain.on("remove-from-bookmarks", (_, url) => {
      removeFromBookmarks(url);
    });
    ipcMain.on("remove-from-search-histroy", (_, id) => {
      removeFromSearchHistroy(id);
    });
    ipcMain.on("remove-from-auth-info", (_, id) => {
      removeFromAuthInfo(id);
    });
    ipcMain.on("create-window", () => {
      this.addWindow();
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
