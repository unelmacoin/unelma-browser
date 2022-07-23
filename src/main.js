// Modules to control application life and create native browser window
const { app, BrowserWindow, session } = require("electron");
const path = require("path");
const fetch = require("cross-fetch");
const contextMenu = require("electron-context-menu");
const { ElectronBlocker } = require("@cliqz/adblocker-electron");
const { handleWindowControls, handleGetData, handleStoreData } = require("./modules/ipc");
if (require("electron-squirrel-startup")) {
  app.quit();
}
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    transparent: true,
    title: "Unelma.XYZ - Browser",
    width: 1024,
    height: 768,
    backgroundColor: "rgba(0,0,0,0)",
    icon: path.join(__dirname, "./img/unelma.ico"),
    frame: false,
    titleBarStyle: "hidden",
    minHeight: 600,
    minWidth: 1000,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      devTools: true,
      contextIsolation: false,
      // preload: UNELMA_BROWSER_PRELOAD_WEBPACK_ENTRY,
    },
  });
  mainWindow.loadURL(UNELMA_BROWSER_WEBPACK_ENTRY);
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.send("window-ready", mainWindow.id);
    mainWindow.webContents.send("is-maximized", mainWindow.isMaximized());
    handleGetData(mainWindow);
    handleStoreData(mainWindow);
  });
  mainWindow.on("closed", function () {
    mainWindow = null;
  });

  mainWindow.setMenu(null);
}

handleWindowControls();

app.on("web-contents-created", function (_, contents) {
  if (contents.getType() === "webview") {
    contextMenu({
      window: contents,
      showInspectElement: true,
      prepend: () => [
        {
          label: "New window",
          click: () => {
            createWindow();
          },
        },
      ],
    });
    contents.addListener("new-window", function (newWindowEvent, _) {
      newWindowEvent.preventDefault();
    });
  }
});

app.whenReady().then(() => {
  ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
    blocker.enableBlockingInSession(session.defaultSession);
  });
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
