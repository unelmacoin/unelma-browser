const { decrypt, encrypt } = require("../utils/encryption");
const Store = require("electron-store");
const uniqid = require("uniqid");
const store = new Store();

module.exports = {
  getAuthInfo: () => {
    const authInfo = store.get("auth") || [];
    return authInfo.map((info) => ({
      ...info,
      password: decrypt(info.password),
    }));
  },
  addAuthInfo: (info) => {
    let authInfo = store.get("auth") || [];
    if (!authInfo.find(({ id }) => id === info.id)) {
      authInfo.push({
        ...info,
        password: encrypt(info.password),
        id: uniqid(),
      });
    }
    store.set("auth", authInfo);
  },
  removeFromAuthInfo: (id) => {
    let authInfo = store.get("auth") || [];
    store.set(
      "auth",
      authInfo.filter((item) => item.id !== id)
    );
  },
};
