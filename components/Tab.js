const { ipcRenderer } = require("electron");
const {
  setCurrentTabs,
  getCurrentTabs,
  getBookmarks,
} = require("../utils/handleLocalStorage");
const Tab = (input, id) => {
  const tab = document.createElement("div");
  const tabContent = document.createElement("div");
  const closeTab = document.createElement("button");
  tab.classList.add("tab");
  tab.id = `tab-${id}`;
  setTimeout(() => (tabContent.textContent = "Unelma Search"), 300);
  closeTab.innerHTML = "&#10006;";
  tabContent.classList.add("content");
  closeTab.classList.add("close");
  tab.appendChild(tabContent);
  tab.appendChild(closeTab);
  tabContent.addEventListener("click", () => {
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
    if (bookmarks.find((item) => item.url === input.value)) {
      bookmarkBtn.style.color = "gold";
    } else bookmarkBtn.style.color = "rgba(51, 51, 51, 0.699)";
  });
  closeTab.addEventListener("click", function () {
    const currentTabs = getCurrentTabs();
    const newTabs = currentTabs.filter((tab) => tab.id !== id);
    setCurrentTabs(newTabs);
    const tabs = document.getElementById("actual-tabs").children;
    if (tabs.length === 1) {
      ipcRenderer.send("close-window");
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
  });
  return tab;
};

module.exports = Tab;
