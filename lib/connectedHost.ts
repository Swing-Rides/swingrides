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
  } catch {
    // Ignore storage failures (private browsing, quota, etc.)
  }
};

export const clearStoredConnectedPhone = (): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CONNECTED_HOST_PHONE_KEY);
  } catch {
    // Ignore storage failures
  }
};
