"use client"

import { useEffect } from "react"
import { registerServiceWorker, onOnlineStatusChange } from "@/lib/offline"
import { toast } from "sonner"

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register service worker
    registerServiceWorker()

    // Listen for online/offline changes
    const unsubscribe = onOnlineStatusChange((onlineStatus) => {
      if (onlineStatus) {
        toast.success("İnternet bağlantısı yeniden kuruldu")
      } else {
        toast.warning("İnternet bağlantısı kesildi. Offline modda çalışıyorsunuz.")
      }
    })

    return unsubscribe
  }, [])

  return <>{children}</>
}

