"use client"

import { useState } from "react"
import { IconPlus, IconBook, IconEdit, IconTrash } from "@tabler/icons-react"
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

export function CoursesList() {
  const { courses, isLoading, addCourse, updateCourse, deleteCourse } = useCourses()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null)

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
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

