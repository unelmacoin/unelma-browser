const LocationForm = require("./LocationForm");
const NavigationControls = require("./NavigationControls");
const OptionsBar = require("./OptionsBar");
const TabsList = require("./TabsList");
const WindowControllers = require("./WindowControllers");

const Sidebar = () => {
  const appSidebar = document.createElement("div");
    appSidebar.id = "app-sidebar";
  const controllers = document.createElement("div");
    controllers.id = "controllers";
  controllers.appendChild(WindowControllers());
  controllers.appendChild(NavigationControls());
  appSidebar.appendChild(controllers);
  appSidebar.appendChild(LocationForm());
  appSidebar.appendChild(OptionsBar());
  appSidebar.appendChild(TabsList());
  return appSidebar;
};
module.exports = Sidebar;
