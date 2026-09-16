const STORAGE_KEY = "onboostify-cookie-consent";
const OPEN_SETTINGS_EVENT = "onboostify:open-cookie-settings";

export interface CookieConsent {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

export function getStoredConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookieConsent;
  } catch {
    return null;
  }
}

export function storeConsent(consent: CookieConsent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // Private browsing or blocked storage — nothing to persist to.
  }
}

/** Opens the cookie settings modal from anywhere (e.g. the footer link),
 * without needing shared React state across layout boundaries. */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

export function onOpenCookieSettings(handler: () => void) {
  window.addEventListener(OPEN_SETTINGS_EVENT, handler);
  return () => window.removeEventListener(OPEN_SETTINGS_EVENT, handler);
}
