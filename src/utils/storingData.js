const newId = () => Math.round(Math.random() * 10000 * Math.random());
const dateTime = () => new Date(Date.now());
const Store = require("electron-store");
const store = new Store();

export function getCurrentTabs(id) {
  const tabs = store.get("current-tabs")
    ? store.get("current-tabs")[id]
    : {}[id];
  return tabs ? tabs : [];
}
export function setCurrentTabs(tabs, id) {
  let newTabs = store.get("current-tabs") || {};
  newTabs[id] = tabs;
  store.set("current-tabs", { ...newTabs });
}
export function resetWindowTabs(id) {
  const tabs = store.get("current-tabs") || {};
  tabs[id] = [];
  store.set("current-tabs", tabs);
}
export function resetAllTabs() {
  store.set("current-tabs", {});
}
export function getSearchHistory() {
  return store.get("search-history") || [];
}
export function setSearchHistory(history) {
  store.set("search-history", history);
}
export function addHistory(url) {
  if (url !== "https://www.unelma.xyz/" && url !== "https://unelma.xyz/") {
    let history = store.get("search-history") || [];
    const id = newId();
    history.push({ id, url, time: dateTime() });
    store.set("search-history", history);
  }
}
export function getBookmarks() {
  return store.get("bookmarks") || [];
}
export function setBookmarks(bookmarks) {
  store.set("bookmarks", bookmarks);
}
export function addBookmark(url, type) {
  let bookmarks = store.get("bookmarks") || [];
  if (!bookmarks.find((item) => item.url === url) && type === "webview") {
    const id = newId();
    bookmarks.push({ id, url, time: dateTime() });
    store.set("bookmarks", bookmarks);
  }
}
export function removeFromBookmarks(url) {
  let bookmarks = store.get("bookmarks") || [];
  bookmarks = bookmarks.filter((item) => item.url !== url);
  store.set("bookmarks", bookmarks);
}
export function removeFromSearchHistroy(id) {
  let history = store.get("search-history") || [];
  history = history.filter((item) => item.id !== id);
  store.set("search-history", history);
}
