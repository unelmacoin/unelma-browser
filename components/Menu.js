const { ipcRenderer } = require("electron");
const addTab = require("../utils/addTab");
const closeTabs = require("../utils/closeTabs");
const {
  getCurrentTabs,
  resetWindowTabs,
  resetAllTabs,
} = require("../utils/handleLocalStorage");

const menuItems = [
  {
    name: "Bookmarks",
    url: "bookmarks.html",
    icon: "bookmark",
  },
  {
    name: "History",
    url: "history.html",
    icon: "history",
  },
];

const Menu = () => {
  const menu = document.createElement("div");
  menu.id = "menu";
  const menuList = document.createElement("ul");
  menuList.id = "menu-list";
  const bookmarks = document.createElement("li");
  bookmarks.id = "bookmarks";
  menuItems.forEach((item) => {
    const menuItem = document.createElement("li");
    menuItem.classList.add("menu-item");
    menuItem.innerHTML = `<i class="fa fa-${item.icon}"></i> ${item.name}`;
    menuItem.addEventListener("click", () => {
      menu.classList.remove("open");
      const historyTab = getCurrentTabs().find(
        (item) => item.url === "history.html"
      );
      const bookmarksTab = getCurrentTabs().find(
        (item) => item.url === "bookmarks.html"
      );
      if (!historyTab && item.url === "history.html") {
        addTab("history.html");
      }
      if (!bookmarksTab && item.url === "bookmarks.html") {
        addTab("bookmarks.html");
      }
    });
    menuList.appendChild(menuItem);
  });
  const tabsItem = document.createElement("li");
  tabsItem.innerHTML = `<i class="fa fa-times"></i> Close tabs`;
  tabsItem.classList.add("menu-item");
  tabsItem.addEventListener('click',()=> {
    menu.classList.remove("open");
    resetWindowTabs()
    closeTabs();
  })
  const removeTabsItem = document.createElement("li");
  removeTabsItem.innerHTML = `<i class="fa fa-trash"></i> Clear all tabs`;
  removeTabsItem.classList.add("menu-item");
  removeTabsItem.addEventListener("click", () => {
    menu.classList.remove("open");
    resetAllTabs();
  });
   const newWindowItem = document.createElement("li");
  newWindowItem.innerHTML = `<i class="fa fa-window-maximize"></i> New Window`;
  newWindowItem.classList.add("menu-item");
  newWindowItem.addEventListener("click", () => {
    ipcRenderer.send('create-window')
  });
  menuList.appendChild(newWindowItem);
  menuList.appendChild(tabsItem);
  menuList.appendChild(removeTabsItem);
  menu.appendChild(menuList);
  return menu;
};
module.exports = Menu;
