// app/utils/encryption.ts

export async function encryptFile(file: File) {
  const arrayBuffer = await file.arrayBuffer();

  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    arrayBuffer
  );

  const exportedKey = await crypto.subtle.exportKey("raw", key);
  const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
  const ivBase64 = btoa(String.fromCharCode(...iv));

  // Return a Blob, so UploadThing can handle it
  const encryptedBlob = new Blob([encrypted], { type: "application/octet-stream" });
  const encryptedFile = new File([encryptedBlob], file.name + ".enc");

  return {
    encryptedFile,
    key: keyBase64,
    iv: ivBase64,
  };
}

export async function decryptFile(
  encryptedBlob: Blob,
  keyBase64: string,
  ivBase64: string
) {
  const keyBytes = Uint8Array.from(atob(keyBase64), (c) => c.charCodeAt(0));
  const iv = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    "AES-GCM",
    false,
    ["decrypt"]
  );

  const encryptedArrayBuffer = await encryptedBlob.arrayBuffer();

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encryptedArrayBuffer
  );

  return new Blob([decrypted]);
}
