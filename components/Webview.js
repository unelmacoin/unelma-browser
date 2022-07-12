const handleFavicon = require("../utils/handleFavicon");
const { handleBookmarksUI } = require("../utils/handleNavigationsUI");

const Webview = (id, url) => {
  const webview = document.createElement("webview");
  webview.id = `webview-${id}`;
  webview.src = url;
  webview.setAttribute("allowpopups", "true");
  webview.setAttribute("webpreferences", "nativeWindowOpen=true");
  webview.addEventListener("dom-ready", () => {
    webview.insertCSS("body::-webkit-scrollbar {width: 4px;}");
    webview.insertCSS(
      "body:::-webkit-scrollbar-track {background: transparent;}"
    );
    webview.insertCSS(
      "body::-webkit-scrollbar-thumb {background: rgba(51, 51, 51, 0.349);"
    );
  });
  webview.addEventListener("did-start-loading", () => {
    const currentTab = document.getElementById(`tab-${id}`);
    currentTab.children[0].children[1].textContent = "Loading...";
  });

  webview.addEventListener("did-finish-load", () => {
    const currentTab = document.getElementById(`tab-${id}`);
    currentTab.children[0].children[1].textContent = webview.getTitle();
    currentTab.children[0].children[0].src = handleFavicon(webview.getURL());
    handleBookmarksUI()
  });
  webview.addEventListener("did-frame-finish-load", () => {
    const currentTab = document.getElementById(`tab-${id}`);
    currentTab.children[0].children[1].textContent = webview.getTitle();
    document.getElementById("location-input").value = webview.getURL();
    currentTab.children[0].children[0].src = handleFavicon(webview.getURL());
    handleBookmarksUI();
  });
  
  return webview;
};
module.exports = Webview;
