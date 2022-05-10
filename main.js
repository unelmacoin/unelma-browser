// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, BrowserView, shell } = require("electron");
const path = require("path");

let views = [];
let yDim = 0;
const createView = ({ y, mainWindow, id, e, url }) => {
  yDim = y;
  if (views.length > 0) {
    views[views.length - 1].view.setBounds({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
  }
  const view = new BrowserView();

  // console.log("y", y);
  view.setBounds({
    x: 0,
    y,
    width: mainWindow.getBounds().width,
    height: mainWindow.getBounds().height,
  });
  view.setAutoResize({
    width: true,
    horizontal: true,
  });
  view.webContents.addListener("did-start-loading", function () {
    // e.reply("isLoading", {
    //   loading: true,
    //   id: views.find(({ currentTab }) => currentTab).tabId,
    // });
  });
  view.webContents.addListener("did-finish-load", function () {
    e.reply("getInfo", {
      title: views
        .find(({ currentTab }) => currentTab)
        .view.webContents.getTitle(),
      id: views.find(({ currentTab }) => currentTab).tabId,
    });
  });
  view.webContents.addListener("page-title-updated", function () {
    e.reply("getInfo", {
      title: views
        .find(({ currentTab }) => currentTab)
        .view.webContents.getTitle(),
      id: views.find(({ currentTab }) => currentTab).tabId,
    });
  });
  view.webContents.addListener("did-navigate-in-page", function () {
    e.reply("change-url", {
      newURL: view.webContents.getURL(),
    });
  });
  view.webContents.addListener("update-target-url", function () {
    e.reply("change-urls", view.webContents.getURL());
  });

  views = views.map((v) => ({ ...v, currentTab: false }));
  views.push({
    view,
    tabId: id,
    currentTab: true,
    previousTab: false,
  });
  view.webContents.loadURL(url);
  return view;
};
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: "Unelma.XYZ - Browser",
    width: 1024,
    height: 768,
    icon: path.join(__dirname, "./img/unelma.ico"),
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      devTools: true,
      contextIsolation: false,
    },
  });

  ipcMain.on("goToLocation", (_, location) => {
    const { view } = views.find(({ currentTab }) => currentTab);
    view.webContents.loadURL(location);
  });
  ipcMain.on("isMaximized", (event) => {
    event.returnValue = mainWindow.isMaximized;
  });
  ipcMain.on("minimize", () => {
    mainWindow.minimize();
  });
  ipcMain.on("go-back", (e) => {
    // console.log("jkefssssss");
    if (
      views.find(({ currentTab }) => currentTab).view.webContents.canGoBack()
    ) {
      views.find(({ currentTab }) => currentTab).view.webContents.goBack();
      e.reply(
        "go-back-info",
        views.find(({ currentTab }) => currentTab).view.webContents.getURL()
      );
    }
  });
  ipcMain.on("go-forward", (e) => {
    // console.log("jkefssssss");
    if (
      views.find(({ currentTab }) => currentTab).view.webContents.canGoForward()
    ) {
      e.reply(
        "go-forward-info",
        views.find(({ currentTab }) => currentTab).view.webContents.getURL()
      );
      views.find(({ currentTab }) => currentTab).view.webContents.goForward();
    }
  });
  ipcMain.on("reload", () => {
    views.find(({ currentTab }) => currentTab).view.webContents.reload();
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
  ipcMain.on("close-tab", (e, { tabId }) => {
    if (views.length === 1) {
      views[0].view = null;
      mainWindow.close();
    } else {
      const targetTab = views.find((tab) => tab.tabId === tabId);
      const { view, currentTab } = targetTab;
      const index = views.indexOf(targetTab);
      view.setBounds({ x: 0, y: 0, width: 0, height: 0 });
      if (currentTab && index !== 0) {
        views[index - 1].currentTab = true;
        // views[index - 1].previousTab = false;
        views[index - 1].view.setBounds({
          x: 0,
          width: mainWindow.getBounds().width,
          height: mainWindow.getBounds().height,
          y: yDim,
        });
        e.reply("close-tab-info", {
          url: views[index - 1].view.webContents.getURL(),
          currentTab: true,
          tabId: views[index - 1].tabId,
        });
      }

      mainWindow
        .getBrowserViews()
        .find((v) => v === views[index].view)
        .webContents.destroy();
      mainWindow.removeBrowserView(
        mainWindow.getBrowserViews().find((v) => v === views[index].view)
      );
      views[index].view = null;

      views[index].currentTab = false;
      views.splice(index, 1);
      // console.log(mainWindow.getBrowserViews());
    }
  });
  ipcMain.on("change-tab", (e, { id }) => {
    // views.find((v) => v.tabId === id).currentTab = true

    views.forEach((c) => {
      if (c.tabId !== id) {
        c.view.setBounds({ x: 0, y: 0, width: 0, height: 0 });
        c.currentTab = false;
      } else {
        c.currentTab = true;
        c.view.setBounds({
          x: 0,
          y: yDim,
          width: mainWindow.getBounds().width,
          height: mainWindow.getBounds().height,
        });
        e.reply("tab-info", { url: c.view.webContents.getURL() });
        // currentView = tabOrder;
        // console.log(index, tabOrder);
      }
    });
    //console.log(views);
  });

  ipcMain.on("add", function (e, { id, y, url }) {
    const view = createView({ y, mainWindow, id, e, url });

    view.webContents.setWindowOpenHandler((url) => {
      //console.log(url);
      // shell.openExternal(
      //   "https://www.electronjs.org/docs/latest/api/web-contents"
      // );
      // let v = createView({ y, mainWindow, id, e });
      // mainWindow.addBrowserView(v);
      // v.webContents.loadURL(url.url);
      e.reply("open-target", url.url);
      e.reply("getInfo", {
        title: views
          .find(({ currentTab }) => currentTab)
          .view.webContents.getTitle(),
        id: views.find(({ currentTab }) => currentTab).tabId,
      });
      return {action:'deny'};
    });

    mainWindow.addBrowserView(view);
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
