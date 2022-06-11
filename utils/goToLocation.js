const {
  setCurrentTabs,
  getSearchHistory,
  setSearchHistory,
  getBookmarks,
} = require("./handleLocalStorage");
const handleSearch = require("./handleSearch");

const newId = () => Math.round(Math.random() * 10000 * Math.random());

const goToLocation = (input) => {
  const activeWebview = document.querySelector(".active-webview");
  const id = +activeWebview.id.split("-")[1];
  activeWebview.src = handleSearch(input.value);
  input.value = handleSearch(input.value);
  const currentTabs = JSON.parse(localStorage.getItem("current-tabs"));
  const indexOfCurrentTab = currentTabs.findIndex((tab) => tab.id === id);
  currentTabs[indexOfCurrentTab].url = handleSearch(input.value);
  setCurrentTabs(currentTabs);
  const searchHistory = getSearchHistory();
  searchHistory.push({ id: newId(), url: handleSearch(input.value) });
  setSearchHistory(searchHistory);
   const bookmarks = getBookmarks();
   const bookmarkBtn = document.getElementById("bookmark-btn");
   if (bookmarks.find((item) => item.url === handleSearch(input.value))) {
     bookmarkBtn.style.color = "gold";
   } else bookmarkBtn.style.color = "rgba(51, 51, 51, 0.699)";
};

module.exports = goToLocation;
