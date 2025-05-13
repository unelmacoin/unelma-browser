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
  hidden;
  workspaceId;
  constructor({ url, parentWindow, id, isActive, isToggled, workspaceId }) {
    if (parentWindow?.getBounds()) {
      if (!parentWindow?.isDestroyed()) {
        this.parentWindow = parentWindow;
        this.id = id;
        this.hidden = false;
        this.loading = true;
        this.fail = false;
        this.url = url;
        this.title = url;
        this.isActive = isActive || true;
        this.height =
          this.parentWindow.getBounds().height - TOP_BAR_HEIGHT - PADDING;
        this.y = TOP_BAR_HEIGHT;
        this.workspaceId = workspaceId || "default";
        if (!isToggled) {
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
      }
      let preloadScript = UNELMA_BROWSER_PRELOAD_WEBPACK_ENTRY;
      if (typeof url === 'string' && url.includes('youtube.com')) {
        const path = require('path');
        preloadScript = path.join(__dirname, 'preload_youtube.js');
      }
      this.view = new BrowserView({
        webPreferences: {
          preload: preloadScript,
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
  }
  fit(isToggled) {
    if (!this.parentWindow?.isDestroyed()) {
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
  }
  active(isToggled) {
    this.isActive = true;
    this.fit(isToggled);
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
    try {
      this.contents.loadURL(url);
      this.url = url;
    } catch (error) {
      console.error(error);
    }
  }
  // destroy() {
  //   this.contents.destroy();
  // }
  hide() {
    this.hidden = true;
    this.view.setBounds({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
  }
  show() {
    this.hidden = false;
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
    this.url = this.contents.getURL();
    this.loading = false;
    this.title = this.contents.getTitle() || this.url;
    this.fail = false;
  }
  failLoad() {
    this.url = this.contents.getURL();
    this.loading = false;
    this.title = this.contents.getTitle() || this.url;
    this.fail = true;
  }
  goBack() {
    if (this.contents.canGoBack()) this.contents.goBack();
  }
  goForward() {
    if (this.contents.canGoForward()) this.contents.goForward();
  }
  reload() {
    this.contents.reload();
  }
  destroy() {
    if (!this.contents.isDestroyed()) {
      this.contents.destroy();
      this.view.setBounds({ x: 0, y: 0, width: 0, height: 0 });
      this.view = null;
    }
  }
  get contents() {
    return this.view?.webContents;
  }
  fitToWidth(sidebarWidth) {
    if (!this.parentWindow?.isDestroyed()) {
      // Calculate new dimensions
      const newWidth =
        Math.floor(this.parentWindow.getBounds().width) -
        sidebarWidth -
        PADDING * 2 -
        SIDE_BAR_RIGHT_MARGIN;
      const newX = sidebarWidth + PADDING + SIDE_BAR_RIGHT_MARGIN;
      const newHeight =
        this.parentWindow.getBounds().height - TOP_BAR_HEIGHT - PADDING;

      // Always update bounds to ensure proper positioning
      this.width = newWidth;
      this.x = newX;
      this.height = newHeight;

      // Use setBounds for atomic update
      if (this.view) {
        this.view.setBounds({
          x: this.x,
          y: this.y,
          width: this.width,
          height: this.height,
        });
      }
    }
  }
}
