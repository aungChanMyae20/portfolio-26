import CryptoJS from "crypto-js";

// VITE_ENCRYPTION_KEY should be a 64-character hex string
const KEY_HEX = import.meta.env.VITE_ENCRYPTION_KEY || "";

if (!KEY_HEX || KEY_HEX.length !== 64) {
    console.warn("VITE_ENCRYPTION_KEY is missing or invalid. Encryption will fail.");
}

const key = CryptoJS.enc.Hex.parse(KEY_HEX);

export const encryptInfo = (text: string): string => {
    // Generate a random 16-byte IV
    const iv = CryptoJS.lib.WordArray.random(16);
    
    // Encrypt the text
    const encrypted = CryptoJS.AES.encrypt(text, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    
    // Combine the IV (hex) and the CipherText (hex) to match backend format (ivHex:cipherHex)
    return `${iv.toString(CryptoJS.enc.Hex)}:${encrypted.ciphertext.toString(CryptoJS.enc.Hex)}`;
};

export const decryptInfo = (encryptedData: string): string => {
    const parts = encryptedData.split(":");
    if (parts.length !== 2) {
        throw new Error("Invalid encrypted data format");
    }
    
    const ivHex = parts[0];
    const cipherHex = parts[1];
    
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    
    // To decrypt, we need to create a CipherParams object with the ciphertext
    const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Hex.parse(cipherHex)
    });
    
    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    
    return decrypted.toString(CryptoJS.enc.Utf8);
};
