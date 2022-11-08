const Store = require("electron-store");
const store = new Store();
module.exports = {
  setTabs: (tabs, windowId) => {
    let currentViews = store.get("views-v01") || {};
  
    if (tabs.length > 0) {
      currentViews[windowId] = tabs;
    } else delete currentViews[windowId];
    store.set("views-v01", currentViews);
  },
  getWindowTabs: (windowId) => {
     return store.get("views-v01")
       ? store.get("views-v01")[windowId]
         ? store.get("views-v01")[windowId]
         : []
       : [];
  },
  getTabsWindows: () => {
    const tabs = store.get("views-v01") || {};
    return Object.keys(tabs) || [];
  },
  resetWindowTabs: (windowId) => {
    let tabs = store.get("views-v01") || {};
    delete tabs[windowId];
    store.set("views-v01", tabs);
  },
  resetAllTabs: () => {
    store.set("views-v01", {});
  },
};
