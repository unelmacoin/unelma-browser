const Sidebar = require("./components/Sidebar");
const addTab = require("./utils/addTab");
const TopBar = require("./components/TopBar");
const { getCurrentTabs } = require("./utils/handleLocalStorage");
const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", function () {
  ipcRenderer.on("window-ready", (_, windowId) => {
    window.id = windowId;
   
    const root = document.getElementById("root");
    root.style.height = `${window.innerHeight}px`;
    const content = document.createElement("div");
    content.id = "webviews-container";
    root.style.height = window.innerHeight + "px";
    const sidebar = Sidebar();
    root.appendChild(sidebar);
    root.appendChild(content);
    root.appendChild(TopBar());
    const controllers = document.getElementById("controllers");
    const actualTabs = document.getElementById("actual-tabs");
    const LocationForm = document.getElementById("location-form");
    actualTabs.style.maxHeight = `${
      sidebar.clientHeight -
      controllers.clientHeight -
      LocationForm.clientHeight -
      115
    }px`;
    window.addEventListener("resize", function () {
      root.style.height = window.innerHeight + "px";
      actualTabs.style.maxHeight = `${
        sidebar.clientHeight -
        controllers.clientHeight -
        LocationForm.clientHeight -
        115
      }px`;
    });
    const currentTabs = getCurrentTabs(windowId);
    if (currentTabs.length === 0) {
      addTab();
    } else {
      currentTabs.forEach((tab) => {
        addTab(tab.url, true, tab.id);
      });
    }
  });
});
