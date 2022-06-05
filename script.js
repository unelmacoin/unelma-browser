const Sidebar = require("./components/Sidebar");
const addTab = require("./utils/addTab");

window.addEventListener("DOMContentLoaded", function () {
  const root = document.getElementById("root");
  root.style.height = `${window.innerHeight}px`;
  const content = document.createElement("div");
  content.id = "webviews-container";
  root.style.height = window.innerHeight + "px";
  const sidebar = Sidebar();
  root.appendChild(sidebar);
  root.appendChild(content);
  const controllers = document.getElementById("controllers");
  const actualTabs = document.getElementById("actual-tabs");
  const LocationForm = document.getElementById("location-form");
  actualTabs.style.maxHeight = `${
    sidebar.clientHeight -
    controllers.clientHeight -
    LocationForm.clientHeight -
    115
  }px`;
  window.addEventListener("resize", function () {
    root.style.height = window.innerHeight + "px";
    actualTabs.style.maxHeight = `${
      sidebar.clientHeight -
      controllers.clientHeight -
      LocationForm.clientHeight -
      115
    }px`;
  });
  addTab();
});
