const { decrypt, encrypt } = require('../utils/encryption');
const Store = require('electron-store');
const uniqid = require('uniqid');
const store = new Store();

const OBJECT_NAME = 'password-autofill-v01';
module.exports = {
  getAuthInfo: () => {
    const authInfo = store.get(OBJECT_NAME) || [];
    return authInfo.map((info) => ({
      ...info,
      password: decrypt(info.password),
    }));
  },
  addAuthInfo: (info) => {
    let authInfo = store.get(OBJECT_NAME) || [];

    const existingPasswordIndex = authInfo.findIndex(
      (item) => item.id === info.id
    );
    // Searches existing password.
    // If true, updates the edited password. If false, adds new password.
    if (existingPasswordIndex !== -1) {
      authInfo[existingPasswordIndex] = {
        ...authInfo[existingPasswordIndex],
        ...info,
        password: encrypt(info.password),
      };
    } else {
      authInfo.push({
        ...info,
        password: encrypt(info.password),
        id: uniqid(),
      });
    }
    store.set(OBJECT_NAME, authInfo);
  },
  removeFromAuthInfo: (id) => {
    let authInfo = store.get(OBJECT_NAME) || [];
    store.set(
      OBJECT_NAME,
      authInfo.filter((item) => item.id !== id)
    );
  },
};
