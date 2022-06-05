const NavigationControls = () => {
  const navigationControls = document.createElement("div");
  navigationControls.id = "navigation-controllers";
  const navigationControlsBack = document.createElement("button");
  navigationControlsBack.id = "navigation-controls-back";
  navigationControlsBack.innerHTML = '<i class="fa fa-arrow-left"></i>';
  const navigationControlsForward = document.createElement("button");
  navigationControlsForward.id = "navigation-controls-forward";
  navigationControlsForward.innerHTML = '<i class="fa fa-arrow-right"></i>';
  const navigationControlsReload = document.createElement("button");
  navigationControlsReload.id = "navigation-controls-reload";
  navigationControlsReload.innerHTML = '<i class="fa fa-refresh"></i>';
  navigationControls.appendChild(navigationControlsBack);
  navigationControls.appendChild(navigationControlsForward);
  navigationControls.appendChild(navigationControlsReload);
  navigationControlsBack.addEventListener("click", () => {
    const currentView = document.querySelector(".active-webview");
    if (currentView.canGoBack()) {
      currentView.goBack();
      document.getElementById("location-input").value = currentView.getURL();
    }
  });
  navigationControlsForward.addEventListener("click", () => {
    const currentView = document.querySelector(".active-webview");
    if (currentView.canGoForward()) {
      currentView.goForward();
      document.getElementById("location-input").value = currentView.getURL();
    }
  });
  navigationControlsReload.addEventListener("click", function () {
    const currentView = document.querySelector(".active-webview");
    currentView.reload();
    document.getElementById("location-input").value = currentView.getURL();
  });

  return navigationControls;
};
module.exports = NavigationControls;
