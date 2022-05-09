const { ipcRenderer } = require("electron");

const handleMaximization = (unmaximizeBtn, maximizeBtn) => {
  const isMaximized = ipcRenderer.send("isMaximized", "check");
  unmaximizeBtn.style.display = !isMaximized ? "block" : "none";
  maximizeBtn.style.display = !isMaximized ? "none" : "block";
  maximizeBtn.addEventListener("click", () => {
    ipcRenderer.send("unmaximize", true);
    maximizeBtn.style.display = "none";
    unmaximizeBtn.style.display = "block";
  });
  unmaximizeBtn.addEventListener("click", () => {
    ipcRenderer.send("maximize", true);
    maximizeBtn.style.display = "block";
    unmaximizeBtn.style.display = "none";
  });
};
module.exports = handleMaximization;
