const { BrowserWindow } = require("electron");
const { handleGetData, handleStoreData } = require("./ipc");
const uniqid = require("uniqid");
const path = require("path");
const { ElectronBlocker, fullLists } = require("@cliqz/adblocker-electron");
const fetch = require("cross-fetch");
const { readFileSync, writeFileSync } = require('original-fs');
module.exports = {
  createWindow: async (windowId) => {
    const mainWindow = new BrowserWindow({
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
    const blocker = await ElectronBlocker.fromLists(
      fetch,
      fullLists,
      {
        enableCompression: true,
      },
      {
        path: "engine.bin",
        read: async (...args) => readFileSync(...args),
        write: async (...args) => writeFileSync(...args),
      }
    );
    blocker.enableBlockingInSession(mainWindow.webContents.session);

    blocker.on("request-blocked", (request) => {
      console.log("blocked", request.tabId, request.url);
    });

    blocker.on("request-redirected", (request) => {
      console.log("redirected", request.tabId, request.url);
    });

    blocker.on("request-whitelisted", (request) => {
      console.log("whitelisted", request.tabId, request.url);
    });

    blocker.on("csp-injected", (request) => {
      console.log("csp", request.url);
    });

    blocker.on("script-injected", (script, url) => {
      console.log("script", script.length, url);
    });

    blocker.on("style-injected", (style, url) => {
      console.log("style", style.length, url);
    });
    mainWindow.windowId = windowId || uniqid();
    mainWindow.loadURL(UNELMA_BROWSER_WEBPACK_ENTRY);
    mainWindow.webContents.on("did-finish-load", () => {
      mainWindow.webContents.send("window-ready", mainWindow.windowId);
      mainWindow.webContents.send("is-maximized", mainWindow.isMaximized());
      handleGetData(mainWindow);
      handleStoreData(mainWindow);
    });
    mainWindow.setMenu(null);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  },
};
