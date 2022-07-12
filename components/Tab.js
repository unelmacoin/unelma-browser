const { ipcRenderer } = require("electron");
const {
  setCurrentTabs,
  getCurrentTabs,
} = require("../utils/handleLocalStorage");
const { handleBookmarksUI } = require("../utils/handleNavigationsUI");
const { getCorrectSibling, removeClass } = require("../utils/tabs");
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
  const currentView = document.getElementById(`webview-${id}`);

  const handleCloseTab = function () {
    const currentTabs = getCurrentTabs();
    const newTabs = currentTabs.filter((tab) => tab.id !== id);
    setCurrentTabs(newTabs);
    if (tab.parentElement.children.length === 1) {
      ipcRenderer.send("close-window", window.id);
    } else {
      const tabSibling = getCorrectSibling(tab);
      const viewSibling = getCorrectSibling(currentView);
      if (tab.classList.contains("active-tab")) {
        tabSibling.classList.add("active-tab");
        viewSibling.classList.add("active-webview");
      }
      input.value = viewSibling.getURL();
      tab.remove();
      currentView.remove();
      handleBookmarksUI();
    }
  };
  const handleActivateTab = function (e) {
    removeClass("active-tab");
    removeClass("active-webview");
    tab.classList.add("active-tab");
    currentView.classList.add("active-webview");
    input.value = currentView.getURL();
    handleBookmarksUI();
  };
  closeTab.addEventListener("click", handleCloseTab);
  tabContentContainer.addEventListener("click", handleActivateTab);
  return tab;
};

module.exports = Tab;
