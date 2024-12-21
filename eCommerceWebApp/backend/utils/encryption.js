const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

const ENCRYPTION_KEY = process.env.CARD_ENCRYPTION_KEY;
const algorithm = "aes-256-cbc";

const encrypt = (text) => {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
    throw new Error(
      "Invalid encryption key. Key must be 32 btytes(64 hex characters"
    );
  }

  const key = Buffer.from(ENCRYPTION_KEY, "hex");
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text.toString());
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted.toString("hex"),
  };
};

const decrypt = (text, iv) => {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
    throw new Error(
      "Invalid encryption key. Key must be 32 btytes(64 hex characters"
    );
  }

  const key = Buffer.from(ENCRYPTION_KEY, "hex");
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, "hex")
  );

  let decrypted = decipher.update(Buffer.from(text, "hex"));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString();
};

module.exports = { decrypt, encrypt };
