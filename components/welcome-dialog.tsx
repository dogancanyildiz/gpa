"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { IconInfoCircle } from "@tabler/icons-react"

const STORAGE_KEY = "gpa-welcome-dialog-dismissed"

export function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if we're on the client side before accessing localStorage
    if (typeof window === "undefined") return

    // Check if user has dismissed the dialog before
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (!dismissed) {
      // Show dialog after a short delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = (dontShowAgain: boolean) => {
    setIsOpen(false)
    if (dontShowAgain && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "true")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <IconInfoCircle className="h-5 w-5 text-primary" />
            <DialogTitle>Hoş Geldiniz!</DialogTitle>
          </div>
          <DialogDescription className="pt-2 space-y-2">
            <p>
              Uygulamayı giriş yapmadan kullanabilirsiniz. Tüm verileriniz tarayıcınızda 
              (localStorage) saklanır.
            </p>
            <p className="font-medium text-foreground">
              ⚠️ Önemli: Verilerinizin kalıcı olmasını ve farklı cihazlardan erişebilmek 
              istiyorsanız, lütfen giriş yaparak kullanın.
            </p>
            <p className="text-sm text-muted-foreground">
              Giriş yapmadan kullanırsanız, tarayıcı verilerini temizlediğinizde veya 
              farklı bir cihaz kullandığınızda verileriniz kaybolabilir.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => handleDismiss(true)}
            className="w-full sm:w-auto"
          >
            Bir Daha Gösterme
          </Button>
          <Button onClick={() => handleDismiss(false)} className="w-full sm:w-auto">
            Anladım
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

