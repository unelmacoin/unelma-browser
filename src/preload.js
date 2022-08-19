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
  const commoninputPass = ["pas", "pass", "password"];
  const recognizeInputFieldByKeywords = (keywords) => (inputField) => {
    const attrValues = inputField
      .getAttributeNames()
      .map((name) => inputField.getAttribute(name));
    return attrValues.find((attrValue) =>
      keywords.find((name) => attrValue.toLowerCase().includes(name))
    );
  };
  const getUsername = (inputs) =>
    inputs.find((input) =>
      recognizeInputFieldByKeywords(commonInputnames)(input)
    );
  const getPassword = (inputs) =>
    inputs.find((input) =>
      recognizeInputFieldByKeywords(commoninputPass)(input)
    );
  ipcRenderer.on("ready", () => {
    const submitListener = () => {
      const inputs = [...document.querySelectorAll("input")];
      const username = getUsername(inputs)?.value;
      const password = getPassword(inputs)?.value;
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
      if (password) {
        ipcRenderer.sendToHost("get-login-info", {
          password,
          username,
          site: window.location.href,
        });
      }
    };

    ipcRenderer.on("login-info", (_, info) => {
      const passwordInput = document.querySelector('input[type="password"]');
      passwordInput.value = info.password;
      const usernameInput = getUsername([...document.querySelectorAll("input")])
      usernameInput.value = info.username;
      passwordInput.dispatchEvent(new Event('input'));
      passwordInput.dispatchEvent(new Event("change"));
      usernameInput.dispatchEvent(new Event("input"));
      usernameInput.dispatchEvent(new Event("change"));
    });
    document.body.addEventListener("submit", submitListener);
  });
});
