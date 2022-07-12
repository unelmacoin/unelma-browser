const Tab = require("../components/Tab");
const Webview = require("../components/Webview");
const {
  getCurrentTabs,
  setCurrentTabs,
  addHistory,
} = require("./handleLocalStorage");
const { handleBookmarksUI } = require("./handleNavigationsUI");
const newId = () => Math.round(Math.random() * 10000 * Math.random());
const addTab = (passedURL, isNew, oldId) => {
  const id = oldId || newId();
  const url = passedURL ? passedURL : "https://www.unelma.xyz/";
  const tabs = document.getElementById("actual-tabs");
  const views = document.getElementById("webviews-container");
  const locationInput = document.getElementById("location-input");
  if (tabs.children.length < 500) {
    const newWebview = Webview(id, url);
    views.appendChild(newWebview);
    const newTab = Tab(locationInput, id, url);
    tabs.appendChild(newTab);
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

    newWebview.addEventListener("dom-ready", () => {
      if (url.endsWith("history.html") || url.endsWith("bookmarks.html")) {
        newWebview.executeJavaScript(
          "window.localStorage.setItem('search-history', JSON.stringify(JSON.parse(localStorage.getItem('search-history')||'[]')));"
        );
        newWebview.executeJavaScript(
          "window.localStorage.setItem('bookmarks', JSON.stringify(JSON.parse(localStorage.getItem('bookmarks')||'[]')));"
        );
      }
    });

    locationInput.value = url;
    handleBookmarksUI();
  }
  addHistory(url);
};
module.exports = addTab;
