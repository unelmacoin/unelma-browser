const Store = require("electron-store");
const store = new Store();
module.exports = {
  setTabs: (tabs, windowId) => {
    let currentTabs = store.get("tabs") || {};
    if (tabs.length > 0) {
      currentTabs[windowId] = tabs;
    } else delete currentTabs[windowId];
    store.set("tabs", currentTabs);
  },
  getWindowTabs: (windowId) => {
    return store.get("tabs")[windowId] || [];
  },
  getTabsWindows: () => {
    const tabs = store.get("tabs") || {};
    return Object.keys(tabs) || [];
  },
  resetWindowTabs: (windowId) => {
    let tabs = store.get("tabs") || {};
    delete tabs[windowId];
    store.set("tabs", tabs);
  },
  resetAllTabs: () => {
    store.set("tabs", {});
  },
};
