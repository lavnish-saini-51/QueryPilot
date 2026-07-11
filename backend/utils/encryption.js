const crypto = require('crypto-js');

const encrypt = (text) => {
  return crypto.AES.encrypt(text, process.env.ENCRYPTION_KEY).toString();
};

const decrypt = (cipherText) => {
  const bytes = crypto.AES.decrypt(cipherText, process.env.ENCRYPTION_KEY);
  return bytes.toString(crypto.enc.Utf8);
};

module.exports = { encrypt, decrypt };