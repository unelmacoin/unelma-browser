const newId = () => Math.round(Math.random() * 10000 * Math.random());
const dateTime = () => new Date(Date.now());
export function getCurrentTabs() {
  const tabs = JSON.parse(localStorage.getItem("current-tabs") || "{}")[window.id];
  return tabs ? tabs : [];
}
export function setCurrentTabs(tabs) {
  let newTabs = JSON.parse(localStorage.getItem("current-tabs") || "{}");
  newTabs[window.id] = tabs;
  localStorage.setItem("current-tabs", JSON.stringify({ ...newTabs }));
}
export function resetWindowTabs() {
  const tabs = JSON.parse(localStorage.getItem("current-tabs") || "{}");
  tabs[window.id] = [];
  localStorage.setItem("current-tabs", JSON.stringify(tabs));
}
export function resetAllTabs() {
  localStorage.setItem("current-tabs", JSON.stringify({}));
}
export function getSearchHistory() {
  return JSON.parse(localStorage.getItem("search-history") || "[]");
}
export function setSearchHistory(history) {
  localStorage.setItem("search-history", JSON.stringify(history));
}
export function addHistory(url) {
  let history = JSON.parse(localStorage.getItem("search-history") || "[]");
    const id = newId();
    history.push({ id, url, time: dateTime() });
    localStorage.setItem("search-history", JSON.stringify(history));
  
}
export function getBookmarks() {
  return JSON.parse(localStorage.getItem("bookmarks") || "[]");
}
export function setBookmarks(marks) {
  localStorage.setItem("bookmarks", JSON.stringify(marks));
}
export function addBookmark(url,type) {
  let bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
  if (!bookmarks.find((item) => item.url === url) && type === 'webview') {
    const id = newId();
    bookmarks.push({ id, url, time: dateTime() });
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
}
export function removeFromBookmarks(url) {
  let bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
  bookmarks = bookmarks.filter((item) => item.url !== url);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}
export function removeFromSearchHistroy(id) {
  let history = JSON.parse(localStorage.getItem("search-history") || "[]");
  history = history.filter((item) => item.id !== id);
  localStorage.setItem("search-history", JSON.stringify(history));
}
