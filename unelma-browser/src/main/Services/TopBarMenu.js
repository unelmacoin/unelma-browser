const { app } = require("electron");
import { UNELMA_SUPPORT_URL } from "../../constants/global/urls";
import { MainWindow } from "./MainWindow";

let mainWindow;

export const topBarMenuList = [
  {
    label: "File",
    submenu: [
      { role: "about" },
      { type: "separator" },
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
    label: "Help",
    submenu: [
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
