const addTab = require("../utils/addTab");

const TabsList = () => {
  const tabsList = document.createElement("div");
  tabsList.id = "tabs";
  const actualTabs = document.createElement("div");
  actualTabs.id = "actual-tabs";
  const addTabButton = document.createElement("button");
  addTabButton.id = "add-tab";
  addTabButton.innerHTML = `<i class="fa fa-plus"> </i><span>New tab</span>`;
  tabsList.appendChild(actualTabs);
  tabsList.appendChild(addTabButton);
  addTabButton.addEventListener("click", () => {
    addTab();
  });
  return tabsList;
};
module.exports = TabsList;
