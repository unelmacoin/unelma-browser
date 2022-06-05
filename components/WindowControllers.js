const handleMaximization = require("../utils/handleMaximization");

const WindowControllers = () => {
  const windowControls = document.createElement("div");
  windowControls.id = "window-controllers";
  const windowControlsClose = document.createElement("button");
  windowControlsClose.id = "window-controls-close";
  windowControlsClose.innerHTML = '<i class="fa fa-times"></i>';
  const windowControlsMinimize = document.createElement("button");
  windowControlsMinimize.id = "window-controls-minimize";
  windowControlsMinimize.innerHTML = '<i class="fa fa-minus"></i>';
  const windowControlsMaximize = document.createElement("button");
  windowControlsMaximize.id = "window-controls-maximize";
  windowControlsMaximize.innerHTML = '<i class="fa fa-expand"></i>';
 
  const windowControlsUnmaximize = document.createElement("button");
  windowControlsUnmaximize.id = "window-controls-unmaximize";
  windowControlsUnmaximize.innerHTML = '<i class="fa fa-compress"></i>';

  windowControls.appendChild(windowControlsClose);
  windowControls.appendChild(windowControlsMinimize);
  windowControls.appendChild(windowControlsMaximize);
  windowControls.appendChild(windowControlsUnmaximize);
  const toggleBtn = document.createElement("button");
  toggleBtn.id = "toggle-btn";
  toggleBtn.innerHTML = '<img src="img/sidebar.png" alt="toggle" />';
  windowControls.appendChild(toggleBtn);
  handleMaximization(
    windowControlsUnmaximize,
    windowControlsMaximize,
    windowControlsClose,
    windowControlsMinimize
  );
  toggleBtn.addEventListener("click", () => {
    const sidebar = document.getElementById("app-sidebar");
    if (!sidebar.classList.contains("toggled-sidebar")) {
      document.getElementById("app-sidebar").classList.add("toggled-sidebar");
      document
        .getElementById("webviews-container")
        .classList.add("toggled-container");
    } else {
      document
        .getElementById("app-sidebar")
        .classList.remove("toggled-sidebar");
      document
        .getElementById("webviews-container")
        .classList.remove("toggled-container");
    }
  });
  return windowControls;
};
module.exports = WindowControllers;
