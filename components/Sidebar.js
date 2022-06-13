const BookmarkBtn = require("./BookmarkBtn");
const LocationForm = require("./LocationForm");
const Menu = require("./Menu");
const MenuButton = require("./MenuButton");
const NavigationControls = require("./NavigationControls");
const TabsList = require("./TabsList");
const WindowControllers = require("./WindowControllers");

const Sidebar = () => {
  const appSidebar = document.createElement("div");
    appSidebar.id = "app-sidebar";
  const controllers = document.createElement("div");
    controllers.id = "controllers";
    controllers.appendChild(MenuButton());
    controllers.appendChild(WindowControllers());
    controllers.appendChild(BookmarkBtn());
    controllers.appendChild(NavigationControls());
  appSidebar.appendChild(controllers);
  appSidebar.appendChild(LocationForm());
  appSidebar.appendChild(Menu());
  appSidebar.appendChild(TabsList());
  return appSidebar;
};
module.exports = Sidebar;
