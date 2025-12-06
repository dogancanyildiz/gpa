"use client"

import { useState, useMemo } from "react"
import { IconPlus, IconBook, IconEdit, IconTrash, IconSearch, IconX } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useCourses } from "@/hooks/use-courses"
import { CourseForm } from "@/components/course-form"
import type { Course, CourseFormData } from "@/types/course"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { usePagination } from "@/hooks/use-pagination"

export function CoursesList() {
  const { courses, isLoading, addCourse, updateCourse, deleteCourse } = useCourses()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [creditFilter, setCreditFilter] = useState<string>("all")

  const handleSubmit = (data: CourseFormData) => {
    if (editingCourse) {
      updateCourse(editingCourse.id, data)
      setEditingCourse(null)
    } else {
      addCourse(data)
    }
    setIsDialogOpen(false)
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setIsDialogOpen(true)
  }

  const handleDelete = (course: Course) => {
    setDeletingCourse(course)
  }

  const confirmDelete = () => {
    if (deletingCourse) {
      deleteCourse(deletingCourse.id)
      setDeletingCourse(null)
    }
  }

  const handleAddNew = () => {
    setEditingCourse(null)
    setIsDialogOpen(true)
  }

  // Filter courses
  const filteredCourses = useMemo(() => {
    let filtered = courses

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (course) =>
          course.name.toLowerCase().includes(query) ||
          course.code?.toLowerCase().includes(query)
      )
    }

    // Credit filter
    if (creditFilter !== "all") {
      const credit = parseInt(creditFilter)
      filtered = filtered.filter((course) => course.credit === credit)
    }

    return filtered
  }, [courses, searchQuery, creditFilter])

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedCourses,
    goToPage,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({
    data: filteredCourses,
    itemsPerPage: 12,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dersler</h1>
          <p className="text-muted-foreground">
            Derslerinizi ekleyin, düzenleyin ve yönetin
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <IconPlus className="mr-2 h-4 w-4" />
              Yeni Ders
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? "Dersi Düzenle" : "Yeni Ders Ekle"}
              </DialogTitle>
              <DialogDescription>
                {editingCourse
                  ? "Ders bilgilerini güncelleyin"
                  : "Yeni bir ders eklemek için formu doldurun"}
              </DialogDescription>
            </DialogHeader>
            <CourseForm
              course={editingCourse || undefined}
              onSubmit={handleSubmit}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      {!isLoading && courses.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ders adı veya kodu ile ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <IconX className="h-4 w-4" />
              </button>
            )}
          </div>
          <Select value={creditFilter} onValueChange={setCreditFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="AKTS Filtrele" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm AKTS</SelectItem>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((credit) => (
                <SelectItem key={credit} value={credit.toString()}>
                  {credit} AKTS
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Results count */}
      {!isLoading && courses.length > 0 && (searchQuery || creditFilter !== "all") && (
        <div className="text-sm text-muted-foreground">
          {filteredCourses.length} ders bulundu
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <IconBook className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Henüz ders eklenmemiş</h3>
            <p className="text-muted-foreground text-center mb-4">
              Başlamak için yeni bir ders ekleyin
            </p>
            <Button onClick={handleAddNew}>
              <IconPlus className="mr-2 h-4 w-4" />
              İlk Dersinizi Ekleyin
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginatedCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{course.name}</CardTitle>
                    {course.code && (
                      <CardDescription className="mt-1">
                        {course.code}
                      </CardDescription>
                    )}
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {course.credit} AKTS
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(course)}
                  >
                    <IconEdit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(course)}
                    className="text-destructive hover:text-destructive"
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {startIndex + 1}-{endIndex} / {totalItems} ders
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={previousPage}
                      className={!hasPreviousPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => goToPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }
                    return null
                  })}
                  <PaginationItem>
                    <PaginationNext
                      onClick={nextPage}
                      className={!hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      <AlertDialog
        open={deletingCourse !== null}
        onOpenChange={(open) => !open && setDeletingCourse(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Dersi Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deletingCourse?.name}</strong> dersini silmek istediğinize emin misiniz?
              Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

