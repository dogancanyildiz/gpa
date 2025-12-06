/**
 * Error handling utilities
 */

export interface AppError {
  message: string
  code?: string
  details?: unknown
}

export class StorageError extends Error {
  constructor(message: string, public code: string = "STORAGE_ERROR") {
    super(message)
    this.name = "StorageError"
  }
}

export class ValidationError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message)
    this.name = "ValidationError"
  }
}

/**
 * Handle localStorage errors
 */
export function handleStorageError(error: unknown, operation: string): StorageError {
  if (error instanceof DOMException) {
    if (error.name === "QuotaExceededError") {
      return new StorageError(
        "Depolama alanı dolu. Lütfen bazı verileri silin ve tekrar deneyin.",
        "QUOTA_EXCEEDED"
      )
    }
    if (error.name === "SecurityError") {
      return new StorageError(
        "Güvenlik hatası. Tarayıcı ayarlarınızı kontrol edin.",
        "SECURITY_ERROR"
      )
    }
  }

  return new StorageError(
    `${operation} sırasında bir hata oluştu: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`,
    "STORAGE_ERROR"
  )
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof StorageError) {
    return error.message
  }

  if (error instanceof ValidationError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Beklenmeyen bir hata oluştu"
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = "__localStorage_test__"
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

