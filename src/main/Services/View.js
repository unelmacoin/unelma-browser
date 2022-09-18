import { BrowserView } from "electron";
import {
  PADDING,
  SIDE_BAR_RIGHT_MARGIN,
  TOP_BAR_HEIGHT,
} from "../../constants/global/dimensions";

export class View {
  parentWindow;
  url;
  isActive;
  view;
  width;
  height;
  id;
  x;
  title;
  fail;
  loading;
  y;
  constructor({ url, parentWindow, id, isActive }) {
    this.parentWindow = parentWindow;
    this.id = id;
    this.loading = true;
    this.fail = false;
    this.url = url;
    this.title = "";
    this.isActive = isActive || true;
    this.width =
      Math.floor(this.parentWindow.getBounds().width * 0.8) -
      PADDING * 2 -
      SIDE_BAR_RIGHT_MARGIN;
    this.height =
      this.parentWindow.getBounds().height - TOP_BAR_HEIGHT - PADDING;
    this.x =
      Math.floor(this.parentWindow.getBounds().width * 0.2) +
      PADDING +
      SIDE_BAR_RIGHT_MARGIN;
    this.y = TOP_BAR_HEIGHT;
    this.view = new BrowserView({
      webPreferences: {
        preload: UNELMA_BROWSER_PRELOAD_WEBPACK_ENTRY,
      },
    });
    this.view.setBackgroundColor("white");
    this.view.setBounds({
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    });
    this.loadURL(this.url);
    this.contents.addListener("dom-ready", () => {
      this.contents.send("ready");
    });
  }
  fit(isToggled) {
    if (isToggled) {
      this.width =
        Math.floor(this.parentWindow.getBounds().width * 0.8) -
        PADDING * 2 -
        SIDE_BAR_RIGHT_MARGIN;
      this.x =
        Math.floor(this.parentWindow.getBounds().width * 0.2) +
        PADDING +
        SIDE_BAR_RIGHT_MARGIN;
    } else {
      this.width =
        Math.floor(this.parentWindow.getBounds().width * 0.98) -
        PADDING * 2 -
        SIDE_BAR_RIGHT_MARGIN;
      this.x =
        Math.floor(this.parentWindow.getBounds().width * 0.02) +
        PADDING +
        SIDE_BAR_RIGHT_MARGIN;
    }
    this.height =
      this.parentWindow.getBounds().height - TOP_BAR_HEIGHT - PADDING;
    this.view.setBounds({
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    });
  }
  active() {
    this.isActive = true;
    this.view.setBounds({
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    });
  }
  deActive() {
    this.isActive = false;
    this.view.setBounds({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
  }
  loadURL(url) {
    this.view.webContents.loadURL(url);
    this.url = url;
  }
  destroy() {
    this.view.webContents.destroy();
  }
  hide() {
    this.view.setBounds({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
  }
  show() {
    this.view.setBounds({
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    });
  }
  startLoad() {
    this.loading = true;
  }
  finishLoad() {
    this.url = this.view.webContents.getURL();
    this.loading = false;
    this.title = this.view.webContents.getTitle() || this.url;
    this.fail = this.url === this.title || false;
  }
  failLoad() {
    this.url = this.view.webContents.getURL();
    this.loading = false;
    this.title = this.view.webContents.getTitle() || this.url;
    this.fail = true;
  }
  goBack() {
    if (this.view.webContents.canGoBack()) this.view.webContents.goBack();
  }
  goForward() {
    if (this.view.webContents.canGoForward()) this.view.webContents.goForward();
  }
  reload() {
    this.view.webContents.reload();
  }
  destroy() {
    if (!this.view.webContents.isDestroyed()) {
      this.view.webContents.destroy();
      this.view.setBounds({ x: 0, y: 0, width: 0, height: 0 });
      this.view = null;
    }
  }
  get contents() {
    return this.view.webContents;
  }
}
