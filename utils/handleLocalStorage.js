const newId = () => Math.round(Math.random() * 10000 * Math.random());
const dateTime = () => new Date(Date.now());
module.exports = {
  getCurrentTabs: () => {
    const tabs = JSON.parse(localStorage.getItem("current-tabs") || "{}")[
      window.id
    ];
    return tabs ? tabs : [];
  },
  setCurrentTabs: (tabs) => {
    let newTabs = JSON.parse(localStorage.getItem("current-tabs") || "{}");
    newTabs[window.id] = tabs;
    localStorage.setItem("current-tabs", JSON.stringify({ ...newTabs }));
  },
  resetTabs: () => {
    localStorage.setItem("current-tabs", JSON.stringify({}));
  },
  getSearchHistory: () => {
    return JSON.parse(localStorage.getItem("search-history") || "[]");
  },
  setSearchHistory: (history) => {
    localStorage.setItem("search-history", JSON.stringify(history));
  },
  addHistory: (url) => {
    let history = JSON.parse(localStorage.getItem("search-history") || "[]");
    if (
      url !== "https://www.unelma.xyz/" &&
      !url.includes("history.html") &&
      !url.includes("bookmarks.html") &&
      !history.find((item) => item.url === url)
    ) {
      const id = newId();
      history.push({ id, url, time: dateTime() });
      localStorage.setItem("search-history", JSON.stringify(history));
    }
  },
  getBookmarks: () => {
    return JSON.parse(localStorage.getItem("bookmarks") || "[]");
  },
  setBookmarks: (marks) => {
    localStorage.setItem("bookmarks", JSON.stringify(marks));
  },
  addBookmark: (url) => {
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    if (
      !bookmarks.find((item) => item.url === url) &&
      !url.endsWith("bookmarks.html") &&
      !url.endsWith("history.html")
    ) {
      const id = newId();
      bookmarks.push({ id, url, time: dateTime() });
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }
  },
  removeFromBookmarks: (url) => {
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    bookmarks = bookmarks.filter((item) => item.url !== url);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  },
  removeFromSearchHistroy: (url) => {
    let history = JSON.parse(localStorage.getItem("bookmarks") || "[]");

    history = history.filter((item) => item.url !== url);
    localStorage.setItem("search-history", JSON.stringify(history));
  },
};
