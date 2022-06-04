const Sidebar = require("./components/Sidebar");
const addTab = require("./utils/addTab");

window.addEventListener("DOMContentLoaded", function () {
  const root = document.getElementById("root");
  root.style.height = `${window.innerHeight}px`;
  const content = document.createElement("div");
  content.id = "webviews-container";
  root.style.height = window.innerHeight + "px";
  root.appendChild(Sidebar());
  root.appendChild(content);
  window.addEventListener("resize", function () {
    root.style.height = window.innerHeight + "px";
  });
  addTab();
});
