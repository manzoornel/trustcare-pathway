import { useEffect, useState, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const isIos = () =>
  /iphone|ipad|ipod/i.test(window.navigator.userAgent) &&
  !(window as any).MSStream;

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (window.navigator as any).standalone === true;

/**
 * Wraps the browser's install-app flow. Chrome/Edge/Android fire
 * `beforeinstallprompt`, which we capture and replay later from our own
 * "Download Your Patient App" button instead of relying on a browser-chrome
 * icon the patient may never notice. iOS Safari never fires this event —
 * there, `canPromptInstall` stays false and `isIosShareInstall` tells the
 * caller to show "Add to Home Screen" instructions instead.
 */
export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(isStandalone());

  useEffect(() => {
    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  return {
    canPromptInstall: !!deferredPrompt,
    isIosShareInstall: isIos() && !isStandalone(),
    installed,
    promptInstall,
  };
}
