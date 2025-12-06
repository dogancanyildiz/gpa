"use client"

import { useState, useCallback } from "react"
import { IconPlus, IconFileText, IconEdit, IconTrash, IconCalculator, IconSearch, IconX } from "@tabler/icons-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useGrades } from "@/hooks/use-grades"
import { useCourses } from "@/hooks/use-courses"
import { GradeForm } from "@/components/grade-form"
import type { Grade } from "@/types/grade"
import { GRADE_SCALE } from "@/types/grade"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
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

export function GradesList() {
  const { grades, isLoading: gradesLoading, addGrade, updateGrade, deleteGrade } = useGrades()
  const { courses, isLoading: coursesLoading } = useCourses()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null)
  const [deletingGrade, setDeletingGrade] = useState<Grade | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [gradeFilter, setGradeFilter] = useState<string>("all")

  const isLoading = gradesLoading || coursesLoading

  // Filter grades by selected course, search, and grade
  let filteredGrades = grades

  // Course filter
  if (selectedCourseId !== "all") {
    filteredGrades = filteredGrades.filter((grade) => grade.courseId === selectedCourseId)
  }

  // Search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim()
    filteredGrades = filteredGrades.filter((grade) => {
      const courseName = getCourseName(grade.courseId).toLowerCase()
      return courseName.includes(query)
    })
  }

  // Grade filter
  if (gradeFilter !== "all") {
    filteredGrades = filteredGrades.filter((grade) => grade.letterGrade === gradeFilter)
  }

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedGrades,
    goToPage,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({
    data: filteredGrades,
    itemsPerPage: 10,
  })

  // Get course name by ID
  const getCourseName = useCallback((courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    return course?.name || "Bilinmeyen Ders"
  }, [courses])

  // Get grade badge color
  const getGradeBadgeVariant = (letterGrade?: string) => {
    if (!letterGrade) return "secondary"
    const grade = GRADE_SCALE.find((g) => g.letter === letterGrade)
    if (!grade) return "secondary"
    
    if (grade.coefficient >= 3.5) return "default" // AA, BA
    if (grade.coefficient >= 2.5) return "secondary" // BB, CB
    if (grade.coefficient >= 1.5) return "outline" // CC, DC
    return "destructive" // DD, FD, FF
  }

  const handleSubmit = (data: { courseId: string; midterm?: number; quiz?: number; final?: number }) => {
    if (editingGrade) {
      updateGrade(editingGrade.id, data)
      setEditingGrade(null)
    } else {
      addGrade(data)
    }
    setIsDialogOpen(false)
  }

  const handleEdit = (grade: Grade) => {
    setEditingGrade(grade)
    setIsDialogOpen(true)
  }

  const handleDelete = (grade: Grade) => {
    setDeletingGrade(grade)
  }

  const confirmDelete = () => {
    if (deletingGrade) {
      deleteGrade(deletingGrade.id)
      setDeletingGrade(null)
    }
  }

  const handleAddNew = () => {
    if (courses.length === 0) {
      return
    }
    setEditingGrade(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notlar</h1>
          <p className="text-muted-foreground">
            Derslerinize not ekleyin ve hesaplamaları görüntüleyin
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Ders seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Dersler</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew} disabled={courses.length === 0}>
                <IconPlus className="mr-2 h-4 w-4" />
                Yeni Not
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingGrade ? "Notu Düzenle" : "Yeni Not Ekle"}
                </DialogTitle>
                <DialogDescription>
                  {editingGrade
                    ? "Not bilgilerini güncelleyin"
                    : "Yeni bir not eklemek için formu doldurun"}
                </DialogDescription>
              </DialogHeader>
              <GradeForm
                grade={editingGrade || undefined}
                courses={courses}
                onSubmit={handleSubmit}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filter */}
      {courses.length > 0 && !isLoading && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ders adı ile ara..."
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
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Harf Notu Filtrele" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Notlar</SelectItem>
              {GRADE_SCALE.map((grade) => (
                <SelectItem key={grade.letter} value={grade.letter}>
                  {grade.letter}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Results count */}
      {courses.length > 0 && !isLoading && (searchQuery || gradeFilter !== "all" || selectedCourseId !== "all") && (
        <div className="text-sm text-muted-foreground">
          {filteredGrades.length} not bulundu
        </div>
      )}

      {courses.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <IconFileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Önce ders ekleyin</h3>
            <p className="text-muted-foreground text-center mb-4">
              Not eklemek için önce bir ders eklemeniz gerekiyor
            </p>
            <Button asChild>
              <a href="/courses">
                <IconPlus className="mr-2 h-4 w-4" />
                Ders Ekle
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      {courses.length > 0 && isLoading ? (
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      ) : courses.length > 0 && filteredGrades.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <IconCalculator className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Henüz not eklenmemiş</h3>
            <p className="text-muted-foreground text-center mb-4">
              {selectedCourseId === "all"
                ? "Başlamak için yeni bir not ekleyin"
                : "Bu ders için henüz not eklenmemiş"}
            </p>
            <Button onClick={handleAddNew}>
              <IconPlus className="mr-2 h-4 w-4" />
              İlk Notunuzu Ekleyin
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Not Listesi</CardTitle>
            <CardDescription>
              {selectedCourseId === "all"
                ? `${filteredGrades.length} not bulundu`
                : `${getCourseName(selectedCourseId)} dersine ait ${filteredGrades.length} not`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ders</TableHead>
                  <TableHead className="text-right">Vize</TableHead>
                  <TableHead className="text-right">Kısa Sınav</TableHead>
                  <TableHead className="text-right">Final</TableHead>
                  <TableHead className="text-right">Toplam</TableHead>
                  <TableHead className="text-right">Harf Notu</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedGrades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell className="font-medium">
                      {getCourseName(grade.courseId)}
                    </TableCell>
                    <TableCell className="text-right">
                      {grade.midterm !== undefined ? grade.midterm.toFixed(1) : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {grade.quiz !== undefined ? grade.quiz.toFixed(1) : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {grade.final !== undefined ? grade.final.toFixed(1) : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {grade.totalScore !== undefined ? (
                        <span className="font-semibold">
                          {grade.totalScore.toFixed(2)}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {grade.letterGrade ? (
                        <Badge variant={getGradeBadgeVariant(grade.letterGrade)}>
                          {grade.letterGrade}
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(grade)}
                        >
                          <IconEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(grade)}
                          className="text-destructive hover:text-destructive"
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 pb-6">
              <div className="text-sm text-muted-foreground">
                {startIndex + 1}-{endIndex} / {totalItems} not
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
        </Card>
      )}

      <AlertDialog
        open={deletingGrade !== null}
        onOpenChange={(open) => !open && setDeletingGrade(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Notu Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu notu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
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

