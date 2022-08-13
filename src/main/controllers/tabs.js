const Store = require("electron-store");

const store = new Store();
const uniqid = require("uniqid");
const { UNELMA_DEFAULT_URL } = require("../../constants/global/urls");
module.exports = {
  getWindowTabs: (windowId) => {
    const tabs = store.get("tabs") || [];
    const windowTabs = tabs.filter((tab) => tab.windowId === windowId);
    if (windowTabs.length > 0) {
      return windowTabs;
    }
    store.set("tabs", [
      ...tabs,
      {
        id: uniqid(),
        url: UNELMA_DEFAULT_URL,
        active: true,
        windowId,
        title: "Unelma Search",
        loading: false,
        type: "webview",
      },
    ]);
    return store.get("tabs").filter((tab) => tab.windowId === windowId);
  },
  getTabsWindows: () => {
    const tabs = store.get("tabs") || [];
    return [...new Set(tabs.map((tab) => tab.windowId))];
  },
  addTab: (tab) => {
    const tabs = store.get("tabs") || [];
    if (!tabs.find((t) => t.id === tab.id)) {
      store.set("tabs", [
        ...tabs.map((tabElm) =>
          tabElm.windowId === tab.windowId
            ? { ...tabElm, active: false }
            : tabElm
        ),
        tab,
      ]);
    }
  },
  updateTab: (tab) => {
    const tabs = store.get("tabs") || [];
    store.set(
      "tabs",
      tabs.map((tabElm) =>
        tabElm.id === tab.id ? { ...tabElm, ...tab } : tabElm
      )
    );
  },
  removeTab: (id, windowId) => {
    const tabs = store.get("tabs") || [];
    const windowTabs = store
      .get("tabs")
      .filter((tab) => tab.windowId === windowId);
    const elmIndex = windowTabs.findIndex(({ id: tabId }) => tabId === id);
    if (elmIndex !== -1) {
      if (windowTabs[elmIndex].active) {
        if (windowTabs.length === 1) {
          store.set("tabs", [
            {
              id: "ff3d3e21",
              url: UNELMA_DEFAULT_URL,
              active: true,
              windowId,
              title: "Unelma Search",
              loading: false,
              type: "webview",
            },
          ]);
          return;
        }
        if (elmIndex === 0 && windowTabs.length > 1) {
          windowTabs[elmIndex + 1].active = true;
          store.set(
            "tabs",
            tabs.filter((tab) => tab.id !== id)
          );
          return;
        }
        windowTabs[elmIndex - 1].active = true;
        store.set(
          "tabs",
          tabs.filter((tab) => tab.id !== id)
        );
        return;
      }
    }
    store.set(
      "tabs",
      tabs.filter((tab) => tab.id !== id)
    );
  },
  activateTab: (tab) => {
    const tabs = store.get("tabs") || [];
    if (tab.id) {
      store.set(
        "tabs",
        [...tabs].map((tabElm) =>
          tabElm.windowId === tab.windowId
            ? tabElm.id === tab.id
              ? { ...tabElm, active: true }
              : { ...tabElm, active: false }
            : tabElm
        )
      );
    } else {
      store.set(
        "tabs",
        [...tabs].map((tabElm) =>
          tabElm.windowId === tab.windowId
            ? tabElm.type === tab.tabType
              ? { ...tabElm, active: true }
              : { ...tabElm, active: false }
            : tabElm
        )
      );
    }
  },
  updateActiveTab: (tab) => {
    const tabs = store.get("tabs") || [];
    store.set(
      "tabs",
      [...tabs].map((tabELm) =>
        tabELm.active && tab.windowId === tab.windowId
          ? { ...tabELm, ...tab }
          : tabELm
      )
    );
  },
  resetWindowTabs: (windowId) => {
    const tabs = store.get("tabs") || [];
    store.set(
      "tabs",
      tabs.filter((tab) => tab.windowId !== windowId)
    );
  },
  resetAllTabs: (windowId) => {
    store.set("tabs", [
      {
        id: "ff3d3e21",
        url: UNELMA_DEFAULT_URL,
        active: true,
        windowId,
        title: "Unelma Search",
        loading: false,
        type: "webview",
      },
    ]);
  },
};
