// Modules to control application life and create native browser window
const { app, BrowserWindow, session } = require("electron");
const fetch = require("cross-fetch");
const { ElectronBlocker } = require("@cliqz/adblocker-electron");
const { handleWindowControls } = require("./main/modules/ipc");
const { createWindow } = require("./main/modules/window");
const { addContextMenu } = require("./main/modules/contextMenu");
const { getTabsWindows } = require("./main/controllers/tabs");
const PRELOAD_PATH = require.resolve("@cliqz/adblocker-electron-preload");
if (require("electron-squirrel-startup")) {
  app.quit();
}
require("dotenv").config();
handleWindowControls(createWindow);

app.on("web-contents-created", function (_, contents) {
  if (contents.getType() === "webview") {
    addContextMenu(contents);
    contents.addListener("new-window", function (e, _) {
      e.preventDefault();
    });
  }
});

app.whenReady().then(() => {
  session.defaultSession.clearStorageData()
  ElectronBlocker.fromPrebuiltAdsAndTracking(fetch)
    .then((blocker) => {
      blocker.enableBlockingInSession(session.defaultSession);
      session.defaultSession.setPreloads([PRELOAD_PATH]);
      console.log(session.defaultSession.getPreloads());
    })
    .catch((err) => {
      console.log("error---", err);
    });
  if (getTabsWindows().length > 0)
    getTabsWindows().forEach((windowId) => {
      createWindow(windowId);
    });
  else createWindow();
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0)
      if (getTabsWindows().length > 0)
        getTabsWindows().forEach((windowId) => {
          createWindow(windowId);
        });
      else createWindow();
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
