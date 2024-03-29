const {
  Menu,
  app,
  BrowserWindow,
  ipcMain,
  session,
  globalShortcut,
  dialog,
} = require('electron');
import { getTabsWindows, resetAllTabs } from '../controllers/tabs';
import { ContextMenu } from './ContextMenu';
import { MainWindow } from './MainWindow';
import { addBookmark, removeFromBookmarks } from '../controllers/bookmarks';
import { addAuthInfo, removeFromAuthInfo } from '../controllers/passwords';
import { removeFromSearchHistroy } from '../controllers/searchHistory';
import {
  ADD_AUTH_INFO,
  ADD_BOOKMARK,
  CREATE_WINDOW,
  REMOVE_FROM_AUTH_INFO,
  REMOVE_FROM_BOOKMARKS,
  REMOVE_FROM_SEARCH_HISTORY,
  RESET_ALL_TABS,
  UPDATE_AUTH_INFO,
} from '../../constants/global/channels';
import { topBarMenuList } from './TopBarMenu.js';
const fs = require('fs');
const path = require('path');
const Store = require('electron-store');
const os = require('os');
const store = new Store();
export class App {
  windows;
  constructor() {
    this.windows = [];
    let addWindow = this.addWindow.bind(this);
    let closeWindow = this.closeWindow.bind(this);

    function createWindow() {
      const menu = Menu.buildFromTemplate(topBarMenuList);
      Menu.setApplicationMenu(menu);
    }

    app.on('ready', createWindow);

    app.on('web-contents-created', function (_, contents) {
      if (contents.getType() === 'browserView') {
        new ContextMenu(contents, addWindow);
        const ret = globalShortcut.register('CommandOrControl+P', () => {
          if (contents.isDestroyed()) {
            return;
          }
          contents.print();
        });
      }
    });

    app.whenReady().then(() => {
      const { updateElectronApp } = require('update-electron-app');

      updateElectronApp({
        updateInterval: '1 hour',
        notifyUser: true,
        logger: require('electron-log'),
      });

      let easyListTxt = fs.readFileSync(
        path.join(__dirname, '../../src/main/utils/adblocker/easylist.txt'),
        'utf-8'
      );
      store.set('easylist', easyListTxt);
      if (getTabsWindows().length > 0)
        getTabsWindows().forEach((windowId) => {
          addWindow(windowId);
        });
      else addWindow();
      app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0)
          if (getTabsWindows().length > 0)
            getTabsWindows().forEach((windowId) => {
              addWindow(windowId);
            });
          else addWindow();
      });
    });

    app.on('window-all-closed', function () {
      if (process.platform !== 'darwin') app.quit();
    });

    ipcMain.on(RESET_ALL_TABS, (_, windowId) => {
      getTabsWindows().forEach((win) => closeWindow(win));
      resetAllTabs(windowId);
    });

    ipcMain.on(ADD_AUTH_INFO, (_, info) => {
      addAuthInfo(info);
    });

    ipcMain.on(ADD_BOOKMARK, (_, bookmark) => {
      addBookmark(bookmark);
    });
    ipcMain.on(REMOVE_FROM_BOOKMARKS, (_, url) => {
      removeFromBookmarks(url);
    });
    ipcMain.on(REMOVE_FROM_SEARCH_HISTORY, (_, id) => {
      removeFromSearchHistroy(id);
    });
    ipcMain.on(REMOVE_FROM_AUTH_INFO, (_, id) => {
      removeFromAuthInfo(id);
    });
    ipcMain.on(CREATE_WINDOW, () => {
      addWindow();
    });

    ipcMain.handle('clear-cache-and-cookies', () => {
      let appDataPath;

      switch (process.platform) {
        case 'darwin':
          appDataPath = path.join(
            os.homedir(),
            'Library/Application Support/Unelma_Browser/'
          );
          break;
        case 'win32':
          appDataPath = path.join(os.homedir(), 'AppData/Local/electron/');
          break;
        case 'linux':
          appDataPath = path.join(os.homedir(), '.config/Unelma_Browser/');
          break;
        default:
          console.log('Platform not supported');
          return;
      }
      const cachePath = path.join(appDataPath, 'Cache');
      const cookiesPath = path.join(appDataPath, 'Cookies');

      try {
        if (fs.existsSync(cachePath)) {
          fs.rmSync(cachePath, { recursive: true, force: true });
        }
        if (fs.existsSync(cookiesPath)) {
          fs.unlinkSync(cookiesPath);
        }
        return 'Cache and cookies cleared successfully';
      } catch (error) {
        throw new Error('Failed to clear cache and cookies: ' + error.message);
      }
    });

    ipcMain.on('open-dialog', async (event) => {
      const result = await dialog.showMessageBox({
        type: 'question',
        message: 'Do you want to restore your previous session?',
        buttons: ['Yes', 'No'],
      });

      event.sender.send('dialog-closed', result);
    });
  }
  addWindow(id) {
    const window = new MainWindow(id);
    this.windows.push(window);
  }
  closeWindow(id) {
    const currentWindow = this.windows.find((w) => w?.windowId === id);
    currentWindow?.close();
    this.windows = this.windows.filter((win) => win.id !== id);
  }
}
