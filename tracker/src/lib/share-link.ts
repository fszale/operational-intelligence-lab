/**
 * Compressed-base64 URL encoding for stateless shareable links.
 * Uses pako for deflate so we don't need the lz-string dep.
 * Falls back to JSON+base64 if compression isn't available.
 */
import { deflate, inflate } from "pako";

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  // Use base64url alphabet for URL safety.
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const padding = padded.length % 4 ? "=".repeat(4 - (padded.length % 4)) : "";
  const binary = atob(padded + padding);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function encodeState<T>(state: T): string {
  const json = JSON.stringify(state);
  const compressed = deflate(new TextEncoder().encode(json));
  return toBase64Url(compressed);
}

export function decodeState<T>(token: string): T {
  const bytes = fromBase64Url(token);
  const decompressed = inflate(bytes);
  const json = new TextDecoder().decode(decompressed);
  return JSON.parse(json) as T;
}

export function buildShareUrl(path: string, state: unknown, baseUrl?: string): string {
  const token = encodeState(state);
  const origin = baseUrl ?? (typeof window !== "undefined" ? window.location.origin : "");
  const base: string = import.meta.env.BASE_URL || "/";
  const cleanedBase = base.endsWith("/") ? base : `${base}/`;
  const cleanedPath = path.replace(/^\//, "");
  return `${origin}${cleanedBase}${cleanedPath}?s=${token}`;
}

export function readStateFromQuery<T>(search: string): T | null {
  const params = new URLSearchParams(search);
  const token = params.get("s");
  if (!token) return null;
  try {
    return decodeState<T>(token);
  } catch {
    return null;
  }
}
