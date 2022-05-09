const { ipcRenderer } = require("electron");

const addWindowControls = (close, minimize) => {
  close.addEventListener("click", () => {
    ipcRenderer.send("close-window");
  });
  minimize.addEventListener("click", () => {
    ipcRenderer.send("minimize");
  });
};

module.exports = addWindowControls;
