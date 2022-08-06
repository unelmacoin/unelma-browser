const { BrowserWindow } = require("electron");
const { handleGetData, handleStoreData } = require("./ipc");
const uniqid = require("uniqid");
const path = require("path");
module.exports = {
  createWindow: (windowId) => {
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
    mainWindow.windowId = windowId || uniqid();
    mainWindow.loadURL(UNELMA_BROWSER_WEBPACK_ENTRY);
    mainWindow.webContents.on("did-finish-load", () => {
      mainWindow.webContents.send("window-ready", mainWindow.windowId);
      mainWindow.webContents.send("is-maximized", mainWindow.isMaximized());
      handleGetData(mainWindow);
      handleStoreData(mainWindow);
    });
    mainWindow.setMenu(null);
   mainWindow.webContents.openDevTools({mode:'detach'})

  },
};
