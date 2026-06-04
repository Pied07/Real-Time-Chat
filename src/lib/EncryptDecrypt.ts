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

const base64ToBuffer = (base64: string) => {
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
  } catch (err) {
    console.error("❌ Invalid Base64:", base64);
    throw new Error("Base64 decoding failed");
  }
};

// --------------------
// 🔑 Generate RSA Keys
// --------------------
export const generateKeyPair = async () => {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"],
  );

  const publicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
  const privateKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

  return {
    publicKey: bufferToBase64(publicKey),
    privateKey: bufferToBase64(privateKey),
  };
};

// --------------------
// 🔐 Import Keys
// --------------------
export const importPublicKey = async (key: string) => {
  if (!key) throw new Error("Missing public key");

  return crypto.subtle.importKey(
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

  return crypto.subtle.importKey(
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

  // 1️⃣ Generate AES key
  const aesKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );

  // 2️⃣ Encrypt message with AES
  const iv = crypto.getRandomValues(new Uint8Array(12)); // MUST be 12 bytes
  const encoded = new TextEncoder().encode(text);

  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encoded,
  );

  // 3️⃣ Export AES key
  const rawAesKey = await crypto.subtle.exportKey("raw", aesKey);

  // 4️⃣ Encrypt AES key using RSA
  const encryptedKey = await crypto.subtle.encrypt(
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

  // 1️⃣ Decrypt AES key
  const aesKeyRaw = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    base64ToBuffer(encryptedKey),
  );

  const aesKey = await crypto.subtle.importKey(
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
  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivBuffer,
    },
    aesKey,
    base64ToBuffer(cipherText),
  );

  return new TextDecoder().decode(decrypted);
};