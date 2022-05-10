const { ipcRenderer } = require("electron");
const addTab = require("./utils/addTab");
const addWindowControls = require("./utils/addWindowControls");
const goToLocation = require("./utils/goToLocation");
const handleMaximization = require("./utils/handleMaximization");

window.addEventListener("DOMContentLoaded", function () {
  const menubar = document.getElementById("menu-bar");
  const add = document.getElementById("add");
  const tabs = document.getElementById("actual-tabs");
  const controls = document.getElementById("controls");
  const closeBtn = document.getElementById("close-btn");
  const minimizeBtn = document.getElementById("minimize-btn");
  const maximizeBtn = document.getElementById("maximize-btn");
  const unmaximizeBtn = document.getElementById("unmaximize-btn");
  const locationForm = document.getElementById("location-form");
  const locationInput = document.getElementById("location");
  const backBtn = document.getElementById("back");
  const forwardBtn = document.getElementById("forward");
  const homeBtn = document.getElementById("home");
  const reloadBtn = document.getElementById("reload");
  const y = controls.clientHeight + menubar.clientHeight;

  backBtn.addEventListener("click", () => {
    ipcRenderer.send("go-back");
    ipcRenderer.on("change-urls", (_, url) => {
      locationInput.value = url;
    });
  });
  forwardBtn.addEventListener("click", () => {
    ipcRenderer.send("go-forward");
    ipcRenderer.on("change-urls", (_, url) => {
      locationInput.value = url;
    });
  });
  homeBtn.addEventListener("click", function () {
    if (locationInput.value !== "https://www.unelma.xyz/") {
      locationInput.value = "https://www.unelma.xyz/";
      goToLocation(locationInput);
    }
  });
  reloadBtn.addEventListener("click", function () {
    ipcRenderer.send("reload");
    // ipcRenderer.on("finish-load", ({ title, id }) => {
    //   document.getElementById(id).children[0].textContent= title
    // });
  });
  locationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    goToLocation(locationInput);
  });
  addTab(y, tabs, locationInput);
  ipcRenderer.on("open-target",(_,url)=> {
    addTab(y, tabs, locationInput,url);
  });
  ipcRenderer.on("getInfo", (_, { title, id }) => {
    document.getElementById(id).children[0].textContent =
      title.length > 25 ? `${title.slice(0, 25)}...` : title;
  });
  addWindowControls(closeBtn, minimizeBtn);
  handleMaximization(unmaximizeBtn, maximizeBtn);
  add.addEventListener("click", () => {
    addTab(y, tabs, locationInput);
  });
});
