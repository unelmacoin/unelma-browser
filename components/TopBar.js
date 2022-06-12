const handleMaximization = require("../utils/handleMaximization");
const TopBar = () => {
  const topBar = document.createElement("div");
  topBar.classList.add("top-bar");
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
  handleMaximization(
    windowControlsUnmaximize,
    windowControlsMaximize,
    windowControlsClose,
    windowControlsMinimize
  );
  topBar.appendChild(windowControlsMinimize);
  topBar.appendChild(windowControlsMaximize);
  topBar.appendChild(windowControlsUnmaximize);
  topBar.appendChild(windowControlsClose);
  return topBar;
};
module.exports = TopBar;