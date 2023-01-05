const Store = require("electron-store");
const store = new Store();

const  OBJECT_NAME = 'browser-views'
module.exports = {
  setTabs: (tabs, windowId) => {
    let currentViews = store.get(OBJECT_NAME) || {};
  
    if (tabs.length > 0) {
      currentViews[windowId] = tabs;
    } else delete currentViews[windowId];
    store.set(OBJECT_NAME, currentViews);
  },
  getWindowTabs: (windowId) => {
     return store.get(OBJECT_NAME)
       ? store.get(OBJECT_NAME)[windowId]
         ? store.get(OBJECT_NAME)[windowId]
         : []
       : [];
  },
  getTabsWindows: () => {
    const tabs = store.get(OBJECT_NAME) || {};
    return Object.keys(tabs) || [];
  },
  resetWindowTabs: (windowId) => {
    let tabs = store.get(OBJECT_NAME) || {};
    delete tabs[windowId];
    store.set(OBJECT_NAME, tabs);
  },
  resetAllTabs: () => {
    store.set(OBJECT_NAME, {});
  },
};
