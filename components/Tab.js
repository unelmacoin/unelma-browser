const { ipcRenderer } = require("electron");
const Tab = (input) => {
  const tab = document.createElement("div");
  const tabContent = document.createElement("div");
  const closeTab = document.createElement("button");
  tab.classList.add("tab");
  tab.id = `tab-${Math.round(Math.random() * 10000 * Math.random())}`;
  setTimeout(() => (tabContent.textContent = "Unelma Search"), 300);
  closeTab.innerHTML = "&#10006;";
  tabContent.classList.add("content");
  closeTab.classList.add("close");
  tab.appendChild(tabContent);
  tab.appendChild(closeTab);
  tabContent.addEventListener("click", () => {
    [...document.querySelectorAll(".active-tab")].forEach((t) => {
      t.classList.remove("active-tab");
      ipcRenderer.send("change-tab", {
        id: tab.id,
      });
      ipcRenderer.on("tab-info", (_, { url }) => {
        input.value = url;
      });
    });
    tab.classList.add("active-tab");
  });
  closeTab.addEventListener("click", function () {
    ipcRenderer.send("close-tab", {
      tabId: tab.id,
    });
    tab.remove();
    ipcRenderer.on(
      "close-tab-info",

      (_, { currentTab, tabId, url }) => {
        if (currentTab)
          document.getElementById(tabId).classList.add("active-tab");
        input.value = url;
      }
    );
    
  });
  return tab;
};

module.exports = Tab;
