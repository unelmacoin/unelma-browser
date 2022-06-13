const addTab = require("../utils/addTab");
const { getCurrentTabs } = require("../utils/handleLocalStorage");

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
  menu.appendChild(menuList);
  return menu;
};
module.exports = Menu;
