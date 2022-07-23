import { BrowserWindow, ipcMain } from "electron";
import {
  getCurrentTabs,
  getSearchHistory,
  getBookmarks,
  setCurrentTabs,
  resetWindowTabs,
  resetAllTabs,
  setSearchHistory,
  addHistory,
  setBookmarks,
  addBookmark,
  removeFromBookmarks,
  removeFromSearchHistroy,
} from "../utils/storingData";

export const handleWindowControls = () => {
  ipcMain.on("minimize", (_, id) => {
    BrowserWindow.getAllWindows()
      .find((w) => w.id === id)
      .minimize();
  });
  ipcMain.on("create-window", () => {
    createWindow();
  });

  ipcMain.on("maximize", (_, id) => {
    BrowserWindow.getAllWindows()
      .find((w) => w.id === id)
      .maximize();
  });
  ipcMain.on("close-window", (_, id) => {
    if (
      BrowserWindow.getAllWindows()
        .find((w) => w.id === id)
        .isClosable()
    ) {
      BrowserWindow.getAllWindows()
        .find((w) => w.id === id)
        .close();
    }
  });
  ipcMain.on("unmaximize", (_, id) => {
    BrowserWindow.getAllWindows()
      .find((w) => w.id === id)
      .unmaximize();
  });
};

export const handleGetData = (window) => {
  window.webContents.send(
    "get-current-tabs" + window.id,
    getCurrentTabs(window.id)
  );
  window.webContents.send("get-search-history", getSearchHistory());
  window.webContents.send("get-bookmarks", getBookmarks());
};

export const handleStoreData = (window) => {
  ipcMain.on("set-current-tabs" + window.id, (_, tabs) => {
    setCurrentTabs(tabs, window.id);
    if (!window.isDestroyed())
        {
          window.webContents.send(
            "get-current-tabs" + window.id,
            getCurrentTabs(window.id)
          );
        }
  });
  ipcMain.on("reset-window-tabs" + window.id, () => {
    resetWindowTabs(window.id);
    if (!window.isDestroyed()) {window.webContents.send(
      "get-current-tabs" + window.id,
      getCurrentTabs(window.id)
    );}
    
  });
  ipcMain.on("reset-all-tabs", () => {
    resetAllTabs();
    if (!window.isDestroyed())
      window.webContents.send(
      "get-current-tabs" + window.id,
      getCurrentTabs(window.id)
    );
  });
  ipcMain.on("set-search-history", (_, searchHistory) => {
    setSearchHistory(searchHistory);
    if (!window.isDestroyed())
      window.webContents.send("get-search-history", getSearchHistory());
  });
  ipcMain.on("add-history", (_, url) => {
    
      addHistory(url);
      if (!window.isDestroyed())
         window.webContents.send("get-search-history", getSearchHistory());
  });
  ipcMain.on("set-bookmarks", (_, bookmarks) => {
    setBookmarks(bookmarks);
    if (!window.isDestroyed())
      window.webContents.send("get-bookmarks", getBookmarks());
  });
  ipcMain.on("add-bookmark", (_, args) => {
    addBookmark(...args);
    if (!window.isDestroyed())
      window.webContents.send("get-bookmarks", getBookmarks());
  });
  ipcMain.on("remove-from-bookmarks", (_, url) => {
    removeFromBookmarks(url);
    if (!window.isDestroyed())
       window.webContents.send("get-bookmarks", getBookmarks());
  });
  ipcMain.on("remove-from-search-histroy", (_, url) => {
    removeFromSearchHistroy(url);
    if (!window.isDestroyed())
      window.webContents.send("get-search-history", getSearchHistory());
  });
};
