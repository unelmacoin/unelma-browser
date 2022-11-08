const CryptoJS = require("crypto-js");
module.exports = {
  encrypt: (plainText) => {
    let encJson = CryptoJS.AES.encrypt(
      JSON.stringify(plainText||""),
      process.env.SECRET_KEY
    ).toString();
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson));
  },
  decrypt: (ciphertext) => {
     let decData = CryptoJS.enc.Base64.parse(ciphertext||'').toString(
       CryptoJS.enc.Utf8
     );
    let bytes = CryptoJS.AES.decrypt(decData, process.env.SECRET_KEY).toString(
      CryptoJS.enc.Utf8
    );
    return JSON.parse(bytes);
  },
};
