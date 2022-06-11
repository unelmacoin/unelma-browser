module.exports = {
  getCurrentTabs: () => {
    return JSON.parse(localStorage.getItem("current-tabs") || "[]");
  },
  setCurrentTabs: (tabs) => {
    localStorage.setItem("current-tabs", JSON.stringify(tabs));
  },
  getSearchHistory: () => {
    return JSON.parse(localStorage.getItem("search-history") || "[]");
  },
  setSearchHistory: (history) => {
    localStorage.setItem("search-history", JSON.stringify(history));
  },
  getBookmarks: () => {
    return JSON.parse(localStorage.getItem("bookmarks") || "[]");
  },
  setBookmarks: (marks) => {
    localStorage.setItem("bookmarks", JSON.stringify(marks));
  },
};
