const { app } = require("electron");
import { UNELMA_SUPPORT_URL } from "../../constants/global/urls";
import { MainWindow } from "./MainWindow";
import {
  ADD_VIEW,
  ADD_TAB,
  mergeChannel,
} from "../../constants/global/channels";

const isMac = process.platform === "darwin";
let mainWindow;

const handleAddNewTab = (url) => {
  const newTab = defaultTab(window.id, url);
  window.api.send(mergeChannel(ADD_VIEW, window.id), { ...newTab });
  tabsDispatch({
    type: ADD_TAB,
    payload: {
      tab: { ...newTab },
    },
  });
  setShowSearchList(false);
};

export const template = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideOthers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
      ]
    : []),
  {
    label: "File",
    submenu: [isMac ? { role: "close" } : { role: "quit" }],
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
      ...(isMac
        ? [
            { role: "pasteAndMatchStyle" },
            { role: "delete" },
            { role: "selectAll" },
            { type: "separator" },
            {
              label: "Speech",
              submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
            },
          ]
        : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
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
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...(isMac
        ? [
            { type: "separator" },
            { role: "front" },
            { type: "separator" },
            { role: "window" },
          ]
        : [{ role: "close" }]),
    ],
  },
  {
    role: "Help",
    submenu: [
      {
        label: "Get Help",
        click: () => {
          mainWindow = new MainWindow(null, UNELMA_SUPPORT_URL)
          app.on("ready-to-show", () => {
            mainWindow.window.show()
          })
        },
      },
    ],
  },
];
