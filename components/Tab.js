const { ipcRenderer } = require("electron");
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
  });
  closeTab.addEventListener("click", function () {
    const tabs = document.getElementById("actual-tabs").children;
    if (tabs.length === 1) {
      ipcRenderer.send("close-window");
    } else {
      const views = document.getElementById("webviews-container").children;
      const tabIndex = [...tabs].findIndex((t) => t.id.endsWith(id));
      const viewIndex = [...views].findIndex((t) => t.id.endsWith(id));
      if (tab.classList.contains("active-tab")) {
        console.log("tests1");
        tabs[tabIndex].remove();
        views[viewIndex].remove();
        tabs[tabIndex === 0 ? tabIndex + 1 : tabIndex - 1].classList.add(
          "active-tab"
        );
        views[tabIndex === 0 ? viewIndex + 1 : viewIndex - 1].classList.add(
          "active-webview"
        );
      } else {
        console.log("tests2");
        tabs[tabIndex].remove();
        views[viewIndex].remove();
      }
    }
  });
  return tab;
};

module.exports = Tab;
