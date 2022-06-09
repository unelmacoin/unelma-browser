const Tab = require("../components/Tab");
const Webview = require("../components/Webview");
const { getCurrentTabs, setCurrentTabs } = require("./handleLocalStorage");
const newId = () => Math.round(Math.random() * 10000 * Math.random());
const addTab = (passedURL, isNew, oldId) => {
  const id = oldId || newId();
  const url = passedURL ? passedURL : "https://www.unelma.xyz/";
  const tabs = document.getElementById("actual-tabs");
  const views = document.getElementById("webviews-container");
  const locationInput = document.getElementById("location-input");
  if (tabs.children.length < 500) {
    const newTab = Tab(locationInput, id);
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
    locationInput.value = url;
  }
};
module.exports = addTab;
