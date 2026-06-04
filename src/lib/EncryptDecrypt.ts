// 🔐 AES + RSA Hybrid Encryption (Production Safe)

// --------------------
// Base64 Helpers (SAFE)
// --------------------
const bufferToBase64 = (buffer: ArrayBuffer | ArrayBufferView) => {
  const bytes =
    buffer instanceof ArrayBuffer
      ? new Uint8Array(buffer)
      : new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);

  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return btoa(binary);
};

const base64ToBuffer = (base64: string): Uint8Array<ArrayBuffer> => {
  try {
    const cleaned = base64
      .replace(/-----BEGIN PUBLIC KEY-----/g, "")
      .replace(/-----END PUBLIC KEY-----/g, "")
      .replace(/-----BEGIN PRIVATE KEY-----/g, "")
      .replace(/-----END PRIVATE KEY-----/g, "")
      .replace(/\s/g, "");

    const binary = atob(cleaned);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
  } catch {
    console.error("❌ Invalid Base64:", base64);
    throw new Error("Base64 decoding failed");
  }
};

const textToBytes = (text: string): Uint8Array<ArrayBuffer> =>
  new TextEncoder().encode(text) as Uint8Array<ArrayBuffer>;

export const isWebCryptoAvailable = () =>
  typeof globalThis.crypto !== "undefined" &&
  typeof globalThis.crypto.subtle !== "undefined";

const getSubtleCrypto = () => {
  if (!isWebCryptoAvailable()) {
    throw new Error(
      "E2EE needs HTTPS on other devices. Open the app with https:// or use localhost on this same device; http://192.168.x.x cannot access browser Web Crypto.",
    );
  }

  return globalThis.crypto.subtle;
};

const derivePasswordKey = async (password: string, salt: BufferSource) => {
  const subtle = getSubtleCrypto();
  const passwordKey = await subtle.importKey(
    "raw",
    textToBytes(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 250000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
};

export interface EncryptedPrivateKey {
  cipherText: string;
  iv: string;
  salt: string;
}

// --------------------
// 🔑 Generate RSA Keys
// --------------------
export const generateKeyPair = async () => {
  const subtle = getSubtleCrypto();
  const keyPair = await subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"],
  );

  const publicKey = await subtle.exportKey("spki", keyPair.publicKey);
  const privateKey = await subtle.exportKey("pkcs8", keyPair.privateKey);

  return {
    publicKey: bufferToBase64(publicKey),
    privateKey: bufferToBase64(privateKey),
  };
};

export const encryptPrivateKeyWithPassword = async (
  privateKey: string,
  password: string,
): Promise<EncryptedPrivateKey> => {
  const subtle = getSubtleCrypto();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const wrappingKey = await derivePasswordKey(password, salt);

  const cipherText = await subtle.encrypt(
    { name: "AES-GCM", iv },
    wrappingKey,
    textToBytes(privateKey),
  );

  return {
    cipherText: bufferToBase64(cipherText),
    iv: bufferToBase64(iv),
    salt: bufferToBase64(salt),
  };
};

export const decryptPrivateKeyWithPassword = async (
  encryptedPrivateKey: EncryptedPrivateKey,
  password: string,
) => {
  const subtle = getSubtleCrypto();
  const salt = base64ToBuffer(encryptedPrivateKey.salt);
  const iv = base64ToBuffer(encryptedPrivateKey.iv);
  const wrappingKey = await derivePasswordKey(password, salt);

  const privateKey = await subtle.decrypt(
    { name: "AES-GCM", iv },
    wrappingKey,
    base64ToBuffer(encryptedPrivateKey.cipherText),
  );

  return new TextDecoder().decode(privateKey);
};

// --------------------
// 🔐 Import Keys
// --------------------
export const importPublicKey = async (key: string) => {
  if (!key) throw new Error("Missing public key");
  const subtle = getSubtleCrypto();

  return subtle.importKey(
    "spki",
    base64ToBuffer(key),
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"],
  );
};

export const importPrivateKey = async (key: string) => {
  if (!key) throw new Error("Missing private key");
  const subtle = getSubtleCrypto();

  return subtle.importKey(
    "pkcs8",
    base64ToBuffer(key),
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"],
  );
};

// --------------------
// 🔐 ENCRYPT (Hybrid)
// --------------------
export const encryptHybrid = async (
  text: string,
  receiverPublicKey: CryptoKey,
) => {
  if (!text) throw new Error("Empty message");
  const subtle = getSubtleCrypto();

  // 1️⃣ Generate AES key
  const aesKey = await subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );

  // 2️⃣ Encrypt message with AES
  const iv = crypto.getRandomValues(new Uint8Array(12)); // MUST be 12 bytes
  const encoded = new TextEncoder().encode(text);

  const encryptedData = await subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encoded,
  );

  // 3️⃣ Export AES key
  const rawAesKey = await subtle.exportKey("raw", aesKey);

  // 4️⃣ Encrypt AES key using RSA
  const encryptedKey = await subtle.encrypt(
    { name: "RSA-OAEP" },
    receiverPublicKey,
    rawAesKey,
  );

  return {
    cipherText: bufferToBase64(encryptedData),
    encryptedKey: bufferToBase64(encryptedKey),
    iv: bufferToBase64(iv),
  };
};

export const encryptHybridForRecipients = async (
  text: string,
  recipients: Array<{ uid: string; publicKey: CryptoKey }>,
) => {
  if (!text) throw new Error("Empty message");
  if (recipients.length === 0) throw new Error("No recipients");
  const subtle = getSubtleCrypto();

  const aesKey = await subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(text);

  const encryptedData = await subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encoded,
  );

  const rawAesKey = await subtle.exportKey("raw", aesKey);
  const encryptedKeys: Record<string, string> = {};

  await Promise.all(
    recipients.map(async ({ uid, publicKey }) => {
      const encryptedKey = await subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        rawAesKey,
      );

      encryptedKeys[uid] = bufferToBase64(encryptedKey);
    }),
  );

  return {
    cipherText: bufferToBase64(encryptedData),
    encryptedKeys,
    iv: bufferToBase64(iv),
  };
};

// --------------------
// 🔓 DECRYPT (Hybrid)
// --------------------
export const decryptHybrid = async (
  cipherText: string,
  encryptedKey: string,
  iv: string,
  privateKey: CryptoKey,
) => {
  if (!cipherText || !encryptedKey || !iv) {
    throw new Error("Missing encrypted fields");
  }
  const subtle = getSubtleCrypto();

  // 1️⃣ Decrypt AES key
  const aesKeyRaw = await subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    base64ToBuffer(encryptedKey),
  );

  const aesKey = await subtle.importKey(
    "raw",
    aesKeyRaw,
    { name: "AES-GCM" },
    false,
    ["decrypt"],
  );

  // 2️⃣ Decode IV
  const ivBuffer = base64ToBuffer(iv);

  if (ivBuffer.length !== 12) {
    throw new Error("Invalid IV length");
  }

  // 3️⃣ Decrypt message
  const decrypted = await subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivBuffer,
    },
    aesKey,
    base64ToBuffer(cipherText),
  );

  return new TextDecoder().decode(decrypted);
};
