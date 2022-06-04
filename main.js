// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, BrowserView, shell } = require("electron");
const path = require("path");

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
    },
  });

  ipcMain.on("isMaximized", (event) => {
    event.returnValue = mainWindow.isMaximized;
  });
  ipcMain.on("minimize", () => {
    mainWindow.minimize();
  });

  ipcMain.on("maximize", () => {
    mainWindow.maximize();
  });
  ipcMain.on("close-window", () => {
    mainWindow.close();
  });
  ipcMain.on("unmaximize", () => {
    mainWindow.unmaximize();
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");
  mainWindow.setMenu(null);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("web-contents-created", function (webContentsCreatedEvent, contents) {
  if (contents.getType() === "webview") {
    contents.addListener("new-window", function (newWindowEvent, url) {
      newWindowEvent.preventDefault();
    });
  }
});

app.whenReady().then(() => {
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
