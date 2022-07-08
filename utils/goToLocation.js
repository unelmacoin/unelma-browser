const {
  setCurrentTabs,
  getBookmarks,
  addHistory,
} = require("./handleLocalStorage");
const handleSearch = require("./handleSearch");

const goToLocation = (input) => {
  const activeWebview = document.querySelector(".active-webview");
  const id = +activeWebview.id.split("-")[1];
  activeWebview.src = handleSearch(input.value);
  input.value = handleSearch(input.value);
  const currentTabs = JSON.parse(localStorage.getItem("current-tabs"))[window.id];
  const indexOfCurrentTab = currentTabs.findIndex((tab) => tab.id === id);
  currentTabs[indexOfCurrentTab].url = handleSearch(input.value);
  setCurrentTabs(currentTabs);
  addHistory(handleSearch(input.value));
  const bookmarks = getBookmarks();
  const bookmarkBtn = document.getElementById("bookmark-btn");
  if (bookmarks.find((item) => item.url === handleSearch(input.value)))
    bookmarkBtn.classList.add("active");
  else bookmarkBtn.classList.remove("active");
};

module.exports = goToLocation;
