const { ipcRenderer } = require("electron");
const {
  setCurrentTabs,
  getCurrentTabs,
  getBookmarks,
} = require("../utils/handleLocalStorage");
const Tab = (input, id) => {
  const tab = document.createElement("div");
  const favIcon = document.createElement("img");
  const tabContent = document.createElement("div");
  const tabContentContainer = document.createElement("div");
  const closeTab = document.createElement("button");
  tab.classList.add("tab");
  tab.id = `tab-${id}`;
  closeTab.innerHTML = "&#10006;";
  tabContentContainer.classList.add("content");
  closeTab.classList.add("close");
  tabContentContainer.appendChild(favIcon);
  tabContentContainer.appendChild(tabContent);
  tab.appendChild(tabContentContainer);
  tab.appendChild(closeTab);
  tabContentContainer.addEventListener("click", () => {
    [...document.querySelectorAll(".active-tab")].forEach((t) => {
      t.classList.remove("active-tab");
    });

    [...document.querySelectorAll(".active-webview")].forEach((t) => {
      t.classList.remove("active-webview");
    });

    const currentView = document.getElementById(`webview-${id}`);
    tab.classList.add("active-tab");
    currentView.classList.add("active-webview");

    input.value = currentView.getURL();
    const bookmarks = getBookmarks();
    const bookmarkBtn = document.getElementById("bookmark-btn");
    if (bookmarks.find((item) => item.url === input.value))
      bookmarkBtn.classList.add("active");
    else bookmarkBtn.classList.remove("active");
  });
  closeTab.addEventListener("click", function () {
    const currentTabs = getCurrentTabs();
    const newTabs = currentTabs.filter((tab) => tab.id !== id);
    setCurrentTabs(newTabs);
    const tabs = document.getElementById("actual-tabs").children;
    if (tabs.length === 1) {
      ipcRenderer.send("close-window", window.id);
    } else {
      const views = document.getElementById("webviews-container").children;
      const tabIndex = [...tabs].findIndex((t) => t.id.endsWith(id));
      const viewIndex = [...views].findIndex((t) => t.id.endsWith(id));
      if (tab.classList.contains("active-tab")) {
        tabs[tabIndex].remove();
        views[viewIndex].remove();
        tabs[tabIndex === 0 ? tabIndex + 1 : tabIndex - 1].classList.add(
          "active-tab"
        );
        views[tabIndex === 0 ? viewIndex + 1 : viewIndex - 1].classList.add(
          "active-webview"
        );
      } else {
        tabs[tabIndex].remove();
        views[viewIndex].remove();
      }
    }
    const bookmarks = getBookmarks();
    const bookmarkBtn = document.getElementById("bookmark-btn");
    if (bookmarks.find((item) => item.url === input.value))
      bookmarkBtn.classList.add("active");
    else bookmarkBtn.classList.remove("active");
  });
  return tab;
};

module.exports = Tab;
