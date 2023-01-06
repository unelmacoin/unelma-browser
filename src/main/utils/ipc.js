import { BrowserWindow, ipcMain } from "electron";
import {
  CLOSE_WINDOW,
  MAXIMIZE,
  MINIMIZE,
  UN_MAXIMIZE,
} from "../../constants/global/channels";
import { addBookmark, removeFromBookmarks } from "../controllers/bookmarks";
import { addAuthInfo, removeFromAuthInfo } from "../controllers/passwords";
import { removeFromSearchHistroy } from "../controllers/searchHistory";
import {
  getTabsWindows,
  resetAllTabs,
  resetWindowTabs,
} from "../controllers/tabs";

export const handleProcessesMessaging = () => {
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
};

export const handleWindowsControlsMessaging = (window) => {
  ipcMain.on(MINIMIZE, (_, id) => {
    if (window) {
      if (!window?.isDestroyed() && window?.windowId === id) {
        window?.minimize();
      }
    }
  });
  ipcMain.on(MAXIMIZE, (_, id) => {
    if (window) {
      if (!window?.isDestroyed() && window?.windowId === id) {
        window?.maximize();
      }
    }
  });
  ipcMain.on(CLOSE_WINDOW, (_, id) => {
    if (window) {
      if (
        !window?.isDestroyed() &&
        window?.isClosable() &&
        window?.windowId === id
      ) {
        window?.close();
      }
    }
  });
  ipcMain.on(UN_MAXIMIZE, (_, id) => {
    if (window) {
      if (!window?.isDestroyed() && window?.windowId === id) {
        window?.unmaximize();
      }
    }
  });
};
