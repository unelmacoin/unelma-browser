import { BrowserWindow, ipcMain } from "electron";
import {
  addBookmark,
  getBookmarks,
  removeFromBookmarks,
} from "../controllers/bookmarks";
import {
  addAuthInfo,
  getAuthInfo,
  removeFromAuthInfo,
} from "../controllers/passwords";
import {
  addHistory,
  getSearchHistory,
  removeFromSearchHistroy,
} from "../controllers/searchHistory";
import {
  activateTab,
  addTab,
  getTabsWindows,
  getWindowTabs,
  removeTab,
  resetAllTabs,
  resetWindowTabs,
  updateActiveTab,
  updateTab,
} from "../controllers/tabs";

export const handleWindowControls = (createWindow) => {
  ipcMain.on("minimize", (_, id) => {
    BrowserWindow.getAllWindows()
      .find((w) => w.windowId === id)
      .minimize();
  });
  ipcMain.on("create-window", () => {
    createWindow();
  });

  ipcMain.on("maximize", (_, id) => {
    BrowserWindow.getAllWindows()
      .find((w) => w.windowId === id)
      .maximize();
  });
  ipcMain.on("close-window", (_, id) => {
    if (
      BrowserWindow.getAllWindows()
        .find((w) => w.windowId === id)
        .isClosable()
    ) {
      BrowserWindow.getAllWindows()
        .find((w) => w.windowId === id)
        .close();
    }
  });
  ipcMain.on("unmaximize", (_, id) => {
    BrowserWindow.getAllWindows()
      .find((w) => w.windowId === id)
      .unmaximize();
  });
};

export const handleGetData = (window) => {
  window.webContents.send("get-current-tabs", getWindowTabs(window.windowId));
  window.webContents.send("get-search-history", getSearchHistory());
  window.webContents.send("get-bookmarks", getBookmarks());
  window.webContents.send("get-auth-info", getAuthInfo());
};

export const handleStoreData = (window) => {
  ipcMain.on("reset-window-tabs", (_, windowId) => {
    resetWindowTabs(windowId);
  });
  ipcMain.on("reset-all-tabs", (_, windowId) => {
    getTabsWindows().forEach((winId) => {
      const currentWindow = BrowserWindow.getAllWindows().find(
        (w) => w.windowId === winId && w.windowId !== windowId
      );
      if (currentWindow?.isClosable()) {
        currentWindow.close();
      }
    });
    resetAllTabs(windowId);
  });

  ipcMain.on("add-tab", (_, tab) => {
    addTab(tab);
  });
  ipcMain.on("add-history", (_, searchHistory) => {
    addHistory(searchHistory);
  });
  ipcMain.on("add-auth-info", (_, info) => {
    addAuthInfo(info);
  });

  ipcMain.on("add-bookmark", (_, args) => {
    addBookmark(...args);
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
  ipcMain.on("remove-tab", (_, { id, windowId }) => {
    removeTab(id, windowId);
  });
  ipcMain.on("update-tab", (_, tab) => {
    updateTab(tab);
  });
  ipcMain.on("activate-tab", (_, tab) => {
    activateTab(tab);
  });
  ipcMain.on("update-active-tab", (_, tab) => {
    updateActiveTab(tab);
  });
};
