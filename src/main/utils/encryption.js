const CryptoJS = require("crypto-js");
module.exports = {
  encrypt: (plainText) => {
    return CryptoJS.AES.encrypt(plainText||'', process.env.SECRET_KEY).toString();
  },
  decrypt: (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext||'', process.env.SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  },
};
