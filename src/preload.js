const { contextBridge, ipcRenderer } = require("electron");
const {
  RECIEVE_CHANNELS,
  GET_LOGIN_INFO,
  LOGIN_INFO,
  SEND_CHANNELS,
  REQUEST_START,
} = require("./constants/global/channels");

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    if (SEND_CHANNELS.find((c) => channel.includes(c))) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    if (RECIEVE_CHANNELS.find((c) => channel.includes(c))) {
      ipcRenderer.on(channel, (_, ...args) => func(...args));
    }
  },
});
window.addEventListener("load", () => {
  const commonInputnames = ["user", "email", "login", "phone"];
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

  const submitListener = (_, site) => {
    const inputs = [...document.querySelectorAll("input")];
    const username = getUsername(inputs)?.value;
    const password = getPassword(inputs)?.value;
    if (password) {
      ipcRenderer.send(GET_LOGIN_INFO, {
        password,
        username,
        site,
      });
    }
  };

  ipcRenderer.on(LOGIN_INFO, (_, info) => {
    const passwordInput = getPassword([...document.querySelectorAll("input")]);
    const usernameInput = getUsername([...document.querySelectorAll("input")]);
    if (passwordInput && usernameInput) {
      passwordInput.value = info.password;
      usernameInput.value = info.username;
      ["input", "click", "change", "blur"].forEach((event) => {
        const changeEvent = new Event(event, {
          bubbles: true,
          cancelable: true,
        });
        passwordInput.dispatchEvent(changeEvent);
        usernameInput.dispatchEvent(changeEvent);
      });
    }
  });
  ipcRenderer.on(REQUEST_START, submitListener);
});
