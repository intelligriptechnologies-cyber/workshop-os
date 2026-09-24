export const ACCEPTED_MEDIA_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export type JobMediaCategory = "Before Work" | "After Work";

export const MAX_MEDIA_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_MEDIA_DATA_URL_BYTES = 1_000_000;
export const MAX_MEDIA_DIMENSION = 1600;

const signatures: Record<(typeof ACCEPTED_MEDIA_MIME_TYPES)[number], (bytes: Uint8Array) => boolean> = {
  "image/jpeg": (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  "image/png": (bytes) => bytes.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((value, index) => bytes[index] === value),
  "image/webp": (bytes) => new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP",
};

function decodedBytes(base64: string) {
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64) || base64.length % 4 !== 0) throw new Error("The compressed image data is invalid.");
  if (typeof Buffer !== "undefined") return new Uint8Array(Buffer.from(base64, "base64"));
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
}

export function validateMediaDataUrl(src: string) {
  const match = /^data:([^;,]+);base64,([A-Za-z0-9+/=]+)$/.exec(src);
  if (!match) throw new Error("Media must be a compressed image data URL.");
  const mimeType = match[1].toLowerCase();
  if (!ACCEPTED_MEDIA_MIME_TYPES.includes(mimeType as (typeof ACCEPTED_MEDIA_MIME_TYPES)[number])) throw new Error("Only JPEG, PNG, or WebP images are accepted.");
  const bytes = decodedBytes(match[2]);
  if (bytes.byteLength > MAX_MEDIA_DATA_URL_BYTES) throw new Error("The compressed image is too large.");
  if (!signatures[mimeType as keyof typeof signatures](bytes)) throw new Error("The image content does not match its MIME type.");
  return { mimeType, byteSize: bytes.byteLength };
}

export async function validateMediaFile(file: File) {
  if (!ACCEPTED_MEDIA_MIME_TYPES.includes(file.type as (typeof ACCEPTED_MEDIA_MIME_TYPES)[number])) throw new Error("Choose a JPEG, PNG, or WebP image.");
  if (file.size <= 0) throw new Error("The selected image is empty.");
  if (file.size > MAX_MEDIA_FILE_BYTES) throw new Error("Images must be 10 MB or smaller.");
  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (!signatures[file.type as keyof typeof signatures](header)) throw new Error("The image content does not match its MIME type.");
}

export interface PreparedJobMedia {
  src: string;
  mimeType: string;
  byteSize: number;
  originalName: string;
  width: number;
  height: number;
}

export async function compressMediaFile(file: File): Promise<PreparedJobMedia> {
  await validateMediaFile(file);
  const bitmap = await createImageBitmap(file);
  let scale = Math.min(1, MAX_MEDIA_DIMENSION / Math.max(bitmap.width, bitmap.height));
  let quality = 0.86;
  let src = "";
  let width = 0;
  let height = 0;
  try {
    for (let attempt = 0; attempt < 8; attempt += 1) {
      width = Math.max(1, Math.round(bitmap.width * scale));
      height = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Image compression is unavailable in this browser.");
      context.drawImage(bitmap, 0, 0, width, height);
      src = canvas.toDataURL("image/jpeg", quality);
      try {
        const validated = validateMediaDataUrl(src);
        return { src, ...validated, originalName: file.name, width, height };
      } catch (error) {
        if (!(error instanceof Error) || !error.message.includes("too large")) throw error;
      }
      quality = Math.max(0.5, quality - 0.08);
      scale *= 0.78;
    }
  } finally {
    bitmap.close();
  }
  throw new Error("This image could not be compressed below 1 MB. Choose a smaller image.");
}
