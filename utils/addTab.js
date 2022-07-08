const Tab = require("../components/Tab");
const Webview = require("../components/Webview");
const {
  getCurrentTabs,
  setCurrentTabs,
  getBookmarks,
  addHistory,
} = require("./handleLocalStorage");
const newId = () => Math.round(Math.random() * 10000 * Math.random());
const addTab = (passedURL, isNew, oldId) => {
  const id = oldId || newId();
  const url = passedURL ? passedURL : "https://www.unelma.xyz/";
  const tabs = document.getElementById("actual-tabs");
  const views = document.getElementById("webviews-container");
  const locationInput = document.getElementById("location-input");
  if (tabs.children.length < 500) {
    const newTab = Tab(locationInput, id,url);
    const newWebview = Webview(id, url);
    [...document.querySelectorAll(".active-tab")].forEach((t) => {
      t.classList.remove("active-tab");
    });
    [...document.querySelectorAll(".active-webview")].forEach((t) => {
      t.classList.remove("active-webview");
    });
    newTab.classList.add("active-tab");
    newWebview.classList.add("active-webview");

    const currentTabs = getCurrentTabs();
    currentTabs.push({ id, url });
    if (!isNew) setCurrentTabs(currentTabs);
    newWebview.addEventListener("new-window", (e) => {
      addTab(e.url);
    });
    tabs.appendChild(newTab);
    views.appendChild(newWebview);

    newWebview.addEventListener("dom-ready", () => {
      if (
        url.endsWith("history.html") ||
        url.endsWith("bookmarks.html")
      ) {
        newWebview.executeJavaScript(
          "window.localStorage.setItem('search-history', JSON.stringify(JSON.parse(localStorage.getItem('search-history')||'[]')));"
        );
        newWebview.executeJavaScript(
          "window.localStorage.setItem('bookmarks', JSON.stringify(JSON.parse(localStorage.getItem('bookmarks')||'[]')));"
        );
      }
    });
    const bookmarks = getBookmarks();
    const bookmarkBtn = document.getElementById("bookmark-btn");
    if (bookmarks.find((item) => item.url === url))
      bookmarkBtn.classList.add("active");
    else bookmarkBtn.classList.remove("active");

    locationInput.value = url;
  }
  addHistory(url);
};
module.exports = addTab;
