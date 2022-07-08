const { ipcRenderer } = require("electron");

const handleMaximization = ( maximizeBtn,unmaximizeBtn, cancelBtn,minimizeBtn) => {
  const isMaximized = ipcRenderer.send("isMaximized", "check");
  unmaximizeBtn.style.display = !isMaximized ? "block" : "none";
  maximizeBtn.style.display = !isMaximized ? "none" : "block";
  maximizeBtn.addEventListener("click", () => {
    ipcRenderer.send("unmaximize", window.id);
    maximizeBtn.style.display = "none";
    unmaximizeBtn.style.display = "block";
  });
  unmaximizeBtn.addEventListener("click", () => {
    ipcRenderer.send("maximize", window.id);
    maximizeBtn.style.display = "block";
    unmaximizeBtn.style.display = "none";
  });
  cancelBtn.addEventListener("click", () => {
    ipcRenderer.send("close-window", window.id);
  });
  minimizeBtn.addEventListener("click", () => {
    ipcRenderer.send("minimize", window.id);
  });
};
module.exports = handleMaximization;
