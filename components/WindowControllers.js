const WindowControllers = () => {
  const windowControls = document.createElement("div");
  windowControls.id = "window-controllers"
  const toggleBtn = document.createElement("button");
  toggleBtn.id = "toggle-btn";
  toggleBtn.innerHTML = '<img src="img/sidebar.png" alt="toggle" />';
  windowControls.appendChild(toggleBtn);
  
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
