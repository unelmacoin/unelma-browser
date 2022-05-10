const Tab = require("../components/Tab");
const { ipcRenderer } = require("electron");

const addTab = (y, tabs, input, url) => {
  if (tabs.children.length < 25) {
    const newTab = Tab(input);
    [...document.querySelectorAll(".active-tab")].forEach((t) => {
      t.classList.remove("active-tab");
    });
    newTab.classList.add("active-tab");
    tabs.appendChild(newTab);
    input.value = url ? url : "https://www.unelma.xyz/";
    ipcRenderer.send("add", {
      id: newTab.id,
      y,
      url: url || "https://www.unelma.xyz/",
    });
    const tabsContainerWidth = document.querySelector(".left").clientWidth;
    const tabsList = Array.from(tabs.children);
    const totalTabsWidth = tabsList.reduce((acc, t) => acc + t.clientWidth, 0);
    if (totalTabsWidth >= tabsContainerWidth - 200) {
      //console.log(tabsContainerWidth);
      tabsList.forEach((t) => {
        t.style.width = `${tabsContainerWidth / tabsList.length - 5}px`;
      });
    }
  }
};
module.exports = addTab;
