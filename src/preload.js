const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    let validChannels = [
      "create-window",
      "reset-all-tabs",
      "maximize",
      "unmaximize",
      "minimize",
      "close-window",
      "add-bookmark",
      "remove-from-bookmarks",
      "add-auth-info",
      "remove-from-auth-info",
      "add-history",
      "remove-from-search-histroy",
      "reset-window-tabs",
      "add-tab",
      "remove-tab",
      "update-tab",
      "activate-tab",
      "update-active-tab",
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = [
      "window-ready",
      "get-current-tabs",
      "get-search-history",
      "get-bookmarks",
      "get-auth-info",
      "is-maximized",
      "get-windows-number",
    ];
    if (validChannels.find((c) => channel.includes(c))) {
      ipcRenderer.on(channel, (_, ...args) => func(...args));
    }
  },
  dirname: () => __dirname,
});
window.addEventListener("DOMContentLoaded", () => {
  const commonInputnames = ["login", "user", "email"];
  const recognizeUsername = (inpytName) => {
    const lowerCaseInputName = inpytName.toLowerCase();
    return !!commonInputnames.find((name) =>
      lowerCaseInputName?.includes(name)
    );
  };
  const getUsername = (inputs) =>
    inputs.find((input) => recognizeUsername(input?.name));
  ipcRenderer.on("ready", () => {
    const submitListener = () => {
      const inputs = [...document.querySelectorAll("input")];
      const username = getUsername(inputs);
      const password = document.querySelector('input[type="password"]').value;
      if (password) {
        ipcRenderer.sendToHost("get-login-info", {
          password,
          username: username?.value,
          site: window.location.href,
        });
      }
    };

    ipcRenderer.on("login-info", (_, info) => {
      document.querySelector('input[type="password"]').value = info.password;
      getUsername([...document.querySelectorAll("input")]).value =
        info.username;
    });
    document.body.addEventListener("submit", submitListener);
  });
});
