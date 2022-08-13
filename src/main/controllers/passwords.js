const { decrypt, encrypt } = require("../utils/encryption");
const Store = require("electron-store");
const store = new Store();

module.exports = {
  getAuthInfo: () => {
    const authInfo = store.get("auth-info") || [];
    return authInfo.map((info) => ({
      ...info,
      password: decrypt(info.password),
    }));
  },
  addAuthInfo: (info) => {
    let authInfo = store.get("auth-info") || [];
    if (!authInfo.find(({ id }) => id === info.id)) {
      authInfo.push({ ...info, password: encrypt(info.password) });
    }
    store.set("auth-info", authInfo);
  },
  removeFromAuthInfo: (id) => {
    let authInfo = store.get("auth-info") || [];
    store.set(
      "auth-info",
      authInfo.filter((item) => item.id !== id)
    );
  },
};
