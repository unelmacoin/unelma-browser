const { decrypt, encrypt } = require("../utils/encryption");
const Store = require("electron-store");
const uniqid = require("uniqid");
const store = new Store();

module.exports = {
  getAuthInfo: () => {
    const authInfo = store.get("authh") || [];
    return authInfo.map((info) => ({
      ...info,
      password: decrypt(info.password),
    }));
  },
  addAuthInfo: (info) => {
    let authInfo = store.get("authh") || [];
    if (!authInfo.find(({ id }) => id === info.id)) {
      authInfo.push({
        ...info,
        password: encrypt(info.password),
        id: uniqid(),
      });
    }
    
    store.set("authh", authInfo);
    console.log('authh',store.get("authh"))
  },
  removeFromAuthInfo: (id) => {
    let authInfo = store.get("authh") || [];
    store.set(
      "authh",
      authInfo.filter((item) => item.id !== id)
    );
  },
};
