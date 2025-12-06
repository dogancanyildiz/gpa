"use client"

/**
 * Register service worker for offline support
 */
export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return
  }

  // If page is already loaded, register immediately
  // Otherwise, wait for load event
  const register = () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration.scope)
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error)
      })
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    // Page is already loaded or loading, register immediately
    register()
  } else {
    // Page is still loading, wait for load event
    window.addEventListener("load", register)
  }
}

/**
 * Check if app is online
 */
export function isOnline(): boolean {
  if (typeof window === "undefined") return true
  return navigator.onLine
}

/**
 * Listen for online/offline events
 */
export function onOnlineStatusChange(callback: (isOnline: boolean) => void) {
  if (typeof window === "undefined") return () => {}

  const handleOnline = () => callback(true)
  const handleOffline = () => callback(false)

  window.addEventListener("online", handleOnline)
  window.addEventListener("offline", handleOffline)

  return () => {
    window.removeEventListener("online", handleOnline)
    window.removeEventListener("offline", handleOffline)
  }
}

