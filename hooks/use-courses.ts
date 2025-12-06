"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import type { Course, CourseFormData } from "@/types/course"
import { courseSchema } from "@/types/course"

const STORAGE_KEY = "gpa-courses"

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load courses from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Course[]
        // Validate with Zod
        const validated = parsed.filter((course) => {
          const result = courseSchema.safeParse(course)
          if (!result.success) {
            console.warn("Invalid course data:", course, result.error)
          }
          return result.success
        })
        setCourses(validated)
      }
    } catch (error) {
      console.error("Error loading courses:", error)
      toast.error("Dersler yüklenirken bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save courses to localStorage
  const saveCourses = useCallback((newCourses: Course[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCourses))
      setCourses(newCourses)
    } catch (error) {
      console.error("Error saving courses:", error)
      toast.error("Dersler kaydedilirken bir hata oluştu")
    }
  }, [])

  // Add new course
  const addCourse = useCallback(
    (data: CourseFormData) => {
      const newCourse: Course = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }

      const validated = courseSchema.safeParse(newCourse)
      if (!validated.success) {
        toast.error("Geçersiz ders verisi")
        return false
      }

      const updatedCourses = [...courses, validated.data]
      saveCourses(updatedCourses)
      toast.success("Ders başarıyla eklendi")
      return true
    },
    [courses, saveCourses]
  )

  // Update existing course
  const updateCourse = useCallback(
    (id: string, data: CourseFormData) => {
      const updatedCourses = courses.map((course) =>
        course.id === id
          ? {
              ...course,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : course
      )

      // Validate all courses
      const validated = updatedCourses
        .map((course) => {
          const result = courseSchema.safeParse(course)
          return result.success ? result.data : null
        })
        .filter((course): course is Course => course !== null)

      saveCourses(validated)
      toast.success("Ders başarıyla güncellendi")
      return true
    },
    [courses, saveCourses]
  )

  // Delete course
  const deleteCourse = useCallback(
    (id: string) => {
      const updatedCourses = courses.filter((course) => course.id !== id)
      saveCourses(updatedCourses)
      toast.success("Ders başarıyla silindi")
      return true
    },
    [courses, saveCourses]
  )

  // Get course by ID
  const getCourse = useCallback(
    (id: string) => {
      return courses.find((course) => course.id === id)
    },
    [courses]
  )

  return {
    courses,
    isLoading,
    addCourse,
    updateCourse,
    deleteCourse,
    getCourse,
  }
}

