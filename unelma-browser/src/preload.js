const { contextBridge, ipcRenderer } = require("electron");
const {
  RECIEVE_CHANNELS,
  GET_LOGIN_INFO,
  LOGIN_INFO,
  SEND_CHANNELS,
  REQUEST_START,
  FINISH_NAVIGATE,
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
  clearCacheAndCookies: () => {
    ipcRenderer.invoke('clear-cache-and-cookies');
  },
  openDialog: async () => {
    ipcRenderer.send('open-dialog');
    return new Promise(resolve => {
      ipcRenderer.once('dialog-closed', (event, result) => {
        resolve(result);
      });
    });
  },
});
window.addEventListener("load", () => {
  const commonInputnames = /user|email|login|phone/;
  const commoninputPass = /(pass-)|(-pass)|(password)/;
  const commonAdsKeyWords =
    /^(ad-)|^(ad_)|^(ads-)|^(ads_)|^(-ad-)|(_ad$)|(-ad$)|(_ads$)|(-ads$)|(\/ads\/)|(\/ad\/)/;
  const youtubeAds = /ytp-ad-(btn|text)/;
  const recognizeInputFieldByKeywords = (regex) => (inputField) => {
    const attrValues = inputField
      .getAttributeNames()
      .map((name) => inputField.getAttribute(name));
    return attrValues.find((attrValue) => regex.test(attrValue));
  };
  const getUsername = (inputs) =>
    inputs.find((input) =>
      recognizeInputFieldByKeywords(commonInputnames)(input)
    );
  const getPassword = (inputs) =>
    inputs.find((input) =>
      recognizeInputFieldByKeywords(commoninputPass)(input)
    );

  const getAdsBoxs = (boxs) =>
    boxs.filter((box) => recognizeInputFieldByKeywords(commonAdsKeyWords)(box));

  const onFinishNavigateOrFinishLoad = () => {
    getAdsBoxs([...document.getElementsByTagName("*")]).forEach((ad) => {
      ad.remove();
    });
  };
  const onRequestStart = (_, site) => {
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

  const onBeforeRequest = () => {
    getAdsBoxs([...document.getElementsByTagName("*")]).forEach((ad) => {
      
      ad.remove();
    });
    if (new URL(window.location.href).hostname === "www.youtube.com") {
      const getAdElements = (boxs) =>
        boxs.find((box) => recognizeInputFieldByKeywords(youtubeAds)(box));
      if (getAdElements([...document.getElementsByTagName("*")])) {
        window.document.body.style.border = "1px solid red";
        if (document.querySelector("video")) {
          document.querySelector("video").currentTime =
            document.querySelector("video").duration;
          document.querySelector(".ytp-ad-skip-button")?.click();
        }
      }
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
  ipcRenderer.on(REQUEST_START, onRequestStart);
  ipcRenderer.on(FINISH_NAVIGATE, onFinishNavigateOrFinishLoad);
  ipcRenderer.on("as", onBeforeRequest);
});
