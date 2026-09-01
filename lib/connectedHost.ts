import { useSyncExternalStore } from "react";

const CONNECTED_HOST_PHONE_KEY = "swingrides_connected_host_phone";

export const getStoredConnectedPhone = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(CONNECTED_HOST_PHONE_KEY);
  } catch {
    return null;
  }
};

export const setStoredConnectedPhone = (phoneNumber: string): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONNECTED_HOST_PHONE_KEY, phoneNumber);
    window.dispatchEvent(new Event("storage"));
  } catch {
    // Ignore storage failures (private browsing, quota, etc.)
  }
};

export const clearStoredConnectedPhone = (): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CONNECTED_HOST_PHONE_KEY);
    window.dispatchEvent(new Event("storage"));
  } catch {
    // Ignore storage failures
  }
};

const subscribe = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getSnapshot = (): string | undefined => {
  return getStoredConnectedPhone() ?? undefined;
};

const getServerSnapshot = (): string | undefined => {
  return undefined;
};

export const useStoredConnectedPhone = (): string | undefined => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
