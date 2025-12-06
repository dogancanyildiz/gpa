import { useState, useMemo, useRef, useEffect } from "react"

interface UsePaginationProps<T> {
  data: T[]
  itemsPerPage?: number
}

export function usePagination<T>({ data, itemsPerPage = 10 }: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const prevDataLengthRef = useRef(data.length)

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage))

  // Ensure currentPage is valid - calculate valid page without side effects
  const validCurrentPage = useMemo(() => {
    return Math.min(Math.max(1, currentPage), totalPages)
  }, [currentPage, totalPages])

  // Reset to page 1 when data shrinks and current page is out of bounds
  // Use useEffect to sync state when data length changes
  // This is necessary to reset pagination when filters reduce data size
  useEffect(() => {
    const prevDataLength = prevDataLengthRef.current
    if (data.length !== prevDataLength) {
      prevDataLengthRef.current = data.length
      // Only reset if current page is out of bounds
      if (currentPage > totalPages && totalPages > 0) {
        // Use setTimeout to avoid calling setState synchronously in effect
        // This prevents cascading renders while still resetting the page
        const timeoutId = setTimeout(() => {
          setCurrentPage(1)
        }, 0)
        return () => clearTimeout(timeoutId)
      }
    }
  }, [data.length, currentPage, totalPages])

  const paginatedData = useMemo(() => {
    const page = validCurrentPage
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return data.slice(startIndex, endIndex)
  }, [data, validCurrentPage, itemsPerPage])

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(validPage)
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Reset to page 1 when data changes
  const resetPagination = () => {
    setCurrentPage(1)
  }

  return {
    currentPage: validCurrentPage,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    previousPage,
    resetPagination,
    hasNextPage: validCurrentPage < totalPages,
    hasPreviousPage: validCurrentPage > 1,
    startIndex: (validCurrentPage - 1) * itemsPerPage,
    endIndex: Math.min(validCurrentPage * itemsPerPage, data.length),
    totalItems: data.length,
  }
}

