const { app } = require("electron");
import { UNELMA_SUPPORT_URL } from "../../constants/global/urls";
import { MainWindow } from "./MainWindow";

let mainWindow;

const fs = require('fs');
const path = require('path');
const { dialog } = require('electron');

// Use app-metadata.json generated at build time
function getAppMetadata() {
  let meta = {};
  try {
    let metaPath;
    if (process.mainModule && process.mainModule.filename) {
      // In production, this will be inside the asar or dist folder
      const root = path.dirname(process.mainModule.filename);
      metaPath = path.join(root, 'app-metadata.json');
      if (!fs.existsSync(metaPath)) {
        metaPath = path.join(root, '..', 'app-metadata.json');
      }
    } else {
      // Fallback for dev
      metaPath = path.join(__dirname, '../../app-metadata.json');
    }
    meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  } catch (e) {
    meta = {};
  }
  // Fallback to package.json for missing fields
  try {
    const pkgPath = path.join(__dirname, '../../package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    if (!meta.name) meta.name = pkg.name;
    if (!meta.version) meta.version = pkg.version;
    if (!meta.description) meta.description = pkg.description;
    if (!meta.author) meta.author = pkg.author;
    if (!meta.license) meta.license = pkg.license;
    if (!meta.homepage) meta.homepage = pkg.homepage;
  } catch (e) {}
  return meta;
}

function showAboutDialog() {
  const pkg = getAppMetadata();
  dialog.showMessageBox({
    type: 'info',
    title: `About ${pkg.name || ''}`,
    message: `${pkg.name || ''}`,
    detail: `Version: ${pkg.version || ''}\n${pkg.description || ''}\n\nAuthor: ${pkg.author || ''}\nLicense: ${pkg.license || ''}\nHomepage: ${pkg.homepage || ''}`,
    buttons: ['OK'],
  });
}

export const topBarMenuList = [
  {
    label: "File",
    submenu: [
      {
        label: "New Browser Window",
        accelerator: "CmdOrCtrl+N",
        click: () => {
          // Always open a new main browser window
          new MainWindow();
        }
      },
      { role: "close" },
      { type: "separator" },
      { role: "quit" },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "delete" },
      { type: "separator" },
      { role: "selectAll" },
    ],
  },
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  {
    label: "Window",
    submenu: [{ role: "minimize" }, { role: "zoom" }, { role: "close" }],
  },
  {
    label: "Bookmark",
    submenu: [
      {
        label: "Show All Bookmarks",
        click: () => {
          const { getBookmarks } = require("../controllers/bookmarks.js");
          const bookmarks = getBookmarks();
          const { dialog } = require("electron");
          dialog.showMessageBox({
            type: 'info',
            title: 'Bookmarks',
            message: 'All Bookmarks',
            detail: bookmarks.length ? bookmarks.map(b => `${b.title || b.url || b}`).join('\n') : 'No bookmarks found.',
            buttons: ['OK'],
          });
        },
      },
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "About",
        click: showAboutDialog
      },
      {
        label: "Get Help",
        click: () => {
          mainWindow = new MainWindow(null, UNELMA_SUPPORT_URL);
          app.on("ready-to-show", () => {
            mainWindow.window.show();
          });
        },
      },
    ],
  },
];
