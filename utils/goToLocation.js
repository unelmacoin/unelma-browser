const handleSearch = require("./handleSearch");

const goToLocation = (input) => {
  const activeWebview = document.querySelector(".active-webview");
  const id = +activeWebview.id.split("-")[1];
  activeWebview.src = handleSearch(input.value);
  input.value = handleSearch(input.value);
  const currentTabs = JSON.parse(localStorage.getItem("current-tabs"));
  const indexOfCurrentTab = currentTabs.findIndex((tab) => tab.id === id);
  currentTabs[indexOfCurrentTab].url = handleSearch(input.value);
  localStorage.setItem("current-tabs", JSON.stringify(currentTabs));
};

module.exports = goToLocation;
