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
  })
  webview.addEventListener("did-start-loading", () => {
    const currentTab = document.getElementById(`tab-${id}`);
    currentTab.children[0].textContent = "Loading...";
  });
 
  webview.addEventListener("did-finish-load", () => {
    const currentTab = document.getElementById(`tab-${id}`);
    currentTab.children[0].textContent = webview.getTitle();
   
  });
  webview.addEventListener("did-frame-finish-load", () => {
    const currentTab = document.getElementById(`tab-${id}`);
    currentTab.children[0].textContent = webview.getTitle();
     document.getElementById("location-input").value = webview.getURL();
     
  });
  return webview;
};
module.exports = Webview;
