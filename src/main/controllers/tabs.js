const Store = require("electron-store");
const store = new Store();
module.exports = {
  setTabs: (tabs, windowId) => {
    let currentViews = store.get("views") || {};
  
    if (tabs.length > 0) {
      currentViews[windowId] = tabs;
    } else delete currentViews[windowId];
    store.set("views", currentViews);
  },
  getWindowTabs: (windowId) => {
     return store.get("views")
       ? store.get("views")[windowId]
         ? store.get("views")[windowId]
         : []
       : [];
  },
  getTabsWindows: () => {
    const tabs = store.get("views") || {};
    return Object.keys(tabs) || [];
  },
  resetWindowTabs: (windowId) => {
    let tabs = store.get("views") || {};
    delete tabs[windowId];
    store.set("views", tabs);
  },
  resetAllTabs: () => {
    store.set("views", {});
  },
};
