import assert from "node:assert/strict";
import test from "node:test";
import { downloadBodyMarkImage } from "../src/body-mark";

test("body-mark PNG header includes the recorded timestamp or historical fallback", async () => {
  const text: string[] = [];
  const originalDocument = globalThis.document;
  const originalImage = globalThis.Image;
  const originalWindow = globalThis.window;
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;
  const context = {
    scale() {}, fillRect() {}, fillText(value: string) { text.push(value); }, drawImage() {}, beginPath() {}, arc() {},
  } as unknown as CanvasRenderingContext2D;
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => context,
    toBlob: (callback: BlobCallback) => callback(new Blob()),
  };
  const link = { href: "", download: "", click() {}, remove() {} };

  class MockImage {
    naturalWidth = 300;
    naturalHeight = 100;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    set src(_: string) { queueMicrotask(() => this.onload?.()); }
  }

  globalThis.document = {
    createElement: ((tag: string) => tag === "canvas" ? canvas : link) as typeof document.createElement,
    body: { appendChild() {} },
  } as unknown as Document;
  globalThis.Image = MockImage as unknown as typeof Image;
  globalThis.window = { setTimeout: () => 0 } as unknown as Window & typeof globalThis;
  URL.createObjectURL = (() => "blob:body-mark") as typeof URL.createObjectURL;
  URL.revokeObjectURL = (() => {}) as typeof URL.revokeObjectURL;

  try {
    const recordedAt = "2026-09-27T10:20:00.000Z";
    await downloadBodyMarkImage([], { jobNo: "JC-1", vehicleName: "Kia Seltos", color: "Red", regNo: "OD01A1", recordedAt });
    assert.ok(text.includes(`Date & Time of Record: ${new Date(recordedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}`));

    text.length = 0;
    await downloadBodyMarkImage([], { vehicleName: "Kia Seltos", regNo: "OD01A1" });
    assert.ok(text.includes("Date & Time of Record: Not recorded"));
  } finally {
    globalThis.document = originalDocument;
    globalThis.Image = originalImage;
    globalThis.window = originalWindow;
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  }
});
